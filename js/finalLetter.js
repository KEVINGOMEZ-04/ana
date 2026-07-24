/**
 * finalLetter.js — Experiencia Cinemática con GSAP & Canvas-Confetti
 * Animación de precisión con física de resorte, partículas mágicas y línea de tiempo profesional.
 */

import { FINAL_LETTER_DATA } from '../data/finalLetter.js';
import { navigateTo } from './navigation.js';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

// Normalización flexible de texto (ignora mayúsculas, tildes, signos y espacios extras)
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
};

// Validación semántica flexible para "un dibujo", "dibujito", etc.
const validateAnswer = (input) => {
  const norm = normalizeText(input);
  if (!norm) return false;
  return FINAL_LETTER_DATA.validKeywords.some(keyword => norm.includes(normalizeText(keyword)));
};

// Explosión de partículas mágicas en dorado y rosa
const triggerMagicalParticles = (originX = 0.5, originY = 0.5) => {
  confetti({
    particleCount: 45,
    spread: 70,
    origin: { x: originX, y: originY },
    colors: ['#E8C1D4', '#F0D9A6', '#F5DAE6', '#FFFFFF'],
    shapes: ['circle', 'star'],
    scalar: 0.9,
    ticks: 200,
    gravity: 0.6,
    drift: 0
  });
};

