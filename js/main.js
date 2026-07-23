// main.js - Punto de entrada de la aplicación
import { checkAccess } from './navigation.js';
import { initCountdown } from './countdown.js';
import { setupAuth } from './auth.js';
import { initSongWidget } from './songWidget.js';

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 1. Verificar si estamos en rutas protegidas
        checkAccess();
        
        // 2. Inicializar componentes
        initCountdown();
        setupAuth();
        initSongWidget();
        
        // Log sutil para consola (calidad profesional)
        console.log("%cProyecto K %c- Arquitectura Base Inicializada", 
            "color: #E8C1D4; font-weight: bold; font-size: 14px;", 
            "color: inherit; font-size: 12px;");
    } catch (error) {
        console.error("❌ Error durante la inicialización:", error);
        // Fallback: mostrar al menos la interfaz
        document.body.style.display = 'block';
    }
});