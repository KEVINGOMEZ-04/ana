// navigation.js - Manejo de rutas
import { CONFIG } from '../config.js';

const log = (message) => {
    console.log(`%c[Navigation] %c${message}`, "color: #E8C1D4; font-weight: bold;", "color: inherit;");
};

/**
 * Valida que una ruta exista en CONFIG.routes
 * @param {string} routeKey - Llave definida en CONFIG.routes
 * @returns {boolean}
 */
const isValidRoute = (routeKey) => {
    return routeKey in CONFIG.routes && CONFIG.routes[routeKey];
};

/**
 * Redirige a una vista específica basada en la llave de ruta de CONFIG.
 * @param {string} routeKey - Llave definida en CONFIG.routes (ej. 'chapter1')
 */
export const navigateTo = (routeKey) => {
    if (!isValidRoute(routeKey)) {
        console.error(`❌ Ruta no encontrada para la llave: ${routeKey}`);
        return;
    }
    
    const route = CONFIG.routes[routeKey];
    log(`Navegando a: ${routeKey} (${route})`);
    window.location.href = route;
};

/**
 * Verifica si el usuario ya tiene acceso al contenido.
 * Si estamos en un capítulo y no tiene acceso, lo redirige al intro.
 */
export const checkAccess = () => {
    const isGranted = localStorage.getItem("accessGranted") === "true";
    const currentPath = window.location.pathname;
    
    // Si no es el index y no tiene acceso, devolver al intro
    if (!currentPath.includes(CONFIG.routes.intro) && !currentPath.endsWith("/") && !isGranted) {
        log("⚠️ Acceso denegado - Redirigiendo al intro");
        navigateTo('intro');
    } else if (isGranted) {
        log("✅ Acceso verificado");
    }
};