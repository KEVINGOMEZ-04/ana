// config.js - Configuración Centralizada del Proyecto
export const CONFIG = {
    // Configuración del contador
    targetDate: "2026-07-23T10:00:00",
    
    // Rutas del proyecto
    routes: {
        intro: "index.html",
        chapter1: "capitulo01.html",
        chapter2: "capitulo02.html",
        chapter3: "capitulo03.html",
        chapter4: "capitulo04.html",
        ending: "epilogo.html"
    },
    
    // Configuración del guardián (Modal)
    question: "¿Cuál fue la primera vez que nos vimos?",
    
    validAnswers: [
        "iglesia de la maria",
        "la maria",
        "ipuc la maria",
        "ipuc de la maria",
        "iglesia la maria"
    ],
    
    specialAnswers: [
        "terron colorado",
        "iglesia de terron colorado",
        "ipuc terron colorado"
    ],
    
    // Mensajes para el usuario
    messages: {
        specialAnswer: "💛 ¡Casi!\n\nTienes razón.\nEse fue el primer lugar donde nuestros caminos se cruzaron.\nPero todavía no nos conocíamos realmente.\nEstoy buscando el lugar donde comenzó nuestra amistad.",
        
        // Frases para la secuencia cinematográfica
        successPhrases: [
            "Dicen que algunas personas llegan por casualidad...",
            "Yo creo que algunas llegan exactamente cuando tenían que llegar.",
            "Aunque nuestros caminos se cruzaron antes...",
            "Fue en La María donde realmente comenzó esta historia."
        ]
    },
    
    // Configuración de animaciones (en milisegundos)
    timings: {
        typewriterSpeed: 60, // Velocidad de tipeo por letra
        pauseBetweenPhrases: 2500, // Pausa para leer cada frase
        transitionFade: 1500 // Tiempo que tarda la pantalla negra en aparecer
    }
};