// capitulo02.js - LÓGICA INTERACTIVA PARA CAPÍTULO II
// =====================================================

import { sleep } from './utils.js';
import { playCinematicSequence } from './animations.js';
import { navigateTo } from './navigation.js';
import { CONFIG } from '../config.js';
import { MEMORIES } from '../data/memories.js';

const log = (msg) => console.log(`%c[Cap2] %c${msg}`, "color: #E8C1D4; font-weight: bold;", "color: inherit;");

// =====================================================
// UTILIDADES PARA MANEJO DEL GRID Y MODAL
// =====================================================

/**
 * Genera un ángulo de rotación aleatorio para simular polaroids tiradas
 * Rango: -4deg a 4deg
 */
function getRandomRotation() {
    return (Math.random() * 8 - 4).toFixed(2);
}

/**
 * Crea una tarjeta polaroid desde un objeto de memoria
 */
function createPolaroidCard(memory) {
    const article = document.createElement('article');
    article.className = 'polaroid';
    article.id = `polaroid-${memory.id}`;
    article.style.setProperty('--rotation', `${getRandomRotation()}deg`);
    article.setAttribute('data-memory-id', memory.id);

    const hasVideo = Boolean(memory.video);
    const posterAttr = memory.image ? `poster="${memory.image}"` : '';
    const mediaContent = hasVideo ? `
            <video 
                class="polaroid-video" 
                src="${memory.video}" 
                ${posterAttr}
                preload="metadata"
                playsinline
                muted
            ></video>
        ` : `
            <img 
                class="polaroid-image" 
                src="${memory.image}" 
                alt="${memory.title}"
                loading="lazy"
                onerror="this.style.display='none'"
            >
        `;

    article.innerHTML = `
        <div class="polaroid-image-wrapper">
            ${mediaContent}
        </div>
        <div class="polaroid-info">
            <h3 class="polaroid-title">${memory.title}</h3>
            <div class="polaroid-meta">
                <p class="polaroid-meta-item"><strong>📍</strong> ${memory.location}</p>
                <p class="polaroid-meta-item"><strong>📅</strong> ${memory.date}</p>
            </div>
        </div>
    `;
    
    return article;
}

/**
 * Llena el grid con todas las polaroids desde el array MEMORIES
 */
function renderMemoriesGrid() {
    const grid = document.getElementById('memories-grid');
    
    if (!grid) {
        log("❌ Grid no encontrado");
        return;
    }
    
    if (MEMORIES.length === 0) {
        log("⚠️ No hay recuerdos en el array MEMORIES");
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-muted);">Aún no hay recuerdos...</p>';
        return;
    }
    
    // Generar cada polaroid
    MEMORIES.forEach((memory, index) => {
        const polaroid = createPolaroidCard(memory);
        grid.appendChild(polaroid);
        
        // Agregar event listener para click
        polaroid.addEventListener('click', () => openMemoryModal(memory));
    });
    
    log(`✅ ${MEMORIES.length} polaroids renderizadas`);
}

// =====================================================
// LÓGICA DEL MODAL
// =====================================================

let currentMemory = null;
let typewriterController = null;

/**
 * Abre el modal para mostrar un recuerdo expandido
 * Ejecuta la secuencia de animaciones y efecto typewriter
 */
async function openMemoryModal(memory) {
    currentMemory = memory;
    
    const overlay = document.getElementById('memory-overlay');
    const modal = document.getElementById('memory-modal');
    const grid = document.getElementById('memories-grid');
    
    // Llenar datos del modal
    document.getElementById('modal-title').textContent = memory.title;
    document.getElementById('modal-location').textContent = memory.location;
    document.getElementById('modal-date').textContent = memory.date;
    document.getElementById('modal-description').textContent = memory.description;
    document.getElementById('modal-importance').textContent = memory.importance;

    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');

    modalImage.style.display = 'none';
    modalVideo.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.removeAttribute('src');
    modalVideo.removeAttribute('poster');
    modalVideo.onclick = null;

    if (memory.video) {
        modalVideo.src = memory.video;
        if (memory.image) {
            modalVideo.poster = memory.image;
        }
        modalVideo.style.display = 'block';
        modalVideo.load();
        modalVideo.play().catch(() => {});
        modalVideo.onclick = (event) => {
            if (event.target !== modalVideo) return;
            if (modalVideo.paused) {
                modalVideo.play().catch(() => {});
            } else {
                modalVideo.pause();
            }
        };
    } else {
        modalImage.src = memory.image || '';
        modalImage.style.display = 'block';
    }

    // Limpiar la historia previa por si la hay
    const storyElement = document.getElementById('modal-story');
    storyElement.textContent = '';
    
    // Hacer visible el overlay con fade-in
    overlay.classList.add('active');
    grid.classList.add('blurred');
    
    log(`🔓 Modal abierto: ${memory.title}`);
    
    // Esperar a que el modal animate
    await sleep(400);
    
    // Iniciar el efecto typewriter para la historia
    // NOTA: Usa playCinematicSequence de animations.js que ya está importado
    typewriterController = await playCinematicSequence(
        storyElement,
        [memory.story],
        CONFIG.timings || { typewriterSpeed: 34, pauseBetweenPhrases: 900 }
    );
}

