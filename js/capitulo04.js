/**
 * capitulo04.js — Lógica del Capítulo IV: Primera Impresión & La Última Experiencia
 * Renderiza la vista de Carta Privada inicial y desencadena la secuencia cinemática.
 */
import { initFinalLetterExperience } from './finalLetter.js';

const initChapter04 = () => {
  const root = document.getElementById('chapter4-root');
  if (!root) return;

  // Renderizado de la Primera Impresión de Capítulo 4 (Carta Privada Card)
  root.innerHTML = `
    <div class="chapter04-wrapper fade-in">
      
      <!-- Primera Impresión: Carta Privada -->
      <section class="chapter-card glass" id="private-letter-screen">
        <span class="chapter-index">Carta Privada · Capítulo IV</span>
        <h1 class="elegant-title" style="font-size: clamp(2rem, 6vw, 3.2rem); margin-bottom: 1.5rem;">
          Algo que solo quiero decirte a ti
        </h1>
        
        <p class="body-text" style="white-space: pre-line; margin-bottom: 1.5rem; text-align: center; line-height: 1.8; color: rgba(245, 245, 247, 0.9);">
Si llegaste hasta aquí, gracias por recorrer toda esta historia.

Lo que sigue no es una sección más.
Es simplemente algo que escribí para ti.

Si algún día decides compartir esta página con alguien, adelante.
Pero esta parte preferiría que siguiera siendo solamente nuestra.
        </p>

        <div id="chapter4-prompt-container" class="chapter-actions" style="display: flex; flex-direction: column; align-items: center; gap: 1.25rem; width: 100%;">
          <span class="song-current-label" style="letter-spacing: 0.14em; font-size: 0.82rem; color: var(--color-accent); text-transform: uppercase;">
            HAY UNA ÚLTIMA COSA. PERO ANTES QUIERO SABER SI RECUERDAS ESTO...
          </span>
          <p style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-text); font-style: italic; margin: 0;">
            "Te di un regalo de tu gatito Félix."
          </p>

          <div style="width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
            <input id="chapter4-answer-input" type="text" class="body-text" placeholder="Escribe tu respuesta aquí" autocomplete="off" style="width: 100%; padding: 0.95rem 1.25rem; border-radius: 20px; border: 1px solid rgba(232, 193, 212, 0.25); background: rgba(255, 255, 255, 0.06); color: var(--color-text); font-size: 1rem; outline: none; text-align: center;" />
            <div id="chapter4-feedback-text" class="body-text" style="min-height: 1.4rem; font-size: 0.92rem; color: var(--color-accent);"></div>
            <button id="chapter4-submit-button" class="btn-primary" type="button" style="min-width: 160px;">Enviar</button>
          </div>
        </div>
      </section>

      <!-- Contenedor donde se inyectan dinámicamente los Pasos 2, 3 y 4 (Llave, Cajón, Sobre y Carta Final) -->
      <div id="final-experience-root" style="width: 100%;"></div>

    </div>
  `;

  // Inicializar controlador de validación y animaciones para el Capítulo 4
  initFinalLetterExperience();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChapter04);
} else {
  initChapter04();
}
