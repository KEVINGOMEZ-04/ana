// Editable configuration for the experience. Only this file should be edited to change content.
export const CONFIG = {
  name: "Karina",
  // ISO target date (local time assumed by browser)
  targetDateISO: "2026-07-23T10:00:00",

  // Question presented in the modal
  question: "¿Cuál fue la primera vez que nos vimos?",

  // Respuestas válidas exactas (tolerancia via normalizeAnswer)
  validAnswers: [
    "Iglesia de La María",
    "La María",
    "IPUC La María",
    "IPUC de La María",
    "Iglesia La María"
  ],

  // Respuestas especiales (casi correctas) — auth.js espera specialAnswers
  specialAnswers: [
    "Terrón Colorado",
    "Iglesia de Terrón Colorado",
    "IPUC Terrón Colorado"
  ],

  // Selectores usados por los componentes HTML
  countdownSelector: "#countdown-container",
  modalSelector: "#auth-modal",

  // Tiempos y animaciones (auth y animations usan estas claves)
  timings: {
    transitionFade: 600, // ms para crossfade
    overlayDuration: 2200, // ms para overlay total
    typewriterSpeed: 34, // ms por caracter
    pauseBetweenPhrases: 900 // ms de pausa entre frases en la secuencia
  },

  // Mensajes utilizados en la secuencia cinemática y respuestas
  messages: {
    successPhrases: [
      "Dicen que algunas personas llegan por casualidad...",
      "Yo creo que algunas llegan exactamente cuando tenían que llegar.",
      "Aunque nuestros caminos se cruzaron antes...",
      "Fue en La María donde realmente comenzó esta historia."
    ],
    specialAnswer: "💛 ¡Casi!\n\nTienes razón. Ese fue el primer lugar donde nuestros caminos se cruzaron.\nPero todavía no nos conocíamos realmente. Estoy buscando el lugar donde comenzó nuestra amistad."
  },

  // Rutas centralizadas (usar siempre via navigation.js)
  routes: {
    intro: "index.html",
    chapter1: "capitulo01.html",
    chapter2: "capitulo02.html",
    chapter3: "capitulo03.html",
    chapter4: "capitulo04.html",
    ending: "epilogo.html"
  },

  birthDateISO: "2007-07-23T08:30:00"
};
