// utils.js - Herramientas y validaciones

/**
 * Normaliza una cadena de texto para facilitar su comparación.
 * Elimina tildes, pasa a minúsculas, elimina espacios repetidos y caracteres especiales.
 * @param {string} text - Texto a normalizar
 * @returns {string} - Texto normalizado
 */
export const normalizeAnswer = (text) => {
    if (!text) return "";
    
    return text
        .toLowerCase()
        .normalize("NFD") // Descompone caracteres con acentos
        .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos diacríticos
        .replace(/[^\w\s]/gi, "") // Elimina caracteres especiales
        .replace(/\s+/g, " ") // Colapsa múltiples espacios en uno solo
        .trim();
};

/**
 * Función para añadir un pequeño retardo. Útil para secuencias asíncronas.
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise}
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));