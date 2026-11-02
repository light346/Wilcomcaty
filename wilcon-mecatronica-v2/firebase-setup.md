# ☁️ Configuración de Sincronización Opcional con Firebase (`firebase-setup.md`)

Por defecto, **El Rincón Mecatrónico de Wilcon (v2)** funciona **100 % sin internet y sin servidores**, guardando todo en el navegador (`localStorage`). Si `FIREBASE_CONFIG` está vacío en `js/pwa-sync.js`, la tarjeta de sincronización en la nube permanece oculta y la app funciona de manera completamente local.

Si deseas habilitar la opción para que ella pueda sincronizar su horario, entregas y promedios (y opcionalmente su ánimo) entre su celular y su laptop, sigue estos pasos gratuitos en la consola de Firebase (toma ~5 minutos):

## 1. Crear el proyecto en Firebase Console
1. Entra a [console.firebase.google.com](https://console.firebase.google.com/) con tu cuenta de Google.
2. Haz clic en **Crear un proyecto** (o *Add project*) y ponle un nombre como `wilcon-mecatronica`.
3. Puedes desactivar Google Analytics (no es necesario y mantiene la app libre de rastreo) y hacer clic en **Crear proyecto**.

## 2. Activar Firebase Authentication (Correo y Contraseña)
1. En el menú lateral izquierdo, abre **Compilación → Authentication** y haz clic en **Comenzar**.
2. En la pestaña **Sign-in method** (Método de acceso), selecciona **Correo electrónico/contraseña** (*Email/Password*).
3. Activa el primer interruptor (**Correo electrónico/contraseña**), deja desactivado el enlace sin contraseña y haz clic en **Guardar**.
   > *Nota:* Usamos autenticación directa por correo y contraseña sin redirecciones (`signInWithEmailAndPassword` / `createUserWithEmailAndPassword`) para evitar los bloqueos de redirección en apps PWA instaladas en iOS y Android.

## 3. Crear la base de datos Cloud Firestore y aplicar `firestore.rules`
1. En el menú lateral izquierdo, ve a **Compilación → Firestore Database** y haz clic en **Crear base de datos**.
2. Elige la ubicación más cercana (por ejemplo `nam5 (us-central)`) y selecciona **Comenzar en modo de producción**.
3. Una vez creada, entra a la pestaña **Reglas** (*Rules*), borra el contenido y pega exactamente el contenido del archivo **`firestore.rules`** incluido en este paquete:
   ```text
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         match /{document=**} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
       match /{allOtherPaths=**} {
         allow read, write: if false;
       }
     }
   }
   ```
4. Haz clic en **Publicar** (*Publish*). Con esto, cada cuenta solo puede leer y escribir su propia ruta `users/{uid}/...`.

## 4. Copiar las credenciales Web a `js/pwa-sync.js`
1. En la página principal de tu proyecto de Firebase, haz clic en el ícono de engrane ⚙️ (**Configuración del proyecto**) y baja hasta la sección **Tus apps**.
2. Haz clic en el ícono Web **`</>`**, ponle el apodo `Wilcon PWA` (no hace falta activar Firebase Hosting) y pulsa **Registrar app**.
3. Copia los valores del objeto `firebaseConfig` que te muestra Firebase y pégalos al inicio del archivo **`js/pwa-sync.js`**:
   ```javascript
   const FIREBASE_CONFIG = {
     apiKey: "TU_API_KEY",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef123456"
   };
   ```
4. Si publicas la web en GitHub Pages o Netlify (por ejemplo `tu-usuario.github.io`), verifica en **Authentication → Settings → Dominios autorizados** que ese dominio esté agregado a la lista.

## 5. Cómo funciona cuando ella lo activa
- Al detectar que `FIREBASE_CONFIG.apiKey` tiene valor, aparece la tarjeta **«☁️ Sincronización Opcional entre Dispositivos»** dentro de la pestaña **Respaldo**.
- Antes de iniciar sesión o crear su cuenta por primera vez, la app le explica en lenguaje sencillo que sus datos se guardarán en servidores de Google y le ofrece un botón para **descargar un respaldo `.json`**.
- Al conectarse por primera vez en un dispositivo, la app **fusiona automáticamente** los registros locales con los de la nube usando `id`, `updatedAt` y borrado lógico (`deleted: true`), ganando siempre el último cambio por registro sin perder nada.
