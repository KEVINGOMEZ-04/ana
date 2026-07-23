import { sleep } from './utils.js';
import { playCinematicSequence } from './animations.js';
import { CONFIG } from '../config.js';
import { CHAPTER3 } from '../data/chapter03.js';
import { COLLECTIONS, discoverCollectionAssets } from '../data/galleryData.js';
import { getBirthDate, getTimeData, formatCountdown, formatNumberValue } from './timeCalculator.js';

const root = document.getElementById('chapter-root');
let activeWord = null;
let activeArtwork = null;
let wordMotionFrame = null;

function getRandomRotation() {
  return `${(Math.random() * 8 - 4).toFixed(2)}deg`;
}

async function renderGallery() {
  const gallery = document.getElementById('gallery-grid');
  if (!gallery) return;
  gallery.innerHTML = '';

  // Render cada colección como un bloque narrativo grande
  for (const col of COLLECTIONS) {
    const item = document.createElement('section');
    item.className = 'gallery-item collection-item';
    if (col.key === 'Karina') item.classList.add('karina-collection');
    item.style.setProperty('--rotation', '0deg');
    item.innerHTML = `
      <div class="gallery-card">
        <div class="gallery-image-placeholder" data-cover>Buscando imagen...</div>
        <div class="gallery-caption">
          <h3 class="gallery-title">${col.title}</h3>
          <p class="gallery-description">${col.description}</p>
          <div class="collection-meta">
            <span class="meta-count" data-count>0 fotos</span>
            <button type="button" class="btn-primary open-collection">Volver a ese momento</button>
          </div>
        </div>
      </div>
    `;

    gallery.appendChild(item);

    // descubrir assets y actualizar la tarjeta
    (async () => {
      const assets = await discoverCollectionAssets(col.key, col.aliases);
      const uniqueAssets = assets.filter((asset, index, list) => list.findIndex((other) => other.url.toLowerCase() === asset.url.toLowerCase()) === index);
      const coverEl = item.querySelector('[data-cover]');
      const countEl = item.querySelector('[data-count]');
      const btn = item.querySelector('.open-collection');

      const images = uniqueAssets.filter(a => a.type === 'image');
      const videos = uniqueAssets.filter(a => a.type === 'video');
      const total = uniqueAssets.length;

      if (coverEl) {
        if (images[0]) {
          coverEl.innerHTML = `<img src="${images[0].url}" alt="${col.title} cover" class="gallery-image" loading="lazy">`;
        } else if (videos[0]) {
          coverEl.innerHTML = `<video muted playsinline preload="metadata" class="gallery-image"><source src="${videos[0].url}"></video>`;
        } else {
          coverEl.textContent = '';
          coverEl.style.minHeight = '160px';
          coverEl.style.background = 'linear-gradient(90deg, rgba(20,12,18,0.6), rgba(8,6,12,0.4))';
        }
      }

      if (countEl) {
        countEl.textContent = `${images.length} fotos · ${videos.length} videos`;
      }

      btn.addEventListener('click', () => openCollection(col, uniqueAssets));
    })();
  }
}

function createOverlayContent(col, assets){
  const overlay = document.getElementById('gallery-overlay');
  overlay.innerHTML = '';
  const modal = document.createElement('div');
  modal.className = 'collection-modal';
  modal.innerHTML = `
    <button class="modal-close">✕</button>
    <div class="modal-head">
      <h3 class="gallery-title">${col.title}</h3>
      <p class="gallery-description">${col.description}</p>
    </div>
    <div class="modal-body">
      <div class="carousel" data-carousel></div>
    </div>
    <div class="modal-foot">
      <button class="carousel-prev">◀</button>
      <button class="carousel-next">▶</button>
    </div>
  `;
  overlay.appendChild(modal);

  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', closeCollection);

  const carousel = modal.querySelector('[data-carousel]');
  assets.forEach((a) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    if (a.type === 'image') {
      slide.innerHTML = `<img src="${a.url}" class="carousel-image" loading="lazy">`;
    } else {
      slide.innerHTML = `<video controls class="carousel-video" preload="metadata"><source src="${a.url}"></video>`;
    }
    carousel.appendChild(slide);
  });

  // simple navegación
  const next = modal.querySelector('.carousel-next');
  const prev = modal.querySelector('.carousel-prev');
  let index = 0;
  function update(){
    const slides = carousel.querySelectorAll('.carousel-slide');
    slides.forEach((s,i)=>{
      s.style.display = i===index ? 'block' : 'none';
    });
  }
  update();
  next.addEventListener('click', ()=>{ index = Math.min(index+1, carousel.children.length-1); update(); });
  prev.addEventListener('click', ()=>{ index = Math.max(index-1, 0); update(); });

  overlay.classList.add('active');
  document.body.classList.add('focus-mode');
}