/**
 * Cierra el modal actual
 */
async function closeMemoryModal() {
    const overlay = document.getElementById('memory-overlay');
    const grid = document.getElementById('memories-grid');
    const modalVideo = document.getElementById('modal-video');
    
    // Cancelar typewriter si está en progreso
    if (typewriterController) {
        typewriterController.abort();
        typewriterController = null;
    }

    if (modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
    }
    
    // Fade out
    overlay.classList.remove('active');
    grid.classList.remove('blurred');
    
    await sleep(350);
    
    currentMemory = null;
    log("🔒 Modal cerrado");
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function setupEventListeners() {
    // Botón cerrar modal
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMemoryModal);
    }
    
    // Cerrar modal al hacer click en el overlay (no en el modal mismo)
    const overlay = document.getElementById('memory-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeMemoryModal();
            }
        });
    }
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentMemory) {
            closeMemoryModal();
        }
    });
    
    // Botón de navegación al siguiente capítulo
    const continueBtn = document.getElementById('btn-continue-ch3');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            log("Navegando a Capítulo III...");
            navigateTo('chapter3');
        });
    }
}

// =====================================================
// SECUENCIA DE TRANSICIÓN INICIAL
// =====================================================

async function playIntroSequence() {
    const transitionSection = document.getElementById('scene-transition');
    const introSection = document.querySelector('.chapter-intro');
    const transitionText = document.getElementById('transition-text');
    
    if (!transitionSection || !introSection) return;
    
    // Mostrar transición
    transitionSection.classList.remove('hidden');
    
    // Líneas de transición
    const lines = [
        'Hay algo especial en descubrir que no estabas solo.',
        'Que alguien se convirtió en tu favorito sin que te dieras cuenta.',
        'Que cientos de pequeños momentos...',
        'Se convirtieron en una amistad para toda la vida.'
    ];
    
    for (let i = 0; i < lines.length; i++) {
        transitionText.textContent = lines[i];
        transitionText.classList.add('visible');
        await sleep(i === lines.length - 1 ? 1500 : 1200);
        transitionText.classList.remove('visible');
        await sleep(200);
    }
    
    // Ocultar transición y mostrar intro
    transitionSection.classList.add('hidden');
    introSection.classList.remove('hidden');
    
    await sleep(600);
}

// =====================================================
// INICIALIZADOR PRINCIPAL
// =====================================================

export async function initChapter() {
    try {
        log("📖 Inicializando Capítulo II...");
        
        // 1. Reproducir transición
        await playIntroSequence();
        
        // 2. Renderizar grid de polaroids
        renderMemoriesGrid();
        
        // 3. Setup de listeners
        setupEventListeners();
        
        log("✅ Capítulo II completamente inicializado");
        
    } catch (error) {
        console.error("❌ Error en initChapter:", error);
    }
}

// =====================================================
// AUTO-INICIALIZACIÓN
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initChapter().catch(err => console.error(err));
});

// =====================================================
// NOTAS PARA EDICIÓN
// =====================================================

/*
   ESTRUCTURA DE DATOS (en data/memories.js):
   
   export const MEMORIES = [
     {
       id: 'mem-001',
       title: 'Título',
       location: 'Lugar',
       date: 'Fecha',
       image: '/assets/images/archivo.jpg',
       description: 'Descripción breve',
       story: 'Historia completa...',
       importance: 'Por qué importa...'
     }
   ];
   
   PARA AGREGAR MÁS RECUERDOS:
   - Edita data/memories.js
   - Agrega nuevo objeto al array MEMORIES
   - Las polaroids apareceran automáticamente
   - NO necesitas editar este archivo (capitulo02.js)
   
   IMÁGENES:
   - Deben estar en: /assets/images/
   - Formato recomendado: JPG o PNG, ~300x400px
   - En "image:" del objeto memory, usa la ruta completa
   
   TYPEWRITER:
   - Usa playCinematicSequence de animations.js
   - CONFIG.timings controla la velocidad
   - Se puede cancelar con ESC
   
   RESPONSIVE:
   - El CSS ya maneja tablet y móvil
   - Las polaroids se reorganizan automáticamente
   - El modal se adapta a pantallas pequeñas
*/
