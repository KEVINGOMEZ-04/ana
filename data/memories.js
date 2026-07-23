// memories.js - ESTRUCTURA DE DATOS PARA CAPÍTULO II
// ====================================================
// INSTRUCCIONES PARA EDITAR:
// 1. Reemplaza las rutas de imagen (image: '') con tus archivos reales
// 2. Edita los textos: title, location, date, story, importance
// 3. Mantén exactamente esta estructura para que el JavaScript funcione
// 4. Puedes agregar más recuerdos copiando el patrón

export const MEMORIES = [
  {
    // NOTA: ID debe ser único y sin espacios
    id: 'mem-001',
    
    // Título del recuerdo (corto y significativo)
    title: 'Primera parche decente',
    
    // Lugar donde sucedió
    location: 'Ferias de dagua',
    
    // Fecha aproximada (puede ser solo mes/año)
    date: 'Diciembre 2024',
    
    // EDITA ESTO: Ruta de la imagen (ej: '/assets/images/cafe-2018.jpg')
    // Las imágenes deben estar en: assets/images/
    image: 'assets/images/memoria-001.jpg',
    
    // Descripción breve que aparece bajo la foto en la polaroid
    description: 'Una salida breve, pero que parche tan bacano',
    
    // LA HISTORIA PRINCIPAL - Esto aparece con efecto typewriter al hacer click
    // Escribe aquí qué pasó ese día, por qué fue importante, cómo te sentías
    // Puede ser de varios párrafos
    story: `Recuerdo bien esa tarde noche, una salida tranquila, 
    solo ir a ver que habian puesto para las ferias de Dagua, 
    salimos con isabela, recuerdo nitidamente que ese dia me dejaste
    esperando afuera de la casa por 30 minutos mientras vos charlabas con una amiga 🙂.
    
    Ya me dio rabia, dejemos esto hasta aqui mejor.`,
    
    // Por qué este recuerdo importa (reflexión personal)
    importance: 'El hecho de compartir contigo, hace que cualquier momento sea especial.'
  },

  {
    id: 'mem-002',
    title: 'San valentin improvisado',
    location: 'Tu casa',
    date: 'septiembre 2022',
    
    // Video que reemplaza la imagen para este recuerdo
    video: 'assets/video/memoria-002.mp4',
    
    description: 'Pesimo servicio, aun espero esas fresas con chocolate',
    
    story: `Ese dia te habia dicho que no te iba a dejar pasar san valentin sola
    y que ibamos a hacer cualquier tonteria, nos quedamos charlando en tu casa
    comiendo papas y esperando esas fresas con chocolate de 15 lukas.
    
    Nunca llegaron, pero la recocha por el pesimo servicio fue de lo mejor ese dia JAJAJA`,
    
    importance: 'Aprendi que si ibamos a salir de nuevo o armar algun plan, tu no podias armarlo, siempre elegirias el peor servicio posible JAJAJAJ'
  },

  {
    id: 'mem-003',
    title: 'Los asalareados',
    location: 'Balcon de la locura',
    date: 'Diciembre 2022',
    
    // EDITA: Cambia esta ruta por tu imagen
    image: 'assets/images/memoria-003.jpg',
    
    description: 'Nunca me habia sentido tan comodo ganando tan mal',
    
    story: `salario de 30 lukas, trabajando 12 horas seguidas,
    aun con todo eso, me levantaba con ganas de trabajar por que sabia que ibas a estar ahi, recochando
    y haciendo que todo valiera la pena.`,
    
    importance: 'Volveria a trabajar ahi, por exactamente lo mismo, solo si tu estas conmigo'
  },

  {
    id: 'mem-004',
    title: 'Renovacion de votos de tus papás',
    location: 'IPUC El Piñal',
    date: 'Enero 2019',
    
    // EDITA: Cambia esta ruta por tu imagen (puede ser screenshot si lo prefieres)
    image: 'assets/images/memoria-004.jpg',
    
    description: 'Fotos, videos y caras raras no faltaron',
    
    story: `¿Que hacia ahi?
    Ni idea
    
    Pero que buena forma de pasar una tarde-noche, entre tantas caras raras
    videos mal tomados y desenfocados, tenia claro que no podria estar en un mejor lugar que ahi`,
    
    importance: 'Tenes talento pa sacarme fotos donde salga bien paila.'
  },
];

// ====================================================
// NOTAS FINALES PARA TI:
// ====================================================
// 
// 1. AGREGAR MÁS RECUERDOS:
//    - Copia el bloque de un recuerdo
//    - Cambia el id (usa mem-009, mem-010, etc)
//    - Reemplaza todos los textos
//    - Agrega la ruta de imagen
//
// 2. IMÁGENES:
//    - Debes agregar las imágenes en: /assets/images/
//    - Los nombres deben coincidir con lo que escribas en "image:"
//    - Pueden ser JPG, PNG, o WEBP
//    - Se recomienda que sean aproximadamente 300x400px
//
// 3. FORMATO DE TEXTO:
//    - Usa comillas simples para líneas cortas
//    - Usa backticks (`) para texto largo con saltos de línea
//    - Los saltos de línea se mostrarán exactamente igual
//
// 4. PRUEBAS:
//    - Cuando agregues nuevos recuerdos, recarga la página
//    - Las polaroids apareceran automáticamente
//    - Haz click para ver si la historia se ve bien
//
// ¡Ahora sí! El resto del código reutiliza automáticamente estos datos.