function openCollection(col, assets){
  createOverlayContent(col, assets);
}

function closeCollection(){
  const overlay = document.getElementById('gallery-overlay');
  overlay.classList.remove('active');
  overlay.innerHTML = '';
  document.body.classList.remove('focus-mode');
}

async function openArtwork(card, artwork) {
  if (activeArtwork) return;
  activeArtwork = artwork;

  const overlay = document.getElementById('gallery-overlay');
  const info = card.querySelector('[data-artwork-info]');
  const reflection = card.querySelector('.artwork-reflection');

  document.body.classList.add('focus-mode');
  card.classList.add('expanded');
  overlay.classList.add('active');
  info.classList.add('expanded');

  reflection.textContent = '';
  await playCinematicSequence(reflection, artwork.reflection, {
    typewriterSpeed: 48,
    pauseBetweenPhrases: 1300
  });
}

async function closeArtwork() {
  const overlay = document.getElementById('gallery-overlay');
  const expanded = document.querySelector('.gallery-item.expanded');
  if (!expanded) return;

  activeArtwork = null;
  overlay.classList.remove('active');
  document.body.classList.remove('focus-mode');
  expanded.classList.remove('expanded');

  const info = expanded.querySelector('[data-artwork-info]');
  if (info) {
    info.classList.remove('expanded');
  }

  await sleep(260);
}

function renderMusic() {
  const musicGrid = document.getElementById('music-grid');
  CHAPTER3.universe.music.forEach((song) => {
    const card = document.createElement('div');
    card.className = 'music-card';
    card.innerHTML = `
      <div class="music-body">
        <span class="music-label">${song.label}</span>
        <div class="music-title">${song.title}</div>
        ${song.embedUrl ? `
          <div class="music-embed">
            <iframe data-testid="embed-iframe" style="border-radius:12px" src="${song.embedUrl}" width="100%" height="352" frameborder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </div>
        ` : ''}
      </div>
    `;

    musicGrid.appendChild(card);
  });
}

const TIME_INTRO_LINES = [
  'Cada persona es mucho más que un nombre.',
  'También es tiempo.',
  'Tiempo vivido.',
  'Tiempo compartido.',
  'Y millones de pequeños momentos que casi nunca nos detenemos a imaginar.'
];

const TIME_FINAL_LINES = [
  'No importa cuántos días hayan pasado.',
  'No importa cuántos millones de veces haya latido tu corazón.',
  'Lo verdaderamente importante...',
  '...es todo lo que has hecho con ese tiempo.'
];

