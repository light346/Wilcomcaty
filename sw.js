/* ==========================================================================
   Service Worker · El Rincón Mecatrónico de Wilcon (PWA v3)
   Caché versionada con soporte de subcarpeta (./) y actualización con aviso
   ========================================================================== */

const CACHE_VERSION = 'wilcon-pwa-cache-v3.0.0';
const FIREBASE_SDK_CACHE = 'wilcon-firebase-sdk-v10.14.1';

const APP_SHELL_FILES = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/pwa-sync.js',
  './manifest.webmanifest',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/icon-maskable.svg'
];

// Instalación: precachea todos los archivos base del sitio con rutas relativas a la subcarpeta
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(APP_SHELL_FILES);
    })
  );
  // No llamamos a self.skipWaiting() automáticamente aquí para que la app
  // muestre el aviso amable de Wilcon («¡Hay una versión nueva!» con botón Actualizar).
});

// Activación: limpia cachés de versiones anteriores y reclama control de los clientes
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_VERSION && key !== FIREBASE_SDK_CACHE) {
            return caches.delete(key);
          }
          return null;
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Escucha el mensaje del botón «Actualizar» del aviso de Wilcon
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Estrategia de intercepción:
// 1. Archivos estáticos locales: Cache-First con fallback a index.html en navegación offline.
// 2. SDK modular de Firebase (gstatic.com/firebasejs/10.14.1/): Cache-First al usarse.
// 3. Endpoints de API de Firebase Auth/Firestore: pasan directo a la red sin cachear.
self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com')
  ) {
    return;
  }

  // Guardar en caché el SDK modular de Firebase al cargarlo
  if (url.hostname === 'www.gstatic.com' && url.pathname.includes('/firebasejs/')) {
    event.respondWith(
      caches.open(FIREBASE_SDK_CACHE).then(function (cache) {
        return cache.match(req).then(function (cached) {
          if (cached) return cached;
          return fetch(req).then(function (networkRes) {
            if (networkRes && networkRes.status === 200) {
              cache.put(req, networkRes.clone());
            }
            return networkRes;
          });
        });
      })
    );
    return;
  }

  // Archivos del propio sitio (soporta subcarpeta ./ y modo avión completo)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then(function (cached) {
        if (cached) {
          return cached;
        }
        return fetch(req)
          .then(function (networkRes) {
            if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
              const copy = networkRes.clone();
              caches.open(CACHE_VERSION).then(function (cache) {
                cache.put(req, copy);
              });
            }
            return networkRes;
          })
          .catch(function () {
            if (req.mode === 'navigate') {
              return caches.match('./index.html');
            }
            return new Response('', { status: 503, statusText: 'Offline' });
          });
      })
    );
  }
});
