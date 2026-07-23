Preparar sitio para GitHub Pages

Resumen
-------
Este repositorio contiene la experiencia interactiva "Para Karina". Está diseñada como sitio estático (HTML/CSS/JS), lista para publicarse en GitHub Pages.

Qué incluye
-----------
- index.html — página principal con contador y autenticación íntima
- capitulo01.html, capitulo02.html, ... — capítulos (HTML estático / ES modules)
- css/, js/, assets/ — recursos estáticos (asegúrate de incluir el archivo de audio)

Antes de publicar
------------------
1) Añadir el archivo de audio de fondo
   - Coloca tus archivos de audio en: assets/music/backgrounds/
   - Si agregas nuevas canciones, actualiza también assets/music/backgrounds/songs.json con la lista de pistas.
   - Formato recomendado: MP3 (128–192 kbps). Evita archivos > 20–30 MB para una mejor carga en móviles.
   - Si quieres compatibilidad extra, añade una versión OGG con el mismo nombre.

2) Revisar rutas relativas
   - Todas las rutas deben ser relativas (./ o ../) para que GitHub Pages funcione correctamente incluso en https://username.github.io/repo-name/
   - Ejemplos ya usados en el proyecto: ./css/global.css, ./js/main.js, ./assets/music/backgrounds/background.mp3

3) Pruebas locales (recomendado antes de push)
   - Desde la carpeta del proyecto ejecuta (Python 3):
     python -m http.server 5500
   - Abre http://localhost:5500/ en tu navegador y prueba la experiencia.
   - Esto es importante porque los módulos ES (import/export) funcionan correctamente via HTTP(S). GitHub Pages sirve sobre HTTPS, por lo que el comportamiento local con http es representativo.

4) Subir al repositorio y activar GitHub Pages
   - Crea un nuevo repo en GitHub (ej: username/karina-regalo)
   - Desde tu máquina local (ejemplo):
     git init
     git add .
     git commit -m "Initial site for Karina"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
     git push -u origin main
   - En GitHub: Settings → Pages → Select branch: main, folder: / (root) → Save
   - En minutos tendrás: https://TU_USUARIO.github.io/NOMBRE_REPO/

Autoplay y reproducción de audio en móviles
-------------------------------------------
- Los navegadores móviles suelen bloquear autoplay. La UX implementada ya intenta reproducir audio y muestra un botón flotante (▶) para que el usuario lo inicie.
- Recomendación: vincular la reproducción a una interacción significativa (por ejemplo, el clic en "Reconstruir recuerdo"). Esto ya está soportado por el código; si quieres que al momento de "Reconstruir recuerdo" se inicie la música, dime y lo configuro específicamente.

Seguridad y licencias
---------------------
- Asegúrate de que la canción que subas tenga licencia para ser compartida públicamente. Si la pista está sujeta a copyright, considera usar un extracto corto (fair use no está garantizado) o una pista libre de derechos.

Necesitas que haga el push yo por ti?
-----------------------------------
Puedo:
- Preparar todo en esta carpeta (ya lo hago ahora).
- Crear una rama, commitear y subir los archivos a GitHub si me das el repo (usuario/nombrerepo) y confirmas que quieres que lo cree (yo puedo crear/actualizar archivos en el repo mediante la API).
- O bien, puedo darte los comandos exactos para que hagas push desde tu máquina (más privado y controlado por ti).

Si quieres que suba los cambios directamente, responde con el nombre del repo (owner/repo) y si debo usar la rama `main` o crear una rama nueva para PR.

Notas técnicas
--------------
- El proyecto soporta file:// para la página index (hay una versión inline en index.html). Sin embargo, las páginas de capítulos usan ES modules y funcionan de forma fiable cuando se sirven vía HTTP(S). Por eso GitHub Pages es ideal.

Contacto
-------
Si quieres, procedo a:
- Añadir una pequeña nota en index para forzar la reproducción al primer clic en "Reconstruir recuerdo".
- Crear un README (ya creado), .gitignore y los archivos helpers (ya creados).

Dime cómo prefieres proceder.