const TIME_BLOCKS = [
  {
    key: 'daysLived',
    title: 'Has vivido...',
    note: 'Cada amanecer se convierte en un pequeño descubrimiento.',
    unit: 'días',
    valueKey: 'daysLived',
    format: (data) => formatNumberValue(data.daysLived)
  },
  {
    key: 'heartBeats',
    title: 'Tu corazón ha latido aproximadamente...',
    note: 'Sigue latiendo mientras estás leyendo esto.',
    unit: 'latidos',
    valueKey: 'heartBeats',
    format: (data) => formatNumberValue(data.heartBeats),
    live: true
  },
  {
    key: 'secondsLived',
    title: 'Mientras lees esta página...',
    note: 'Porque tu tiempo sigue en movimiento.',
    unit: 'segundos',
    valueKey: 'secondsLived',
    format: (data) => formatNumberValue(data.secondsLived),
    live: true
  },
  {
    key: 'nextBirthday',
    title: 'El próximo cumpleaños será',
    note: 'Una cuenta regresiva que recuerda que el tiempo sigue acercándose.',
    unit: '',
    valueKey: 'nextBirthdayLabel',
    format: (data) => data.nextBirthdayLabel,
    countdown: true
  },
  {
    key: 'earthRevolutions',
    title: 'La Tierra ya ha dado',
    note: 'Cada año es una órbita más completa.',
    unit: 'vueltas alrededor del Sol',
    valueKey: 'earthRevolutions',
    format: (data) => formatNumberValue(data.earthRevolutions, 2),
    digits: 2
  },
  {
    key: 'moonCycles',
    title: 'Aproximadamente',
    note: 'Cada fase que ha acompañado tu historia.',
    unit: 'lunas',
    valueKey: 'moonCycles',
    format: (data) => formatNumberValue(data.moonCycles)
  },
  {
    key: 'yearsSlept',
    title: 'Has dormido alrededor de',
    note: 'Suponiendo un promedio de 8 horas diarias.',
    unit: 'años',
    valueKey: 'yearsSlept',
    format: (data) => formatNumberValue(data.yearsSlept, 2),
    digits: 2
  }
];

let timeObserver = null;
let timeLiveInterval = null;
let timeHasStarted = false;

function createTimeCard(item, timeData) {
  const card = document.createElement('article');
  card.className = 'time-card';
  card.dataset.key = item.key;
  card.dataset.live = item.live ? 'true' : 'false';
  card.dataset.countdown = item.countdown ? 'true' : 'false';
  card.innerHTML = `
    <div class="time-card-copy">
      <p class="time-card-title">${item.title}</p>
      <div class="time-count" data-time-count="${item.key}">0</div>
      <p class="time-card-unit">${item.unit}</p>
      <p class="time-card-note">${item.note}</p>
    </div>
  `;
  if (item.countdown) {
    const unitEl = card.querySelector('.time-card-unit');
    unitEl.textContent = '';
  }
  const countEl = card.querySelector('[data-time-count]');
  countEl.dataset.valueKey = item.valueKey;
  return card;
}

function renderTimeSummary(timeData) {
  const summary = document.getElementById('time-summary');
  summary.innerHTML = `
    <p class="time-summary-text">Tienes exactamente <strong>${timeData.years} años, ${timeData.months} meses y ${timeData.days} días</strong>.</p>
    <div class="time-exact-list">
      <span>Horas: ${formatNumberValue(timeData.hours)}</span>
      <span>Minutos: ${formatNumberValue(timeData.minutes)}</span>
      <span>Segundos: ${formatNumberValue(timeData.seconds)}</span>
    </div>
  `;
}

function renderTimeCards(timeData) {
  const timeMap = document.getElementById('time-map');
  timeMap.innerHTML = '';
  TIME_BLOCKS.forEach((item) => {
    const card = createTimeCard(item, timeData);
    timeMap.appendChild(card);
  });
}

