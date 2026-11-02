/* ==========================================================================
   Módulo PWA + Sincronización Opcional en la Nube (Firebase Modular v10.14.1)
   - Registra el Service Worker (./sw.js) y gestiona el aviso de actualización
   - Solicita almacenamiento persistente (navigator.storage.persist)
   - Muestra estado de sincronización SOLO en la insignia del encabezado y en
     la sección Respaldo (con debounce de 500 ms y sin repetir el mismo estado)
   - Previene bucles infinitos con bandera applyingRemote, comparación de huella
     de contenido y filtrado de snapshots con hasPendingWrites / fromCache
   ========================================================================== */

(function () {
  'use strict';

  const firebaseConfig = {
  apiKey: "AIzaSyA3gIh3hCASd9RV3nRccycNBplI5QYIZmE",
  authDomain: "wilcomcat.firebaseapp.com",
  projectId: "wilcomcat",
  storageBucket: "wilcomcat.firebasestorage.app",
  messagingSenderId: "434548407283",
  appId: "1:434548407283:web:22f4a9f8d05091f59df086",
  measurementId: "G-1H37RY8S0X"
  };

  const FIREBASE_SDK_BASE = 'https://www.gstatic.com/firebasejs/10.14.1';
  const SYNC_META_KEY = 'wilcon_pwa_sync_prefs_v2';
  const CUSTOM_FB_CFG_KEY = 'wilcon_custom_firebase_cfg_v2';

  /* ========================================================================
     MOTOR DE FUSIÓN POR REGISTRO (Last-Write-Wins + Tombstones deleted:true)
     ======================================================================== */
  function normalizeRecord(rec, fallbackIdx) {
    const copy = Object.assign({}, rec);
    if (!copy.id) {
      copy.id = 'rec_' + (fallbackIdx || 0) + '_' + Date.now();
    }
    if (typeof copy.updatedAt !== 'number' || !Number.isFinite(copy.updatedAt)) {
      copy.updatedAt = 1;
    }
    copy.deleted = Boolean(copy.deleted);
    return copy;
  }

  function mergeRecordsById(localList, remoteList) {
    const map = new Map();
    const a = Array.isArray(localList) ? localList : [];
    const b = Array.isArray(remoteList) ? remoteList : [];

    for (let i = 0; i < a.length; i++) {
      const item = normalizeRecord(a[i], i);
      map.set(item.id, item);
    }

    for (let j = 0; j < b.length; j++) {
      const rem = normalizeRecord(b[j], j);
      const existing = map.get(rem.id);
      if (!existing || rem.updatedAt > existing.updatedAt) {
        map.set(rem.id, rem);
      }
    }

    return Array.from(map.values());
  }

  function mergeAppState(localState, remoteDoc, includeMood) {
    const merged = JSON.parse(JSON.stringify(localState));
    const remote = remoteDoc && typeof remoteDoc === 'object' ? remoteDoc : {};

    merged.schedule = mergeRecordsById(localState.schedule, remote.schedule);
    merged.tasks = mergeRecordsById(localState.tasks, remote.tasks);

    const localCourses = (localState.grades && Array.isArray(localState.grades.courses))
      ? localState.grades.courses
      : [];
    const remoteCourses = (remote.grades && Array.isArray(remote.grades.courses))
      ? remote.grades.courses
      : [];
    const mergedCourses = mergeRecordsById(localCourses, remoteCourses);

    if (!merged.grades) merged.grades = {};
    merged.grades.courses = mergedCourses;

    const activeCourses = mergedCourses.filter(function (c) { return !c.deleted; });
    if (activeCourses.length > 0) {
      const stillActive = activeCourses.some(function (c) { return c.id === merged.grades.activeCourseId; });
      if (!stillActive) {
        merged.grades.activeCourseId = activeCourses[0].id;
      }
    }

    if (includeMood && remote.mood) {
      const localHist = (localState.mood && Array.isArray(localState.mood.history)) ? localState.mood.history : [];
      const remoteHist = Array.isArray(remote.mood.history) ? remote.mood.history : [];
      const mergedHist = mergeRecordsById(localHist, remoteHist).sort(function (x, y) {
        return (y.updatedAt || 0) - (x.updatedAt || 0);
      });
      merged.mood.history = mergedHist.slice(0, 30);
      merged.mood.streak = Math.max(Number(localState.mood.streak || 1), Number(remote.mood.streak || 1));
      if ((remote.mood.lastDate || '') > (merged.mood.lastDate || '')) {
        merged.mood.lastDate = remote.mood.lastDate;
      }
    }

    const stats = {
      activeSchedule: merged.schedule.filter(function (s) { return !s.deleted; }).length,
      activeTasks: merged.tasks.filter(function (t) { return !t.deleted; }).length,
      activeCourses: activeCourses.length,
      tombstones:
        merged.schedule.filter(function (s) { return s.deleted; }).length +
        merged.tasks.filter(function (t) { return t.deleted; }).length +
        mergedCourses.filter(function (c) { return c.deleted; }).length
    };

    return { mergedState: merged, stats: stats };
  }

  function buildCloudPayload(state, includeMood) {
    const payload = {
      updatedAt: Date.now(),
      schedule: Array.isArray(state.schedule) ? state.schedule : [],
      tasks: Array.isArray(state.tasks) ? state.tasks : [],
      grades: {
        activeCourseId: state.grades ? state.grades.activeCourseId : 'c1',
        courses: (state.grades && Array.isArray(state.grades.courses)) ? state.grades.courses : []
      }
    };
    if (includeMood && state.mood) {
      payload.mood = {
        streak: state.mood.streak || 1,
        lastDate: state.mood.lastDate || '',
        history: Array.isArray(state.mood.history) ? state.mood.history : []
      };
    }
    return payload;
  }

  /**
   * Calcula una huella determinista del contenido sincronizable (sin el timestamp global)
   * para comparar antes de escribir en local o en Firestore y evitar bucles.
   */
  function computeSyncFingerprint(docOrState, includeMood) {
    if (!docOrState || typeof docOrState !== 'object') return '';
    const sortById = function (arr) {
      return (Array.isArray(arr) ? arr.slice() : []).sort(function (a, b) {
        return String(a.id || '').localeCompare(String(b.id || ''));
      });
    };
    const canonical = {
      schedule: sortById(docOrState.schedule),
      tasks: sortById(docOrState.tasks),
      courses: sortById(docOrState.grades && docOrState.grades.courses)
    };
    if (includeMood && docOrState.mood) {
      canonical.mood = {
        streak: docOrState.mood.streak || 1,
        lastDate: docOrState.mood.lastDate || '',
        history: sortById(docOrState.mood.history)
      };
    }
    return JSON.stringify(canonical);
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      mergeRecordsById: mergeRecordsById,
      mergeAppState: mergeAppState,
      buildCloudPayload: buildCloudPayload,
      computeSyncFingerprint: computeSyncFingerprint
    };
  }
  if (typeof window !== 'undefined') {
    window.WilconSyncEngine = {
      mergeRecordsById: mergeRecordsById,
      mergeAppState: mergeAppState,
      buildCloudPayload: buildCloudPayload,
      computeSyncFingerprint: computeSyncFingerprint
    };
  }

  if (typeof document === 'undefined') {
    return;
  }

  /* ========================================================================
     FASE 1 · PWA: SERVICE WORKER, INSTALACIÓN Y ALMACENAMIENTO PERSISTENTE
     ======================================================================== */
  let deferredInstallPrompt = null;
  let waitingServiceWorker = null;
  let reloadingForSw = false;

  function requestPersistentStorage() {
    const statusEl = document.getElementById('storage-persist-status');
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(function (granted) {
        if (statusEl) {
          statusEl.textContent = granted
            ? '🔒 Almacenamiento persistente activo: el navegador protegerá tus datos locales.'
            : '💾 Almacenamiento local activo y protegido en este dispositivo.';
        }
      }).catch(function () {});
    }
  }

  function showUpdateBanner(worker) {
    waitingServiceWorker = worker;
    const banner = document.getElementById('pwa-update-banner');
    if (banner) {
      banner.style.display = 'flex';
    }
  }

  function registerRelativeServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') return;

    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .then(function (reg) {
          if (reg.waiting) {
            showUpdateBanner(reg.waiting);
          }
          reg.addEventListener('updatefound', function () {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', function () {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                showUpdateBanner(newWorker);
              }
            });
          });
        })
        .catch(function () {});

      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (reloadingForSw) return;
        reloadingForSw = true;
        window.location.reload();
      });
    });
  }

  function isIosDevice() {
    const ua = window.navigator.userAgent || '';
    const isIPhoneIPad = /iPhone|iPad|iPod/i.test(ua);
    const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return isIPhoneIPad || isIPadOS;
  }

  function isStandaloneMode() {
    return (
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true
    );
  }

  function setupPwaInstallUI() {
    const topInstallBtn = document.getElementById('btn-pwa-install');
    const panelInstallBtn = document.getElementById('btn-pwa-install-panel');
    const iosGuideBox = document.getElementById('ios-install-guide');
    const updateNowBtn = document.getElementById('btn-pwa-update-now');
    const updateLaterBtn = document.getElementById('btn-pwa-update-later');
    const updateBanner = document.getElementById('pwa-update-banner');

    if (isIosDevice() && !isStandaloneMode()) {
      if (topInstallBtn) topInstallBtn.style.display = 'inline-flex';
      if (iosGuideBox) iosGuideBox.style.display = 'block';
    }

    window.addEventListener('beforeinstallprompt', function (ev) {
      ev.preventDefault();
      deferredInstallPrompt = ev;
      if (topInstallBtn) topInstallBtn.style.display = 'inline-flex';
      if (panelInstallBtn) panelInstallBtn.style.display = 'inline-flex';
    });

    function triggerInstallFlow() {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function () {
          deferredInstallPrompt = null;
          if (topInstallBtn) topInstallBtn.style.display = 'none';
        });
      } else {
        if (iosGuideBox) {
          iosGuideBox.style.display = 'block';
        }
        if (window.WilconApp && window.WilconApp.showToast) {
          window.WilconApp.showToast('📲 En iPhone abre en Safari → Compartir → Añadir a pantalla de inicio. En Chrome/Edge usa el icono de instalar en la barra de direcciones.');
        }
      }
    }

    if (topInstallBtn) topInstallBtn.addEventListener('click', triggerInstallFlow);
    if (panelInstallBtn) panelInstallBtn.addEventListener('click', triggerInstallFlow);

    if (updateNowBtn) {
      updateNowBtn.addEventListener('click', function () {
        if (waitingServiceWorker) {
          waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        } else {
          window.location.reload();
        }
      });
    }
    if (updateLaterBtn && updateBanner) {
      updateLaterBtn.addEventListener('click', function () {
        updateBanner.style.display = 'none';
      });
    }
  }

  /* ========================================================================
     FASE 2 · SINCRONIZACIÓN OPCIONAL CON FIREBASE (SIN BUCLES NI PISAR AL GATO)
     ======================================================================== */
  let syncPrefs = {
    enabled: false,
    syncMood: false,
    firstMergeDone: false
  };

  let fbRuntime = {
    loaded: false,
    loading: false,
    app: null,
    auth: null,
    db: null,
    mods: null,
    user: null,
    syncing: false,
    applyingRemote: false,
    unsubscribeSnapshot: null,
    lastSyncedFingerprint: '',
    debounceTimer: null,
    statusDebounceTimer: null,
    lastVisualStatusSignature: '',
    greetedThisSession: false,
    needsReconnectGreeting: false
  };

  function getStoredCustomFirebaseConfig() {
    try {
      const raw = window.localStorage.getItem(CUSTOM_FB_CFG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.apiKey) return parsed;
      }
    } catch (e) {}
    return null;
  }

  function getActiveFirebaseConfig() {
    if (window.WILCON_FIREBASE_CONFIG && window.WILCON_FIREBASE_CONFIG.apiKey) {
      return window.WILCON_FIREBASE_CONFIG;
    }
    const stored = getStoredCustomFirebaseConfig();
    if (stored && stored.apiKey) {
      return stored;
    }
    return FIREBASE_CONFIG;
  }

  function hasFirebaseConfig() {
    const cfg = getActiveFirebaseConfig();
    return Boolean(cfg && typeof cfg.apiKey === 'string' && cfg.apiKey.trim().length > 0);
  }

  function loadSyncPrefs() {
    try {
      const raw = window.localStorage.getItem(SYNC_META_KEY);
      if (raw) {
        syncPrefs = Object.assign(syncPrefs, JSON.parse(raw));
      }
    } catch (e) {}
  }

  function saveSyncPrefs() {
    try {
      window.localStorage.setItem(SYNC_META_KEY, JSON.stringify(syncPrefs));
    } catch (e) {}
  }

  /**
   * Aviso ocasional para el gato: solo cuando termina de sincronizar por primera vez
   * en la sesión o tras reconectarse, dura máximo 2.5s (< 3s) y NUNCA reemplaza un
   * mensaje o gesto que el gato esté mostrando en ese momento (además restaura el texto previo).
   */
  function maybeShowOccasionalCatSyncGreeting() {
    if (!fbRuntime.greetedThisSession || fbRuntime.needsReconnectGreeting) {
      fbRuntime.greetedThisSession = true;
      fbRuntime.needsReconnectGreeting = false;

      if (!window.WilconApp || typeof window.WilconApp.isWilconBusy !== 'function') return;
      if (window.WilconApp.isWilconBusy()) return;

      const speechEl = document.getElementById('wilcon-speech');
      const cardEl = document.getElementById('mascot-card');
      if (!speechEl || !cardEl) return;
      if (cardEl.getAttribute('data-wilcon-state') !== 'awake') return;

      const previousText = speechEl.textContent;
      window.WilconApp.setWilconReaction('purring', '☁️🐾 ¡Listo! Tus apuntes están sincronizados.', 2500);
      setTimeout(function () {
        if (!window.WilconApp.isWilconBusy() && speechEl.textContent === '☁️🐾 ¡Listo! Tus apuntes están sincronizados.') {
          speechEl.textContent = previousText;
        }
      }, 2600);
    }
  }

  /**
   * Actualiza el estado visible SOLO en la insignia del encabezado (#net-status-pill)
   * y en la sección Respaldo (#sync-status-badge), nunca en la burbuja del gato.
   * No repite el mismo estado y aplica un debounce de 500 ms.
   */
  function applyVisualSyncStatusNow(statusKey, customDetail) {
    const isOnline = navigator.onLine !== false;
    const effectiveKey = !isOnline ? 'offline' : statusKey;
    const signature = effectiveKey + '|' + (customDetail || '') + '|' + Boolean(syncPrefs.enabled) + '|' + Boolean(fbRuntime.user);

    if (fbRuntime.lastVisualStatusSignature === signature) {
      return;
    }
    fbRuntime.lastVisualStatusSignature = signature;

    const netPill = document.getElementById('net-status-pill');
    const syncBadge = document.getElementById('sync-status-badge');

    if (effectiveKey === 'offline') {
      if (netPill) {
        netPill.textContent = '📴 Sin conexión';
        netPill.className = 'badge badge-warning';
      }
      if (syncBadge) {
        syncBadge.textContent = '📴 Sin conexión (guardando en dispositivo)';
        syncBadge.className = 'badge badge-warning';
      }
      return;
    }

    if (effectiveKey === 'syncing') {
      if (netPill) {
        netPill.textContent = '🔄 Sincronizando...';
        netPill.className = 'badge badge-blue';
      }
      if (syncBadge) {
        syncBadge.textContent = '🔄 Sincronizando...';
        syncBadge.className = 'badge badge-blue';
      }
      return;
    }

    if (effectiveKey === 'synced') {
      if (netPill) {
        netPill.textContent = '☁️ Al día';
        netPill.className = 'badge badge-success';
      }
      if (syncBadge) {
        syncBadge.textContent = customDetail || '☁️ Al día en tus dispositivos';
        syncBadge.className = 'badge badge-success';
      }
      return;
    }

    if (netPill) {
      netPill.textContent = '🟢 En línea';
      netPill.className = 'badge badge-purple';
    }
    if (syncBadge) {
      if (!syncPrefs.enabled) {
        syncBadge.textContent = '🔒 Solo en este dispositivo';
      } else if (!hasFirebaseConfig()) {
        syncBadge.textContent = '⚙️ Falta pegar firebaseConfig';
      } else {
        syncBadge.textContent = '🔑 Inicia sesión para sincronizar';
      }
      syncBadge.className = 'badge badge-blue';
    }
  }

  function setVisualSyncStatus(statusKey, customDetail, immediate) {
    if (fbRuntime.statusDebounceTimer) {
      clearTimeout(fbRuntime.statusDebounceTimer);
      fbRuntime.statusDebounceTimer = null;
    }
    if (immediate) {
      applyVisualSyncStatusNow(statusKey, customDetail);
      return;
    }
    fbRuntime.statusDebounceTimer = setTimeout(function () {
      applyVisualSyncStatusNow(statusKey, customDetail);
    }, 500);
  }

  function attachRealtimeSnapshotListener() {
    if (!fbRuntime.user || !fbRuntime.db || !fbRuntime.mods || typeof fbRuntime.mods.fsMod.onSnapshot !== 'function') {
      return;
    }
    if (fbRuntime.unsubscribeSnapshot) {
      fbRuntime.unsubscribeSnapshot();
      fbRuntime.unsubscribeSnapshot = null;
    }
    const uid = fbRuntime.user.uid;
    const fsMod = fbRuntime.mods.fsMod;
    const userDocRef = fsMod.doc(fbRuntime.db, 'users', uid, 'appdata', 'main');

    fbRuntime.unsubscribeSnapshot = fsMod.onSnapshot(
      userDocRef,
      { includeMetadataChanges: true },
      function (snap) {
        // Ignorar snapshots que reflejan escrituras locales pendientes o lecturas de caché local
        if (!snap || !snap.exists()) return;
        if (snap.metadata && (snap.metadata.hasPendingWrites || snap.metadata.fromCache)) {
          return;
        }
        if (fbRuntime.syncing || fbRuntime.applyingRemote) {
          return;
        }

        const remoteData = snap.data() || {};
        const remoteFp = computeSyncFingerprint(remoteData, syncPrefs.syncMood);
        const localState = window.WilconApp.getState();
        const localFp = computeSyncFingerprint(localState, syncPrefs.syncMood);

        // Si el contenido remoto ya es idéntico al local, no hacer nada (evita bucle)
        if (remoteFp === localFp) {
          fbRuntime.lastSyncedFingerprint = localFp;
          return;
        }

        fbRuntime.applyingRemote = true;
        try {
          const mergeResult = mergeAppState(localState, remoteData, syncPrefs.syncMood);
          const mergedFp = computeSyncFingerprint(mergeResult.mergedState, syncPrefs.syncMood);
          if (mergedFp !== localFp) {
            window.WilconApp.setStateFromSync(mergeResult.mergedState);
          }
          fbRuntime.lastSyncedFingerprint = mergedFp;
          const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
          setVisualSyncStatus('synced', '☁️ Al día (' + timeStr + ')');
        } finally {
          fbRuntime.applyingRemote = false;
        }
      },
      function () {
        // Silenciar errores de escucha desconectada
      }
    );
  }

  async function ensureFirebaseSdkLoaded() {
    if (fbRuntime.loaded && fbRuntime.mods) return true;
    if (!hasFirebaseConfig() || !syncPrefs.enabled || !navigator.onLine) return false;
    if (fbRuntime.loading) return false;

    fbRuntime.loading = true;
    try {
      const appMod = await import(FIREBASE_SDK_BASE + '/firebase-app.js');
      const authMod = await import(FIREBASE_SDK_BASE + '/firebase-auth.js');
      const fsMod = await import(FIREBASE_SDK_BASE + '/firebase-firestore.js');

      const cfg = getActiveFirebaseConfig();
      const existingApps = appMod.getApps();
      fbRuntime.app = existingApps.length > 0 ? appMod.getApp() : appMod.initializeApp(cfg);
      fbRuntime.auth = authMod.getAuth(fbRuntime.app);
      fbRuntime.db = fsMod.getFirestore(fbRuntime.app);
      fbRuntime.mods = { appMod: appMod, authMod: authMod, fsMod: fsMod };
      fbRuntime.loaded = true;

      authMod.onAuthStateChanged(fbRuntime.auth, function (user) {
        fbRuntime.user = user || null;
        renderSyncCardUI();
        if (user && syncPrefs.enabled && navigator.onLine) {
          attachRealtimeSnapshotListener();
          performCloudSync('auth-ready');
        } else if (!user && fbRuntime.unsubscribeSnapshot) {
          fbRuntime.unsubscribeSnapshot();
          fbRuntime.unsubscribeSnapshot = null;
        }
      });

      fbRuntime.loading = false;
      return true;
    } catch (err) {
      fbRuntime.loading = false;
      setVisualSyncStatus('offline');
      return false;
    }
  }

  function runLocalMergeCheckAndReport(reason) {
    if (!window.WilconApp || fbRuntime.applyingRemote) return;
    const localState = window.WilconApp.getState();
    const localFp = computeSyncFingerprint(localState, syncPrefs.syncMood);

    // Si es un cambio automático y el contenido ya fue procesado sin cambios reales, no repetir
    if (reason === 'local-change' && fbRuntime.lastSyncedFingerprint === localFp) {
      return;
    }

    setVisualSyncStatus('syncing', '', true);
    fbRuntime.applyingRemote = true;
    let mergeResult;
    try {
      mergeResult = mergeAppState(localState, {}, syncPrefs.syncMood);
      const mergedFp = computeSyncFingerprint(mergeResult.mergedState, syncPrefs.syncMood);
      if (mergedFp !== localFp) {
        window.WilconApp.setStateFromSync(mergeResult.mergedState);
      }
      fbRuntime.lastSyncedFingerprint = mergedFp;
    } finally {
      fbRuntime.applyingRemote = false;
    }

    const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const summaryEl = document.getElementById('sync-merge-summary');
    if (summaryEl) {
      summaryEl.style.display = 'block';
      summaryEl.innerHTML =
        '<strong>✨ Sincronización local verificada (' + timeStr + ')</strong><br>' +
        '<span>Registros al día (<code>id</code>, <code>updatedAt</code>, <code>deleted</code>): ' +
        '<strong>' + mergeResult.stats.activeSchedule + '</strong> clases, ' +
        '<strong>' + mergeResult.stats.activeTasks + '</strong> entregas activas y ' +
        '<strong>' + mergeResult.stats.activeCourses + '</strong> materias (' +
        mergeResult.stats.tombstones + ' borrados lógicos registrados).</span>';
    }
    setVisualSyncStatus('synced', '☁️ Al día (' + timeStr + ')');
    maybeShowOccasionalCatSyncGreeting();
  }

  async function performCloudSync(reason) {
    if (fbRuntime.applyingRemote || fbRuntime.syncing) return;

    const summaryEl = document.getElementById('sync-merge-summary');
    if (!navigator.onLine) {
      setVisualSyncStatus('offline');
      if (summaryEl) {
        summaryEl.textContent = '📴 Sin conexión a internet: tus cambios están guardados en este dispositivo y se sincronizarán al reconectar.';
      }
      return;
    }

    if (!hasFirebaseConfig()) {
      runLocalMergeCheckAndReport(reason);
      const detailsEl = document.getElementById('sync-firebase-config-details');
      if (detailsEl && reason === 'manual') {
        detailsEl.open = true;
      }
      return;
    }

    if (!syncPrefs.enabled && reason === 'manual') {
      syncPrefs.enabled = true;
      saveSyncPrefs();
      renderSyncCardUI();
    }
    if (!syncPrefs.enabled) return;

    const ok = await ensureFirebaseSdkLoaded();
    if (!ok || !fbRuntime.user || !fbRuntime.db) {
      if (summaryEl && reason === 'manual') {
        summaryEl.textContent = '🔑 Inicia sesión o crea tu cuenta con correo y contraseña abajo para sincronizar con la nube de Firebase.';
      }
      return;
    }

    const localStateBefore = window.WilconApp.getState();
    const localFpBefore = computeSyncFingerprint(localStateBefore, syncPrefs.syncMood);
    if (reason === 'local-change' && fbRuntime.lastSyncedFingerprint === localFpBefore) {
      return;
    }

    fbRuntime.syncing = true;
    setVisualSyncStatus('syncing', '', true);

    try {
      const uid = fbRuntime.user.uid;
      const fsMod = fbRuntime.mods.fsMod;
      const userDocRef = fsMod.doc(fbRuntime.db, 'users', uid, 'appdata', 'main');
      const snap = await fsMod.getDoc(userDocRef);
      const remoteData = snap.exists() ? snap.data() : {};
      const remoteFp = computeSyncFingerprint(remoteData, syncPrefs.syncMood);

      const localState = window.WilconApp.getState();
      const localFp = computeSyncFingerprint(localState, syncPrefs.syncMood);
      const mergeResult = mergeAppState(localState, remoteData, syncPrefs.syncMood);
      const mergedFp = computeSyncFingerprint(mergeResult.mergedState, syncPrefs.syncMood);

      // Aplicar en local solo si el resultado fusionado difiere del local actual
      if (mergedFp !== localFp) {
        fbRuntime.applyingRemote = true;
        try {
          window.WilconApp.setStateFromSync(mergeResult.mergedState);
        } finally {
          fbRuntime.applyingRemote = false;
        }
      }

      // Escribir en Firestore solo si el resultado fusionado difiere de lo que ya está en Firestore
      if (!snap.exists() || mergedFp !== remoteFp) {
        const payload = buildCloudPayload(mergeResult.mergedState, syncPrefs.syncMood);
        await fsMod.setDoc(userDocRef, payload, { merge: true });
      }

      fbRuntime.lastSyncedFingerprint = mergedFp;

      const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      if (summaryEl) {
        summaryEl.style.display = 'block';
        summaryEl.innerHTML =
          '<strong>☁️ Sincronización en la nube al día (' + timeStr + ')</strong><br>' +
          '<span>Fusión sin pérdida completada: <strong>' + mergeResult.stats.activeSchedule + '</strong> clases, ' +
          '<strong>' + mergeResult.stats.activeTasks + '</strong> entregas activas y ' +
          '<strong>' + mergeResult.stats.activeCourses + '</strong> materias sincronizadas.</span>';
      }

      syncPrefs.firstMergeDone = true;
      saveSyncPrefs();
      setVisualSyncStatus('synced', '☁️ Al día (' + timeStr + ')');
      maybeShowOccasionalCatSyncGreeting();
    } catch (err) {
      if (summaryEl) {
        summaryEl.style.display = 'block';
        summaryEl.textContent = '⚠️ No se pudo conectar con Firestore en este momento. Tus datos siguen seguros en este dispositivo.';
      }
      setVisualSyncStatus(navigator.onLine ? 'local' : 'offline');
    } finally {
      fbRuntime.syncing = false;
    }
  }

  function scheduleDebouncedSync() {
    if (fbRuntime.applyingRemote || fbRuntime.syncing) return;
    if (!syncPrefs.enabled || !navigator.onLine) return;

    const currentState = window.WilconApp ? window.WilconApp.getState() : null;
    const currentFp = computeSyncFingerprint(currentState, syncPrefs.syncMood);
    if (currentFp && currentFp === fbRuntime.lastSyncedFingerprint) {
      return;
    }

    if (fbRuntime.debounceTimer) clearTimeout(fbRuntime.debounceTimer);
    fbRuntime.debounceTimer = setTimeout(function () {
      performCloudSync('local-change');
    }, 500);
  }

  function renderSyncCardUI() {
    const enableToggle = document.getElementById('sync-enable-toggle');
    const moodToggle = document.getElementById('sync-mood-toggle');
    const authBox = document.getElementById('sync-auth-box');
    const sessionBox = document.getElementById('sync-session-box');
    const emailLabel = document.getElementById('sync-user-email');
    const jsonInput = document.getElementById('sync-firebase-json-input');

    if (enableToggle) enableToggle.checked = Boolean(syncPrefs.enabled);
    if (moodToggle) moodToggle.checked = Boolean(syncPrefs.syncMood);

    const customCfg = getStoredCustomFirebaseConfig();
    if (jsonInput && customCfg && document.activeElement !== jsonInput) {
      jsonInput.value = JSON.stringify(customCfg, null, 2);
    }

    if (fbRuntime.user) {
      if (authBox) authBox.style.display = 'none';
      if (sessionBox) sessionBox.style.display = 'block';
      if (emailLabel) emailLabel.textContent = fbRuntime.user.email || 'Cuenta activa';
    } else {
      if (authBox) authBox.style.display = 'block';
      if (sessionBox) sessionBox.style.display = 'none';
    }

    setVisualSyncStatus(
      navigator.onLine ? (syncPrefs.enabled && (fbRuntime.user || !hasFirebaseConfig()) ? 'synced' : 'local') : 'offline',
      '',
      true
    );
  }

  function parseFlexibleFirebaseConfig(rawText) {
    const trimmed = String(rawText || '').trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      const keys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
      const out = {};
      keys.forEach(function (k) {
        const m = trimmed.match(new RegExp(k + '\\s*:\\s*["\']([^"\']+)["\']'));
        if (m && m[1]) out[k] = m[1];
      });
      return out.apiKey ? out : null;
    }
  }

  function setupSyncEvents() {
    const enableToggle = document.getElementById('sync-enable-toggle');
    const moodToggle = document.getElementById('sync-mood-toggle');
    const preBackupBtn = document.getElementById('btn-sync-prebackup');
    const localMergeBtn = document.getElementById('btn-sync-local-merge-test');
    const saveCfgBtn = document.getElementById('btn-save-firebase-config');
    const clearCfgBtn = document.getElementById('btn-clear-firebase-config');
    const loginBtn = document.getElementById('btn-sync-login');
    const regBtn = document.getElementById('btn-sync-register');
    const syncNowBtn = document.getElementById('btn-sync-now');
    const logoutBtn = document.getElementById('btn-sync-logout');

    if (enableToggle) {
      enableToggle.addEventListener('change', function () {
        syncPrefs.enabled = enableToggle.checked;
        saveSyncPrefs();
        renderSyncCardUI();
        if (syncPrefs.enabled) {
          if (hasFirebaseConfig()) {
            ensureFirebaseSdkLoaded().then(function () {
              if (fbRuntime.user) performCloudSync('toggle-on');
            });
          } else {
            runLocalMergeCheckAndReport('toggle-on');
          }
        }
      });
    }

    if (moodToggle) {
      moodToggle.addEventListener('change', function () {
        syncPrefs.syncMood = moodToggle.checked;
        saveSyncPrefs();
        if (syncPrefs.enabled) {
          performCloudSync('mood-toggle');
        }
      });
    }

    if (preBackupBtn) {
      preBackupBtn.addEventListener('click', function () {
        if (window.WilconApp && window.WilconApp.exportBackup) {
          window.WilconApp.exportBackup();
        }
      });
    }

    if (localMergeBtn) {
      localMergeBtn.addEventListener('click', function () {
        runLocalMergeCheckAndReport('manual-test');
      });
    }

    if (saveCfgBtn) {
      saveCfgBtn.addEventListener('click', function () {
        const jsonInput = document.getElementById('sync-firebase-json-input');
        const parsed = parseFlexibleFirebaseConfig(jsonInput ? jsonInput.value : '');
        if (!parsed || !parsed.apiKey || !parsed.projectId) {
          if (window.WilconApp && window.WilconApp.showToast) {
            window.WilconApp.showToast('⚠️ Pega el objeto firebaseConfig con al menos apiKey y projectId.');
          }
          return;
        }
        try {
          window.localStorage.setItem(CUSTOM_FB_CFG_KEY, JSON.stringify(parsed));
        } catch (e) {}
        fbRuntime.loaded = false;
        syncPrefs.enabled = true;
        saveSyncPrefs();
        renderSyncCardUI();
        if (window.WilconApp && window.WilconApp.showToast) {
          window.WilconApp.showToast('✅ Credenciales de Firebase guardadas.');
        }
        ensureFirebaseSdkLoaded();
      });
    }

    if (clearCfgBtn) {
      clearCfgBtn.addEventListener('click', function () {
        try {
          window.localStorage.removeItem(CUSTOM_FB_CFG_KEY);
        } catch (e) {}
        const jsonInput = document.getElementById('sync-firebase-json-input');
        if (jsonInput) jsonInput.value = '';
        renderSyncCardUI();
        if (window.WilconApp && window.WilconApp.showToast) {
          window.WilconApp.showToast('Credenciales personalizadas eliminadas.');
        }
      });
    }

    async function handleAuthSubmit(mode) {
      const emailIn = document.getElementById('sync-email');
      const passIn = document.getElementById('sync-password');
      const summaryEl = document.getElementById('sync-merge-summary');
      const email = emailIn ? emailIn.value.trim() : '';
      const pass = passIn ? passIn.value : '';

      if (!hasFirebaseConfig()) {
        const detailsEl = document.getElementById('sync-firebase-config-details');
        if (detailsEl) detailsEl.open = true;
        if (window.WilconApp && window.WilconApp.showToast) {
          window.WilconApp.showToast('⚙️ Primero pega tus credenciales firebaseConfig en la sección desplegable de arriba.');
        }
        return;
      }

      if (!email || pass.length < 6) {
        if (window.WilconApp && window.WilconApp.showToast) {
          window.WilconApp.showToast('⚠️ Ingresa un correo válido y una contraseña de al menos 6 caracteres.');
        }
        return;
      }

      syncPrefs.enabled = true;
      saveSyncPrefs();
      const ready = await ensureFirebaseSdkLoaded();
      if (!ready || !fbRuntime.auth) {
        if (window.WilconApp && window.WilconApp.showToast) {
          window.WilconApp.showToast('⚠️ Verifica tu conexión a internet y tus credenciales de Firebase.');
        }
        return;
      }

      try {
        setVisualSyncStatus('syncing', '', true);
        if (mode === 'register') {
          await fbRuntime.mods.authMod.createUserWithEmailAndPassword(fbRuntime.auth, email, pass);
        } else {
          await fbRuntime.mods.authMod.signInWithEmailAndPassword(fbRuntime.auth, email, pass);
        }
        if (passIn) passIn.value = '';
        await performCloudSync('first-login');
      } catch (err) {
        if (summaryEl) {
          summaryEl.style.display = 'block';
          summaryEl.textContent = '⚠️ Error de autenticación: verifica tu correo, contraseña y que Email/Password esté activo en Firebase.';
        }
        setVisualSyncStatus(navigator.onLine ? 'local' : 'offline', '', true);
      }
    }

    if (loginBtn) {
      loginBtn.addEventListener('click', function () { handleAuthSubmit('login'); });
    }
    if (regBtn) {
      regBtn.addEventListener('click', function () { handleAuthSubmit('register'); });
    }
    if (syncNowBtn) {
      syncNowBtn.addEventListener('click', function () { performCloudSync('manual'); });
    }
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function () {
        if (fbRuntime.unsubscribeSnapshot) {
          fbRuntime.unsubscribeSnapshot();
          fbRuntime.unsubscribeSnapshot = null;
        }
        if (fbRuntime.auth && fbRuntime.mods) {
          try {
            await fbRuntime.mods.authMod.signOut(fbRuntime.auth);
          } catch (e) {}
        }
        fbRuntime.user = null;
        renderSyncCardUI();
      });
    }

    window.addEventListener('online', function () {
      fbRuntime.needsReconnectGreeting = true;
      renderSyncCardUI();
      if (syncPrefs.enabled) {
        performCloudSync('online');
      }
    });

    window.addEventListener('offline', function () {
      setVisualSyncStatus('offline', '', true);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && syncPrefs.enabled && navigator.onLine) {
        performCloudSync('visibilitychange');
      }
    });

    window.addEventListener('wilcon:local-change', function () {
      scheduleDebouncedSync();
    });
  }

  function initPwaAndSync() {
    loadSyncPrefs();
    if (window.WilconApp && typeof window.WilconApp.getState === 'function') {
      fbRuntime.lastSyncedFingerprint = computeSyncFingerprint(window.WilconApp.getState(), syncPrefs.syncMood);
    }
    requestPersistentStorage();
    registerRelativeServiceWorker();
    setupPwaInstallUI();
    setupSyncEvents();
    renderSyncCardUI();

    if (syncPrefs.enabled && hasFirebaseConfig() && navigator.onLine) {
      ensureFirebaseSdkLoaded();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPwaAndSync);
  } else {
    initPwaAndSync();
  }
})();
