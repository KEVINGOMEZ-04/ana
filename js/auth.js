// auth.js - Sistema de validación y acceso
import { CONFIG } from '../config.js';
import { normalizeAnswer } from './utils.js';
import { crossfadeElements, playCinematicSequence } from './animations.js';
import { navigateTo } from './navigation.js';

const log = (message) => {
    console.log(`%c[Auth] %c${message}`, "color: #E8C1D4; font-weight: bold;", "color: inherit;");
};

export const setupAuth = () => {
    try {
        const btnUnlock = document.getElementById('btn-unlock');
        const modal = document.getElementById('auth-modal');
        const btnClose = document.getElementById('btn-close-modal');
        const questionText = document.getElementById('question-text');
        const inputAnswer = document.getElementById('answer-input');
        const btnSubmit = document.getElementById('btn-submit');
        const feedbackText = document.getElementById('feedback-message');
        
        // Elementos para la secuencia
        const mainView = document.getElementById('main-view');
        const transitionScreen = document.getElementById('transition-screen');
        const typewriterElement = document.getElementById('typewriter-text');

        if (!btnUnlock) return; // Si no estamos en index, abortar.

    // Configurar modal
    if (!questionText || !inputAnswer || !btnSubmit || !feedbackText) {
        log("⚠️ Elementos del modal no encontrados. Auth deshabilitado.");
        return;
    }

    questionText.textContent = CONFIG.question;

    const openModal = () => {
        modal.classList.remove('hidden');
        inputAnswer.focus();
        log("Modal abierto");
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        inputAnswer.value = "";
        feedbackText.classList.add('hidden');
    };

    const handleSuccess = () => {
        // Guardar estado en localStorage
        localStorage.setItem("accessGranted", "true");
        log("✅ Acceso concedido - localStorage actualizado");
            
        // Cerrar modal y preparar pantallas
        modal.classList.add('hidden');
        crossfadeElements(mainView, transitionScreen);
            
        // Iniciar secuencia cinemática después de que el crossfade termine
        setTimeout(() => {
            playCinematicSequence(
                typewriterElement, 
                CONFIG.messages.successPhrases, 
                CONFIG.timings, 
                () => {
                    navigateTo('chapter1');
                }
            );
        }, CONFIG.timings.transitionFade);
    };

    const validateAnswer = () => {
        const rawValue = inputAnswer.value.trim();
            
        if (!rawValue) {
            feedbackText.textContent = "Por favor, ingresa una respuesta.";
            feedbackText.classList.remove('hidden');
            return;
        }

        const normalizedInput = normalizeAnswer(rawValue);
            
        // Chequeo de Respuesta Correcta
        const isCorrect = CONFIG.validAnswers.some(ans => normalizeAnswer(ans) === normalizedInput);
            
        if (isCorrect) {
            feedbackText.classList.add('hidden');
            handleSuccess();
            return;
        }

        // Chequeo de Respuesta Especial
        const isSpecial = CONFIG.specialAnswers.some(ans => normalizeAnswer(ans) === normalizedInput);
            
        if (isSpecial) {
            feedbackText.textContent = CONFIG.messages.specialAnswer;
            feedbackText.classList.remove('hidden');
            inputAnswer.value = "";
            inputAnswer.focus();
            return;
        }

        // Respuesta incorrecta (animación sutil de error)
        feedbackText.textContent = "Hmm, esa no es la respuesta que busco. Intenta nuevamente. 💭";
        feedbackText.classList.remove('hidden');
            
        inputAnswer.style.transform = "translateX(-10px)";
        setTimeout(() => inputAnswer.style.transform = "translateX(10px)", 100);
        setTimeout(() => inputAnswer.style.transform = "translateX(0)", 200);
        inputAnswer.focus();
    };

    // Event Listeners
    btnUnlock.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    btnSubmit.addEventListener('click', validateAnswer);
        
    inputAnswer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            validateAnswer();
        }
    });

    log("✅ Sistema de autenticación inicializado");
} catch (error) {
    console.error("❌ Error en setupAuth:", error);
}
};