/* ==========================================================================
   Módulo PWA + Sincronización Opcional en la Nube (Firebase Modular v10.14.1)
   - Registra el Service Worker (./sw.js) y gestiona el aviso de actualización
   - Solicita almacenamiento persistente (navigator.storage.persist)
   - Muestra estado de red («En línea» / «Sin conexión» / «Sincronizando» / «Al día»)
   - Sincronización Opt-in con resolución Last-Write-Wins (id, updatedAt, deleted)
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     CONFIGURACIÓN OPCIONAL DE FIREBASE
     Por defecto está vacía: la opción de sincronizar no aparece y todo funciona
     100 % local. Para activarla, sigue los pasos de firebase-setup.md y pega
     aquí las credenciales de tu proyecto web de Firebase.
     ------------------------------------------------------------------------ */
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
  apiKey: "AIzaSyA3gIh3hCASd9RV3nRccycNBplI5QYIZmE",
  authDomain: "wilcomcat.firebaseapp.com",
  projectId: "wilcomcat",
  storageBucket: "wilcomcat.firebasestorage.app",
  messagingSenderId: "434548407283",
  appId: "1:434548407283:web:22f4a9f8d05091f59df086",
  measurementId: "G-1H37RY8S0X"
};

  // Versión fija del SDK modular oficial de Firebase (se carga solo bajo demanda)
  const FIREBASE_SDK_BASE = 'https://www.gstatic.com/firebasejs/10.14.1';
  const SYNC_META_KEY = 'wilcon_pwa_sync_prefs_v2';

  /* ========================================================================
     MOTOR DE FUSIÓN POR REGISTRO (Last-Write-Wins + Tombstones deleted:true)
     Exportable en Node.js y navegador para pruebas automatizadas
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

  /**
   * Fusiona dos arreglos de registros (local y remoto) por `id`.
   * Gana siempre el registro con mayor `updatedAt` (Last-Write-Wins),
   * incluyendo borrados lógicos (`deleted: true`).
   */
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

  /**
   * Fusiona el estado local con el documento remoto de Firestore sin perder datos.
   * Sincroniza siempre: horario (schedule), tareas (tasks) y promedios (grades.courses).
   * Sincroniza ánimo (mood) únicamente si `includeMood === true`.
   */
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

  /**
   * Construye el payload que se sube a `users/{uid}/appdata/main`
   */
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

  // Exportar utilidades de sincronización para pruebas en Node.js
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      mergeRecordsById: mergeRecordsById,
      mergeAppState: mergeAppState,
      buildCloudPayload: buildCloudPayload
    };
  }
  if (typeof window !== 'undefined') {
    window.WilconSyncEngine = {
      mergeRecordsById: mergeRecordsById,
      mergeAppState: mergeAppState,
      buildCloudPayload: buildCloudPayload
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
            : '💾 Almacenamiento local estándar activo (recuerda descargar respaldos JSON periódicos).';
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
    if (window.WilconApp && window.WilconApp.setWilconReaction) {
      window.WilconApp.setWilconReaction(
        'starry',
        '✨ ¡Miau! Hay una versión nueva lista. Toca «Actualizar» arriba cuando gustes.',
        3600
      );
    }
  }

  function registerRelativeServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    // Solo registrar en contextos soportados (http:, https:)
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
        .catch(function () {
          // En entornos de previsualización aislados sin soporte SW, continúa sin error
        });

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
          window.WilconApp.showToast('📱 En iPhone/Safari: toca Compartir → Añadir a pantalla de inicio.');
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
     FASE 2 · SINCRONIZACIÓN OPCIONAL CON FIREBASE (OPT-IN)
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
    debounceTimer: null
  };

  function getActiveFirebaseConfig() {
    if (window.WILCON_FIREBASE_CONFIG && window.WILCON_FIREBASE_CONFIG.apiKey) {
      return window.WILCON_FIREBASE_CONFIG;
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

  function setVisualSyncStatus(statusKey, customDetail) {
    const netPill = document.getElementById('net-status-pill');
    const syncBadge = document.getElementById('sync-status-badge');
    const isOnline = navigator.onLine !== false;

    if (!isOnline || statusKey === 'offline') {
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

    if (statusKey === 'syncing') {
      if (netPill) {
        netPill.textContent = '🔄 Sincronizando...';
        netPill.className = 'badge badge-blue';
      }
      if (syncBadge) {
        syncBadge.textContent = '🔄 Sincronizando...';
        syncBadge.className = 'badge badge-blue';
      }
      if (window.WilconApp && window.WilconApp.setWilconReaction) {
        window.WilconApp.setWilconReaction('purring', '☁️🐾 Sincronizando tus apuntes con la nube...', 2000);
      }
      return;
    }

    if (statusKey === 'synced') {
      if (netPill) {
        netPill.textContent = '☁️ Al día';
        netPill.className = 'badge badge-success';
      }
      if (syncBadge) {
        syncBadge.textContent = customDetail || '☁️ Al día en tus dispositivos';
        syncBadge.className = 'badge badge-success';
      }
      if (window.WilconApp && window.WilconApp.setWilconReaction) {
        window.WilconApp.setWilconReaction('starry', '☁️💙 ¡Tus datos están al día entre tus dispositivos!', 2400);
      }
      return;
    }

    // Modo por defecto: en línea pero solo local
    if (netPill) {
      netPill.textContent = '🟢 En línea';
      netPill.className = 'badge badge-purple';
    }
    if (syncBadge) {
      syncBadge.textContent = syncPrefs.enabled ? '🔑 Inicia sesión para sincronizar' : '🔒 Solo en este dispositivo';
      syncBadge.className = 'badge badge-purple';
    }
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
          performCloudSync('auth-ready');
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

  async function performCloudSync(reason) {
    if (!syncPrefs.enabled || !hasFirebaseConfig()) return;
    if (!navigator.onLine) {
      setVisualSyncStatus('offline');
      return;
    }
    const ok = await ensureFirebaseSdkLoaded();
    if (!ok || !fbRuntime.user || !fbRuntime.db || fbRuntime.syncing) return;

    fbRuntime.syncing = true;
    setVisualSyncStatus('syncing');

    try {
      const uid = fbRuntime.user.uid;
      const fsMod = fbRuntime.mods.fsMod;
      const userDocRef = fsMod.doc(fbRuntime.db, 'users', uid, 'appdata', 'main');
      const snap = await fsMod.getDoc(userDocRef);
      const remoteData = snap.exists() ? snap.data() : {};

      const localState = window.WilconApp.getState();
      const mergeResult = mergeAppState(localState, remoteData, syncPrefs.syncMood);

      // Actualizar localStorage y la UI sin disparar bucle infinito
      window.WilconApp.setStateFromSync(mergeResult.mergedState);

      // Subir estado fusionado a Firestore bajo users/{uid}/appdata/main
      const payload = buildCloudPayload(mergeResult.mergedState, syncPrefs.syncMood);
      await fsMod.setDoc(userDocRef, payload, { merge: true });

      const summaryEl = document.getElementById('sync-merge-summary');
      const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      if (summaryEl) {
        summaryEl.style.display = 'block';
        summaryEl.innerHTML =
          '<strong>☁️ Sincronización al día (' + timeStr + ')</strong><br>' +
          '<span>Fusión sin pérdida completada: <strong>' + mergeResult.stats.activeSchedule + '</strong> clases, ' +
          '<strong>' + mergeResult.stats.activeTasks + '</strong> entregas activas y ' +
          '<strong>' + mergeResult.stats.activeCourses + '</strong> materias sincronizadas.</span>';
      }

      syncPrefs.firstMergeDone = true;
      saveSyncPrefs();
      setVisualSyncStatus('synced', '☁️ Al día (' + timeStr + ')');
    } catch (err) {
      const summaryEl = document.getElementById('sync-merge-summary');
      if (summaryEl) {
        summaryEl.style.display = 'block';
        summaryEl.textContent = '⚠️ No se pudo completar la sincronización en este momento. Tus datos siguen seguros en este dispositivo.';
      }
      setVisualSyncStatus(navigator.onLine ? 'local' : 'offline');
    } finally {
      fbRuntime.syncing = false;
    }
  }

  function scheduleDebouncedSync() {
    if (!syncPrefs.enabled || !fbRuntime.user || !navigator.onLine) return;
    if (fbRuntime.debounceTimer) clearTimeout(fbRuntime.debounceTimer);
    fbRuntime.debounceTimer = setTimeout(function () {
      performCloudSync('local-change');
    }, 1200);
  }

  function renderSyncCardUI() {
    const syncSection = document.getElementById('sync-card-section');
    const enableToggle = document.getElementById('sync-enable-toggle');
    const moodToggle = document.getElementById('sync-mood-toggle');
    const controlsWrap = document.getElementById('sync-controls-body');
    const authBox = document.getElementById('sync-auth-box');
    const sessionBox = document.getElementById('sync-session-box');
    const emailLabel = document.getElementById('sync-user-email');

    // Si no hay configuración de Firebase en el código, la opción de sincronizar no aparece
    if (!hasFirebaseConfig()) {
      if (syncSection) syncSection.style.display = 'none';
      setVisualSyncStatus(navigator.onLine ? 'local' : 'offline');
      return;
    }

    if (syncSection) syncSection.style.display = 'block';
    if (enableToggle) enableToggle.checked = Boolean(syncPrefs.enabled);
    if (moodToggle) moodToggle.checked = Boolean(syncPrefs.syncMood);
    if (controlsWrap) {
      controlsWrap.style.display = syncPrefs.enabled ? 'block' : 'none';
    }

    if (fbRuntime.user) {
      if (authBox) authBox.style.display = 'none';
      if (sessionBox) sessionBox.style.display = 'block';
      if (emailLabel) emailLabel.textContent = fbRuntime.user.email || 'Cuenta activa';
    } else {
      if (authBox) authBox.style.display = 'block';
      if (sessionBox) sessionBox.style.display = 'none';
    }

    setVisualSyncStatus(navigator.onLine ? (fbRuntime.user && syncPrefs.enabled ? 'synced' : 'local') : 'offline');
  }

  function setupSyncEvents() {
    const enableToggle = document.getElementById('sync-enable-toggle');
    const moodToggle = document.getElementById('sync-mood-toggle');
    const preBackupBtn = document.getElementById('btn-sync-prebackup');
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
          ensureFirebaseSdkLoaded().then(function () {
            if (fbRuntime.user) performCloudSync('toggle-on');
          });
        }
      });
    }

    if (moodToggle) {
      moodToggle.addEventListener('change', function () {
        syncPrefs.syncMood = moodToggle.checked;
        saveSyncPrefs();
        if (syncPrefs.enabled && fbRuntime.user) {
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

    async function handleAuthSubmit(mode) {
      const emailIn = document.getElementById('sync-email');
      const passIn = document.getElementById('sync-password');
      const summaryEl = document.getElementById('sync-merge-summary');
      const email = emailIn ? emailIn.value.trim() : '';
      const pass = passIn ? passIn.value : '';

      if (!email || pass.length < 6) {
        if (window.WilconApp && window.WilconApp.showToast) {
          window.WilconApp.showToast('⚠️ Ingresa un correo válido y una contraseña de al menos 6 caracteres.');
        }
        return;
      }

      const ready = await ensureFirebaseSdkLoaded();
      if (!ready || !fbRuntime.auth) {
        if (window.WilconApp && window.WilconApp.showToast) {
          window.WilconApp.showToast('⚠️ Verifica tu conexión a internet para iniciar sesión.');
        }
        return;
      }

      try {
        setVisualSyncStatus('syncing');
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
          summaryEl.textContent = '⚠️ Error de autenticación: verifica tu correo y contraseña.';
        }
        setVisualSyncStatus(navigator.onLine ? 'local' : 'offline');
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
        if (fbRuntime.auth && fbRuntime.mods) {
          try {
            await fbRuntime.mods.authMod.signOut(fbRuntime.auth);
          } catch (e) {}
        }
        fbRuntime.user = null;
        renderSyncCardUI();
      });
    }

    // Disparadores automáticos requeridos:
    // 1. Al volver la conexión (evento online / offline)
    window.addEventListener('online', function () {
      if (window.WilconApp && window.WilconApp.setWilconReaction) {
        window.WilconApp.setWilconReaction('purring', '🟢 ¡Volvió la conexión a internet!', 2200);
      }
      renderSyncCardUI();
      if (syncPrefs.enabled) {
        performCloudSync('online');
      }
    });

    window.addEventListener('offline', function () {
      setVisualSyncStatus('offline');
      if (window.WilconApp && window.WilconApp.setWilconReaction) {
        window.WilconApp.setWilconReaction(
          'awake',
          '📴 Sin conexión: no te preocupes, todo se sigue guardando en tu dispositivo.',
          3000
        );
      }
    });

    // 2. Al volver a primer plano (visibilitychange)
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && syncPrefs.enabled && navigator.onLine) {
        performCloudSync('visibilitychange');
      }
    });

    // 3. Al guardar cambios locales
    window.addEventListener('wilcon:local-change', function () {
      scheduleDebouncedSync();
    });
  }

  function initPwaAndSync() {
    loadSyncPrefs();
    requestPersistentStorage();
    registerRelativeServiceWorker();
    setupPwaInstallUI();
    setupSyncEvents();
    renderSyncCardUI();

    // Si la sincronización ya estaba activa al abrir la app y hay red, sincronizar
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