function animateNumber(element, from, to, duration = 1200, digits = 0) {
  const start = performance.now();
  const range = to - from;

  return new Promise((resolve) => {
    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = from + range * eased;
      element.textContent = digits > 0 ? formatNumberValue(value, digits) : formatNumberValue(Math.floor(value));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}

function updateTimeElement(element, formattedValue) {
  element.textContent = formattedValue;
}

function getTimeDisplayValue(item, data) {
  if (item.countdown) {
    return formatCountdown(data.countdown);
  }
  return item.format(data);
}

function startLiveUpdates(birthDate) {
  if (timeLiveInterval) return;

  timeLiveInterval = setInterval(() => {
    const currentData = getTimeData(birthDate);
    document.querySelectorAll('.time-card').forEach((card) => {
      if (card.dataset.live !== 'true' && card.dataset.countdown !== 'true') return;
      const key = card.dataset.key;
      const countEl = card.querySelector('[data-time-count]');
      const item = TIME_BLOCKS.find((entry) => entry.key === key);
      if (!item) return;
      const formatted = getTimeDisplayValue(item, currentData);
      updateTimeElement(countEl, formatted);
    });
  }, 1000);
}

function animateTimeCard(card, timeData, birthDate) {
  if (card.dataset.animated === 'true') return;
  const key = card.dataset.key;
  const item = TIME_BLOCKS.find((entry) => entry.key === key);
  if (!item) return;
  const countEl = card.querySelector('[data-time-count]');
  const currentValue = item.countdown ? formatCountdown(timeData.countdown) : item.format(timeData);

  if (item.countdown) {
    countEl.textContent = currentValue;
  } else {
    const rawValue = Number(timeData[item.valueKey]);
    if (!Number.isFinite(rawValue)) {
      countEl.textContent = currentValue;
    } else {
      animateNumber(countEl, 0, rawValue, 1200, item.digits || 0);
    }
  }

  card.dataset.animated = 'true';

  if (!timeHasStarted) {
    timeHasStarted = true;
    startLiveUpdates(birthDate);
  }
}

function initTimeObserver(timeData, birthDate) {
  const cards = document.querySelectorAll('.time-card');
  if (timeObserver) {
    timeObserver.disconnect();
  }
  timeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animateTimeCard(entry.target, timeData, birthDate);
          timeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  cards.forEach((card) => timeObserver.observe(card));
}

async function playTimeSection() {
  const birthDate = getBirthDate(CONFIG);
  const timeData = getTimeData(birthDate);

  const intro = document.getElementById('time-intro');
  const footer = document.getElementById('time-footer');

  renderTimeSummary(timeData);
  renderTimeCards(timeData);
  initTimeObserver(timeData, birthDate);

  await playCinematicSequence(intro, TIME_INTRO_LINES, {
    typewriterSpeed: 44,
    pauseBetweenPhrases: 1100
  });

  await playCinematicSequence(footer, TIME_FINAL_LINES, {
    typewriterSpeed: 44,
    pauseBetweenPhrases: 1100
  });
}

function pauseAllMusic(exceptAudio = null) {
  document.querySelectorAll('.music-audio').forEach((audio) => {
    if (audio !== exceptAudio) {
      audio.pause();
      const parent = audio.closest('.music-card');
      if (parent) {
        parent.classList.remove('playing');
        const btn = parent.querySelector('.music-btn');
        if (btn) btn.textContent = 'Escuchar';
      }
    }
  });
}

function toggleMusicTrack(audio, button, card) {
  if (audio.paused) {
    pauseAllMusic(audio);
    audio.play();
    card.classList.add('playing');
    button.textContent = 'Pausa';
  } else {
    audio.pause();
    card.classList.remove('playing');
    button.textContent = 'Escuchar';
  }
}

function renderDiscovery() {
  const discoverGrid = document.getElementById('discover-grid');
  CHAPTER3.universe.details.forEach((detail) => {
    const card = document.createElement('div');
    card.className = 'detail-card';
    card.innerHTML = `
      <div class="detail-icon">${detail.icon}</div>
      <div class="detail-label">${detail.label}</div>
      <div class="detail-value">${detail.value}</div>
      <div class="detail-note">${detail.note}</div>
    `;
    discoverGrid.appendChild(card);
  });
}


async function playPhrases() {
  const phrasesContainer = document.getElementById('phrases-list');
  CHAPTER3.phrases.forEach((phrase) => {
    const element = document.createElement('div');
    element.className = 'phrase-line';
    element.textContent = phrase;
    phrasesContainer.appendChild(element);
  });

  const lines = phrasesContainer.querySelectorAll('.phrase-line');
  for (const line of lines) {
    await sleep(850);
    line.classList.add('visible');
  }
}

function renderWords() {
  const wordsContainer = document.getElementById('words-grid');
  CHAPTER3.words.forEach((item) => {
    const token = document.createElement('div');
    token.className = 'floating-word';
    token.textContent = item.word;
    token.dataset.word = item.word;
    token.dataset.explanation = item.explanation;
    token.addEventListener('click', () => selectWord(token, item));
    wordsContainer.appendChild(token);
  });
}

function selectWord(element, item) {
  if (activeWord === element) {
    element.classList.remove('active');
    activeWord = null;
    updateWordDetail('Haz clic en una palabra para descubrir por qué la elegí.');
    return;
  }

  document.querySelectorAll('.floating-word.active').forEach((word) => word.classList.remove('active'));
  element.classList.add('active');
  activeWord = element;
  updateWordDetail(item.explanation);
}

function updateWordDetail(text) {
  const detail = document.getElementById('word-detail');
  detail.textContent = text;
}

function attachWordMotion() {
  const section = document.getElementById('words-section');
  if (!section) return;

  const words = section.querySelectorAll('.floating-word');
  section.addEventListener('mousemove', (event) => {
    if (wordMotionFrame) cancelAnimationFrame(wordMotionFrame);
    wordMotionFrame = requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      words.forEach((word, index) => {
        const degree = (index % 2 === 0 ? 1 : -1) * 0.8;
        const x = offsetX * 0.02 * degree;
        const y = offsetY * 0.02 * degree;
        word.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  });

  section.addEventListener('mouseleave', () => {
    words.forEach((word) => {
      word.style.transform = 'translate(0, 0)';
    });
  });
}

async function playFinalScene() {
  const finalImage = document.getElementById('final-image');
  const finalCopy = document.getElementById('final-copy');
  const finalText = document.getElementById('final-text');
  const continueBtn = document.getElementById('btn-open-private-letter');

  finalImage.src = CHAPTER3.final.image;
  finalImage.alt = 'Fotografía final de Karina';
  finalImage.classList.add('visible');

  await sleep(900);
  finalText.textContent = '';
  finalCopy.classList.add('visible');

  await playCinematicSequence(finalText, CHAPTER3.final.lines, {
    typewriterSpeed: 44,
    pauseBetweenPhrases: 1500
  });

  continueBtn.classList.add('visible');
}

function showSection(selector) {
  const section = document.querySelector(selector);
  if (!section) return;
  section.classList.remove('hidden');
  section.classList.add('scene-active');
}

async function playIntroSequence() {
  const transitionSection = document.getElementById('scene-transition');
  const transitionText = document.getElementById('transition-text');

  if (!transitionSection || !transitionText) return;

  transitionSection.classList.remove('hidden');
  transitionText.textContent = '';
  transitionText.classList.add('visible');
  transitionText.style.opacity = '1';

await playCinematicSequence(transitionText, CHAPTER3.introLines, {
  typewriterSpeed: 54,
  pauseBetweenPhrases: 1400,
  soundId: 'typing-effect',
  soundVolume: 0.16
});

  await sleep(400);
  transitionText.classList.remove('visible');
  transitionSection.classList.add('hidden');
}

async function initChapter() {
  renderGallery();
  renderMusic();
  renderDiscovery();
  renderWords();
  attachWordMotion();
  updateWordDetail('Haz clic en una palabra para descubrir por qué la elegí.');

  await playIntroSequence();

  showSection('.chapter-intro');
  await sleep(800);
  showSection('.gallery-section');
  await sleep(500);
  showSection('.time-section');
  await playTimeSection();
  await sleep(1600);
  showSection('.universe-section');
  await sleep(500);
  showSection('.phrases-section');
  await playPhrases();
  await sleep(500);
  showSection('.words-section');
  await sleep(1200);
  showSection('.final-section');
  await playFinalScene();
}

function setupEventListeners() {
  const overlay = document.getElementById('gallery-overlay');
  // clic en fondo: cierra la colección si hay modal, sino cierra la obra expandida
  overlay.addEventListener('click', (event) => {
    if (event.target !== overlay) return;
    const modal = overlay.querySelector('.collection-modal');
    if (modal) return closeCollection();
    return closeArtwork();
  });


  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeArtwork();
      closeVideo();
      closeCollection();
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const overlayActive = document.getElementById('gallery-overlay')?.classList.contains('active');
      if (!overlayActive) return;
      const modal = document.querySelector('.collection-modal');
      if (!modal) return;
      const nextBtn = modal.querySelector('.carousel-next');
      const prevBtn = modal.querySelector('.carousel-prev');
      if (event.key === 'ArrowRight' && nextBtn) nextBtn.click();
      if (event.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  setupEventListeners();
  await initChapter();
});