export const initFinalLetterExperience = () => {
  const answerInput = document.getElementById('chapter4-answer-input');
  const submitBtn = document.getElementById('chapter4-submit-button');
  const feedbackText = document.getElementById('chapter4-feedback-text');
  const privateScreen = document.getElementById('private-letter-screen');

  if (!answerInput || !submitBtn) return;

  // Inyectar HTML para la etapa de la llave, cajón y carta si no existen
  if (!document.getElementById('final-stage-wrapper')) {
    const stageHTML = `
      <!-- Paso 2 y 3: Etapa Cinemática GSAP -->
      <div id="final-stage-wrapper" class="secret-stage-container hidden">
        <div id="floating-key" class="floating-key-wrapper">
          <svg class="key-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="14" stroke="#E8C1D4" stroke-width="4" fill="url(#keyGrad)"/>
            <circle cx="20" cy="20" r="6" fill="#171018"/>
            <path d="M30 20H58V28H52V20H44V26H38V20H30" stroke="#E8C1D4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="url(#keyGrad)"/>
            <defs>
              <linearGradient id="keyGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop stop-color="#F5DAE6"/>
                <stop offset="1" stop-color="#E8C1D4"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div id="chest-box" class="chest-container">
          <div id="chest-lock" class="chest-lock">🔑</div>
          
          <div id="envelope-box" class="envelope-wrapper">
            <span id="envelope-seal" class="envelope-seal">💌</span>
            <button id="btn-open-letter" class="btn-primary">${FINAL_LETTER_DATA.openEnvelopeText}</button>
          </div>
        </div>
      </div>

      <!-- Paso 4: La Carta Final -->
      <div id="final-letter-container" class="final-letter-card hidden">
        <div id="final-letter-text" class="final-letter-content"></div>
        <div id="final-letter-hint" class="final-letter-hint">(Haz clic en cualquier parte de la carta para mostrar todo el texto)</div>
        
        <div class="chapter-actions" style="margin-top: 2.5rem; justify-content: center;">
          <button id="btn-final-home" class="btn-primary">Volver al inicio</button>
        </div>
      </div>
    `;

    const container = document.getElementById('final-experience-root') || document.body;
    container.insertAdjacentHTML('beforeend', stageHTML);
  }

  // Elementos DOM
  const stageWrapper = document.getElementById('final-stage-wrapper');
  const floatingKey = document.getElementById('floating-key');
  const chestBox = document.getElementById('chest-box');
  const chestLock = document.getElementById('chest-lock');
  const envelopeBox = document.getElementById('envelope-box');
  const envelopeSeal = document.getElementById('envelope-seal');
  const openLetterBtn = document.getElementById('btn-open-letter');
  const letterContainer = document.getElementById('final-letter-container');
  const letterText = document.getElementById('final-letter-text');
  const letterHint = document.getElementById('final-letter-hint');
  const finalHomeBtn = document.getElementById('btn-final-home');

  // Estado de la máquina de escribir
  let typingTimer = null;
  let isTyping = false;
  let fullText = FINAL_LETTER_DATA.text;

  // Procesar Respuesta
  const handleSubmission = () => {
    const rawVal = answerInput.value.trim();
    if (!rawVal) {
      if (feedbackText) feedbackText.textContent = "Por favor escribe tu respuesta.";
      return;
    }

    if (validateAnswer(rawVal)) {
      if (feedbackText) {
        feedbackText.textContent = "✨ ¡Respuesta correcta!";
        feedbackText.style.color = "#E8C1D4";
      }

      submitBtn.disabled = true;
      answerInput.disabled = true;

      // Lanzar minichequeo de destellos
      triggerMagicalParticles(0.5, 0.4);

      gsap.to(privateScreen, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          privateScreen.classList.add('hidden');
          runGSAPKeyTimeline();
        }
      });
    } else {
      const randomFailure = FINAL_LETTER_DATA.failureMessages[
        Math.floor(Math.random() * FINAL_LETTER_DATA.failureMessages.length)
      ];
      if (feedbackText) {
        feedbackText.textContent = randomFailure;
        feedbackText.style.color = "rgba(245, 245, 247, 0.75)";
      }

      gsap.to(answerInput, {
        x: 10,
        duration: 0.08,
        yoyo: true,
        repeat: 5,
        ease: "power1.inOut"
      });
    }
  };

  submitBtn.addEventListener('click', handleSubmission);
  answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmission();
  });

  // Línea de tiempo cinematográfica con GSAP para la Llave y el Cajón
  const runGSAPKeyTimeline = () => {
    stageWrapper.classList.remove('hidden');
    stageWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const tl = gsap.timeline();

    // 1. Revelación tridimensional de la llave con destellos
    tl.fromTo(floatingKey, 
      { opacity: 0, scale: 0.2, y: -40, rotateY: -180 }, 
      { opacity: 1, scale: 1, y: 0, rotateY: 0, duration: 1.2, ease: "back.out(1.8)" }
    )
    .add(() => {
      triggerMagicalParticles(0.5, 0.35);
    })
    
    // 2. Flotación suave antes del descenso
    .to(floatingKey, { y: -8, duration: 0.8, yoyo: true, repeat: 1, ease: "sine.inOut" })
    
    // 3. Descenso preciso hacia el cerrojo
    .to(floatingKey, { y: 110, scale: 0.85, duration: 1.0, ease: "power2.inOut" })
    
    // 4. Giro elástico de la llave en la cerradura
    .to(floatingKey, { rotate: 90, scale: 0.75, duration: 0.7, ease: "elastic.out(1.2, 0.5)" })
    
    // 5. Desvanecimiento de la llave e iluminación del cofre
    .to(floatingKey, { opacity: 0, scale: 0.1, duration: 0.35, ease: "power2.in" })
    .to(chestLock, { scale: 0.2, opacity: 0, duration: 0.4, ease: "power2.in" }, "-=0.2")
    .add(() => {
      chestBox.classList.add('opened');
      triggerMagicalParticles(0.5, 0.6);
    })
    
    // 6. Emergencia del Sobre Mágico
    .fromTo(envelopeBox, 
      { opacity: 0, scale: 0.6, y: 30 }, 
      { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "back.out(1.6)" }
    )
    .to(envelopeSeal, { scale: 1.15, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
  };

  // Apertura del Sobre y Despliegue de la Carta
  openLetterBtn.addEventListener('click', () => {
    gsap.to(stageWrapper, {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        stageWrapper.classList.add('hidden');
        letterContainer.classList.remove('hidden');
        
        gsap.fromTo(letterContainer, 
          { opacity: 0, y: 40, scale: 0.96 }, 
          { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" }
        );

        letterContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        triggerMagicalParticles(0.5, 0.2);
        startTypewriterAnimation();
      }
    });
  });

  // Animación Máquina de Escribir (Respetando saltos de línea exactos)
  const startTypewriterAnimation = () => {
    letterText.textContent = "";
    letterText.classList.add('typing');
    isTyping = true;
    let charIndex = 0;

    const typeNextChar = () => {
      if (charIndex < fullText.length) {
        letterText.textContent += fullText.charAt(charIndex);
        charIndex++;
        
        const currentChar = fullText.charAt(charIndex - 1);
        const delay = currentChar === '\n' ? 55 : 22;
        
        typingTimer = setTimeout(typeNextChar, delay);
      } else {
        finishTyping();
      }
    };

    typeNextChar();
  };

  // Completado instantáneo al hacer clic
  const finishTyping = () => {
    if (typingTimer) clearTimeout(typingTimer);
    letterText.textContent = fullText;
    letterText.classList.remove('typing');
    if (letterHint) letterHint.style.display = 'none';
    isTyping = false;
  };

  letterContainer.addEventListener('click', (e) => {
    if (e.target === finalHomeBtn) return;
    if (isTyping) {
      finishTyping();
    }
  });

  finalHomeBtn?.addEventListener('click', () => {
    navigateTo('intro');
  });
};
