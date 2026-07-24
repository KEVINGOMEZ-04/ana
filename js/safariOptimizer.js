/**
 * safariOptimizer.js — Módulo de Optimización Híbrida WebKit / Safari & iOS
 * Encargado de la gestión de viewport dinámico y desbloqueo de audio en iOS.
 */

// 1. Cálculo dinámico de altura real del viewport para iOS Safari
const updateViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--dvh', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// 2. Desbloqueador de políticas de Autoplay Audio para iOS Safari / WebKit
const setupAudioUnlocker = () => {
    const unlockAudio = () => {
        // Buscar elementos audio en la página y reproducir silenciosamente si están listos
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach((audio) => {
            if (audio.paused && audio.src) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Si era una prueba de desbloqueo, reanudar según estado previo
                    }).catch(() => {
                        // Ignorar bloqueos en primer intento sin romper la UX
                    });
                }
            }
        });

        // Remover listeners de desbloqueo tras el primer gesto del usuario
        window.removeEventListener('touchstart', unlockAudio, { passive: true });
        window.removeEventListener('pointerdown', unlockAudio, { passive: true });
        window.removeEventListener('click', unlockAudio, { passive: true });
    };

    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('click', unlockAudio, { passive: true });
};

// Initialization
const initSafariOptimizer = () => {
    updateViewportHeight();
    setupAudioUnlocker();

    window.addEventListener('resize', updateViewportHeight, { passive: true });
    window.addEventListener('orientationchange', () => {
        setTimeout(updateViewportHeight, 200);
    }, { passive: true });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSafariOptimizer);
} else {
    initSafariOptimizer();
}
