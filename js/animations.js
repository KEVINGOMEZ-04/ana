// animations.js - Efectos visuales y cinemáticos
import { sleep } from './utils.js';

/**
 * Ejecuta un efecto de máquina de escribir elemento por elemento.
 * @param {HTMLElement} element - Elemento DOM donde se inyectará el texto
 * @param {string} text - Texto a tipear
 * @param {number} speed - Velocidad en ms por letra
 * @param {AbortSignal} [signal] - Señal para cancelar la animación
 */
const typeText = async (element, text, speed, signal, onType) => {
    element.textContent = "";
    element.classList.remove("finished");
    
    for (let i = 0; i < text.length; i++) {
        if (signal?.aborted) return;
        element.textContent += text.charAt(i);
        if (typeof onType === 'function') {
            onType(text.charAt(i));
        }
        await sleep(speed);
    }
    
    if (!signal?.aborted) {
        element.classList.add("finished");
    }
};

/**
 * Ejecuta una secuencia completa de frases con el efecto typewriter.
 * @param {HTMLElement} element - Contenedor del texto
 * @param {Array<string>} phrases - Arreglo de frases
 * @param {Object} timings - Configuración de tiempos
 * @param {Function} onComplete - Callback al finalizar
 * @returns {AbortController} - Controlador para cancelar la secuencia
 */
const typewriterSoundState = {
    id: null,
    context: null,
    buffer: null,
    initialized: false
};

let typewriterAudioUnlocked = false;

function unlockTypewriterAudio() {
    if (typewriterAudioUnlocked) return;
    typewriterAudioUnlocked = true;
    if (typewriterSoundState.context && typewriterSoundState.context.state === 'suspended') {
        typewriterSoundState.context.resume().catch(() => {});
    }

    const audioElement = document.getElementById(typewriterSoundState.id || 'typing-effect');
    if (!audioElement) return;

    const unlockClone = audioElement.cloneNode(true);
    unlockClone.muted = true;
    unlockClone.volume = 0;
    unlockClone.playsInline = true;
    unlockClone.setAttribute('playsinline', '');
    document.body.appendChild(unlockClone);
    unlockClone.play().then(() => {
        unlockClone.pause();
        unlockClone.remove();
    }).catch(() => {
        unlockClone.remove();
    });
}

window.addEventListener('pointerdown', unlockTypewriterAudio, { once: true, capture: true });
window.addEventListener('keydown', unlockTypewriterAudio, { once: true, capture: true });

async function initializeTypewriterSound(id) {
    if (!id) return false;
    if (typewriterSoundState.initialized && typewriterSoundState.id === id) {
        return true;
    }

    typewriterSoundState.id = id;
    typewriterSoundState.initialized = false;
    typewriterSoundState.buffer = null;
    typewriterSoundState.context = null;

    const audioElement = document.getElementById(id);
    if (!audioElement) return false;

    const src = audioElement.currentSrc || audioElement.src;
    if (!src) return false;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    try {
        const context = new AudioCtx();
        if (context.state === 'suspended') {
            await context.resume().catch(() => {});
        }

        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await new Promise((resolve, reject) => {
            context.decodeAudioData(arrayBuffer, resolve, reject);
        });

        typewriterSoundState.context = context;
        typewriterSoundState.buffer = buffer;
        typewriterSoundState.initialized = true;
        return true;
    } catch (error) {
        console.warn('No se pudo inicializar el sonido de tipeo:', error);
        return false;
    }
}

function playTypewriterTap(volume = 0.7, duration = 0.1) {
    if (typewriterSoundState.initialized && typewriterSoundState.context && typewriterSoundState.buffer) {
        try {
            if (typewriterSoundState.context.state === 'suspended') {
                typewriterSoundState.context.resume().catch(() => {});
            }
            const source = typewriterSoundState.context.createBufferSource();
            source.buffer = typewriterSoundState.buffer;
            // Variación sutil de tono para teclas mecánicas reales
            source.playbackRate.value = 0.95 + Math.random() * 0.1;
            const gain = typewriterSoundState.context.createGain();
            gain.gain.value = volume;
            source.connect(gain).connect(typewriterSoundState.context.destination);
            source.start(0, 0, duration);
            source.onended = () => {
                source.disconnect();
                gain.disconnect();
            };
            return;
        } catch (error) {
            console.warn('Error al reproducir sonido de tipeo con Web Audio:', error);
        }
    }

    const audio = document.getElementById(typewriterSoundState.id || 'typing-effect');
    if (!audio) return;

    try {
        const clone = audio.cloneNode(true);
        clone.volume = volume;
        clone.muted = false;
        clone.currentTime = 0;
        clone.preload = 'auto';
        clone.playsInline = true;
        clone.setAttribute('playsinline', '');
        document.body.appendChild(clone);
        const p = clone.play();
        if (p) p.catch(() => {});
        setTimeout(() => {
            clone.pause();
            clone.remove();
        }, duration * 1000 + 40);
    } catch (e) {}
}

export const playCinematicSequence = async (element, phrases, timings, onComplete) => {
    const controller = new AbortController();
    const soundId = timings?.soundId;
    const soundVolume = typeof timings?.soundVolume === 'number' ? timings.soundVolume : 0.25;

    if (soundId) {
        await initializeTypewriterSound(soundId);
    }

    try {
        for (let i = 0; i < phrases.length; i++) {
            if (controller.signal.aborted) break;

            await typeText(element, phrases[i], timings.typewriterSpeed, controller.signal, (char) => {
                if (/\S/.test(char)) {
                    playTypewriterTap(soundVolume);
                }
            });

            await sleep(timings.pauseBetweenPhrases);

            // Limpiar el texto si no es la última frase con un pequeño fade
            if (i < phrases.length - 1 && !controller.signal.aborted) {
                element.style.opacity = "0";
                await sleep(500);
                element.textContent = "";
                element.style.opacity = "1";
            }
        }

        if (!controller.signal.aborted && typeof onComplete === 'function') {
            onComplete();
        }
    } catch (error) {
        console.error("Error en playCinematicSequence:", error);
    }

    return controller;
};

/**
 * Transición suave entre pantallas manipulando clases CSS
 */
export const crossfadeElements = (hideElement, showElement) => {
    hideElement.classList.add("fade-out");
    setTimeout(() => {
        hideElement.classList.add("hidden");
        showElement.classList.remove("hidden");
        showElement.classList.add("fade-in");
    }, 1500);
};

/**
 * Reproduce un audio una vez y retorna una promesa que resuelve cuando termina o despues de timeout
 */
export function playAudioOnce(id, volume = 1, timeout = 1500){
    try{
        const a = document.getElementById(id);
        if(!a) return Promise.resolve(false);
        a.pause();
        a.currentTime = 0;
        a.volume = volume;
        return a.play().then(()=>{
            return new Promise((resolve)=>{
                const onEnd = ()=>{ a.removeEventListener('ended', onEnd); resolve(true); };
                a.addEventListener('ended', onEnd);
                // fallback timeout
                setTimeout(()=>{ a.removeEventListener('ended', onEnd); resolve(true); }, timeout);
            });
        }).catch(()=> Promise.resolve(false));
    }catch(e){ return Promise.resolve(false); }
}

/**
 * Inicia/asegura reproducción de loop ambiente
 */
export function ensureAmbient(id, volume = 0.08){
    try{
        const a = document.getElementById(id);
        if(!a) return;
        a.loop = true; 
        a.volume = volume; 
        a.currentTime = 0;
        a.play().catch(()=>{});
    }catch(e){}
}
