# 💜💙 El Rincón Mecatrónico de Wilcon · Versión 2 (PWA Instalable + Sincronización Opcional)

Aplicación web progresiva (**PWA**) interactiva, moderna y 100 % funcional sin conexión a internet en celular y laptop, diseñada para acompañar el día a día de una estudiante de ingeniería mecatrónica junto a su gatita **Wilcon** y la **Rosa Azul de Faris**.

Por defecto, **todo se guarda únicamente en su dispositivo (`localStorage`)** sin cuentas ni rastreo. Opcionalmente, si se configuran las credenciales de Firebase (ver `firebase-setup.md`), ella puede activar la sincronización entre dispositivos para su horario, entregas y promedios (y opcionalmente su ánimo del día).

## 📁 Estructura del proyecto (Versión 2)

```text
wilcon-mecatronica-v2/
├── index.html             # App principal con soporte PWA y panel de sincronización opt-in
├── manifest.webmanifest   # Manifiesto PWA con rutas relativas (./) y modo standalone
├── sw.js                  # Service Worker con caché versionada y aviso de actualización
├── css/
│   └── styles.css         # Paleta morado cálido + tonos café + azul zafiro y animaciones
├── js/
│   ├── app.js             # Módulos, 8 calculadoras de mecatrónica, 94 frases y borrado lógico
│   └── pwa-sync.js        # Instalación PWA, almacenamiento persistente y sincronización Firebase
├── icons/
│   ├── icon-192.svg       # Icono PWA 192x192 de Wilcon en SVG
│   ├── icon-512.svg       # Icono PWA 512x512 de Wilcon en SVG
│   └── icon-maskable.svg  # Icono adaptable (maskable) con zona segura en SVG
├── firebase-setup.md      # Pasos en la consola de Firebase para la sincronización opcional
├── firestore.rules        # Reglas de seguridad de Firestore por propietario (users/{uid})
└── README.md              # Guía para publicar e instalar la app en celular y laptop
```

## 🌐 Cómo publicarla gratis (incluso en una subcarpeta)

Gracias a que `manifest.webmanifest`, `sw.js` e `index.html` usan rutas relativas (`./`), funciona tanto en un dominio raíz como en una subcarpeta:

1. **GitHub Pages (en subcarpeta `https://tu-usuario.github.io/nombre-repo/`):**
   - Crea un repositorio en GitHub y sube el contenido de `wilcon-mecatronica-v2/`.
   - Ve a **Settings → Pages**, selecciona la rama `main` y la carpeta `/ (root)`, y pulsa **Save**.
   - Nota: El Service Worker requiere **HTTPS** (que GitHub Pages, Netlify y Vercel activan automáticamente) o `http://localhost` en pruebas locales.

2. **Netlify Drop / Vercel / Cloudflare Pages:**
   - Arrastra la carpeta `wilcon-mecatronica-v2` a `app.netlify.com/drop` o conéctala desde GitHub sin comando de compilación (*Framework Preset: None*).

3. **Probar localmente con Service Worker en tu computadora:**
   - Abre una terminal dentro de la carpeta y ejecuta `python3 -m http.server 8080`, luego abre `http://localhost:8080` en tu navegador.

## 📲 Cómo instalar la app en celular y laptop

- **En Android (Chrome / Edge / Brave):**
  1. Abre el enlace publicado y toca el botón **«📲 Instalar la app»** en la barra superior (o en la pestaña **Respaldo**).
  2. Confirma en **Instalar**: aparecerá en tu cajón de aplicaciones con el icono de Wilcon y abrirá a pantalla completa sin barra del navegador, funcionando incluso en **modo avión**.

- **En iPhone o iPad (Safari):**
  1. Abre el enlace publicado en **Safari**.
  2. Toca el botón **Compartir** (el cuadro con una flecha hacia arriba en la barra inferior).
  3. Desliza y selecciona **«Añadir a pantalla de inicio»** → **Añadir**.

- **En Laptop / PC (Chrome / Edge):**
  1. Haz clic en el botón **«📲 Instalar la app»** dentro de la página o en el icono de instalación que aparece al lado derecho de la barra de direcciones.

## 🔄 Actualizaciones automáticas con aviso amable
Cuando publiques un cambio en el sitio y subas el número de versión en `CACHE_VERSION` dentro de `sw.js`, el navegador descargará la nueva versión en segundo plano y Wilcon mostrará un aviso arriba: **«🐱 ¡Miau! ¡Hay una versión nueva!»** con el botón **«✨ Actualizar»**, que aplica la actualización y recarga al instante.
