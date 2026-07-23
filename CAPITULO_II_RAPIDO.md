# 🚀 CAPÍTULO II — REFERENCIA RÁPIDA

## ¿QUÉ HACER AHORA?

### PASO 1: Agrega tus fotos 📸
```
Carpeta: /assets/images/

Copia tus 8 fotos:
- memoria-001.jpg
- memoria-002.jpg
- ...
- memoria-008.jpg
```

**Tamaño recomendado**: 300x400px (vertical)

---

### PASO 2: Edita tus historias ✍️
```
Archivo: /data/memories.js

Cada recuerdo tiene:
- title: "Título corto"
- location: "Lugar donde pasó"
- date: "Mes Año"
- image: '/assets/images/tu-foto.jpg'  ← Ruta de tu foto
- description: "Resumen de 1-2 líneas"
- story: "Tu historia completa..." ← ESCRIBE AQUÍ
- importance: "Por qué importa"
```

---

### PASO 3: Prueba 🧪
```
1. Abre terminal en la carpeta del proyecto
2. Ejecuta: .\serve.ps1
3. Abre navegador: http://localhost:5500/capitulo02.html
4. ¡Disfruta! 🎉
```

---

## ESTRUCTURA EXACTA DE UN RECUERDO

```javascript
{
  id: 'mem-001',
  
  title: 'Primer café juntos',
  
  location: 'Cafetería de La María',
  
  date: 'Octubre 2018',
  
  image: '/assets/images/memoria-001.jpg',
  
  description: 'Dos tazas de café y una conversación que cambiaría todo.',
  
  story: `Recuerdo que ese día decidimos ir por un café.
No era nada planeado.
Tú ordenaste un cappuccino y yo un espresso doble.
...`,
  
  importance: 'Este fue el punto de quiebre.'
}
```

**IMPORTANTE**: Cada campo entre comillas es un STRING
- ID y rutas: sin acento
- Historias largas: usa backticks (`) 
- Historias cortas: usa comillas simples (')

---

## DATOS DE EJEMPLO (YA ESTÁN LISTOS)

He dejado 8 recuerdos de ejemplo completamente escritos:

1. Primer café juntos → Edita con tu primer encuentro
2. Tardes de lluvia y risas → Edita con un momento juntos
3. La película que comentamos todo → Edita con una salida
4. Conversación de madrugada → Edita con charla profunda
5. Cuando te defendí → Edita con momento de lealtad
6. Proyecto final de semestre → Edita con trabajo conjunto
7. Tu cumpleaños → Edita con celebración
8. Ese día en el parque → Edita con momento especial

**Cópialos exactamente como template y solo cambia los textos.**

---

## CÓMO SE VE

### En Escritorio:
```
┌──────┐  ┌──────┐  ┌──────┐
│ Foto │  │ Foto │  │ Foto │
│      │  │      │  │      │
│ Info │  │ Info │  │ Info │
└──────┘  └──────┘  └──────┘
```
(Todas ligeramente rotadas, con sombras suaves)

### Al hacer click:
```
        ┌─────────────────┐
        │    TÍTULO       │
        │  📍 LUGAR       │
        │  📅 FECHA       │
        ├─────────────────┤
        │  [FOTO GRANDE]  │
        ├─────────────────┤
        │ Resumen breve   │
        │                 │
        │ La historia...  │
        │ (con typewriter)│
        │                 │
        │ Por qué importa │
        └─────────────────┘
```

---

## ERRORES COMUNES

### ❌ "Las imágenes no se ven"
- La ruta debe ser exacta: `/assets/images/memoria-001.jpg`
- Las imágenes deben estar REALMENTE en esa carpeta
- Usa nombres sin espacios ni caracteres especiales

### ❌ "Las polaroids no aparecen"
- Verifica que `memories.js` tenga recuerdos
- Recarga la página (Ctrl+F5)
- Abre consola (F12) y busca errores

### ❌ "El modal no se abre"
- Intenta con otro recuerdo
- Recarga la página
- Verifica consola de errores

### ❌ "El typewriter no funciona"
- Verifica que CONFIG.timings esté en config.js
- Recarga la página
- No es crítico, funciona de todas formas

---

## AGREGAR MÁS RECUERDOS

1. **En `memories.js`**:
   - Copia un recuerdo completo
   - Cambia `id: 'mem-009'` (el siguiente)
   - Edita todos los campos
   - Agrega tu imagen

2. **Ejemplo**:
   ```javascript
   {
     id: 'mem-009',  // ← Nuevo ID
     title: 'Tu título nuevo',
     location: 'Tu lugar',
     date: 'Tu fecha',
     image: '/assets/images/memoria-009.jpg',
     description: 'Tu descripción',
     story: 'Tu historia',
     importance: 'Tu reflexión'
   }
   ```

3. **La polaroid aparece automáticamente** ✨

---

## PERSONALIZACIÓN AVANZADA

### Cambiar el subtítulo:
En `capitulo02.html`, busca:
```html
<p class="subtitle">
  "No recuerdo cuándo empezamos a ser mejores amigos.<br>
  Solo recuerdo que un día ya era normal que estuvieras ahí."
</p>
```

Reemplaza con tu frase.

### Cambiar el título:
En `capitulo02.html`, busca:
```html
<h2 class="elegant-title">Los pequeños momentos</h2>
```

Reemplaza con tu título.

### Cambiar las líneas de transición:
En `js/capitulo02.js`, busca:
```javascript
const lines = [
  'Hay algo especial en descubrir...',
  // ...
];
```

Reemplaza con tus líneas.

---

## ARCHIVOS QUE EDITAR

### ✏️ DEBES EDITAR ESTOS:
1. **data/memories.js** ← AQUÍ VAS TOS RECUERDOS Y HISTORIAS
2. Agrega imágenes en **assets/images/**

### ⚠️ PUEDES EDITAR ESTOS (pero no es necesario):
3. capitulo02.html ← si quieres cambiar el título/subtítulo
4. js/capitulo02.js ← si quieres cambiar líneas de transición

### 🔒 NO EDITES ESTOS (romperás cosas):
- css/chapter02.css ← a menos que entiendas CSS
- Cualquier clase o ID en HTML

---

## CHECKLIST ANTES DE "TERMINAR"

- [ ] Tengo 8 (o más) imágenes en `/assets/images/`
- [ ] Las rutas en `memories.js` coinciden con mis imágenes
- [ ] He escrito historias personales en el campo `story`
- [ ] He probado que aparecen las polaroids
- [ ] He hecho click y se abre el modal
- [ ] He leído la historia completa con efecto typewriter
- [ ] He probado en móvil
- [ ] He cerrado el modal con X, ESC, y click fuera
- [ ] Los colores siguen siendo los mismos que Cap 1
- [ ] La tipografía sigue siendo Playfair Display + Inter

---

## VERSIÓN RÁPIDA (TL;DR)

```
1. Agrega fotos en: assets/images/
2. Edita: data/memories.js
3. Prueba: http://localhost:5500/capitulo02.html
4. Disfruta ✨
```

---

## ¿PROBLEMAS?

**Lee**: `CAPITULO_II_GUIA.md` (archivo completo con soluciones)

O abre la consola (F12) y busca mensajes de error rojo.

---

**¡Eso es todo! Disfruta creando recuerdos digitales. 🎉**
