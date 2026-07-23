import { SOUNDTRACK as FALLBACK_SOUNDTRACK } from '../data/songs.js';

const STORAGE_KEY = 'song-library-selected-track';
const PLAY_ALLOWED_KEY = 'song-library-play-allowed';
const CHAPTER_PAGES = ['capitulo02.html', 'capitulo03.html', 'capitulo04.html'];
const MANIFEST_PATH = './assets/music/backgrounds/songs.json';

let soundtrack = FALLBACK_SOUNDTRACK;

function isSupportedPage() {
return CHAPTER_PAGES.some((page) => window.location.pathname.endsWith(page));
}

function getSavedTrackId() {
try {
  return localStorage.getItem(STORAGE_KEY);
} catch (error) {
  return null;
}
}

function saveTrackId(trackId) {
try {
  localStorage.setItem(STORAGE_KEY, trackId);
} catch (error) {
  // ignore
}
}

function savePlayAllowed() {
try {
  localStorage.setItem(PLAY_ALLOWED_KEY, 'true');
} catch (error) {
  // ignore
}
}

function hasPlayAllowed() {
try {
  return localStorage.getItem(PLAY_ALLOWED_KEY) === 'true';
} catch (error) {
  return false;
}
}

function createWidget() {
const widget = document.createElement('div');
widget.id = 'song-widget';
widget.className = 'song-widget';
widget.innerHTML = `
  <button id="song-mobile-toggle" class="song-mobile-toggle" type="button" aria-label="Abrir reproductor de música">♪</button>
  <div class="song-panel">
    <div class="song-panel-header">
      <span class="song-heading">De mi pa ti</span>
      <button id="song-close" class="song-close" type="button" aria-label="Cerrar reproductor de música">✕</button>
    </div>
    <div class="song-current">
      <div>
        <span class="song-current-label">Reproduciendo</span>
        <strong id="song-current-title" class="song-current-title">Sin canción</strong>
        <span id="song-current-artist" class="song-current-artist"></span>
      </div>
      <div class="song-controls">
        <button id="song-prev" class="song-control" type="button" aria-label="Volver a la canción anterior">⏮</button>
        <button id="song-play-toggle" class="song-play-toggle" type="button" aria-label="Reproducir o pausar canción">▶</button>
        <button id="song-next" class="song-control" type="button" aria-label="Avanzar a la siguiente canción">⏭</button>
      </div>
    </div>
  </div>
  <audio id="song-player" preload="metadata"></audio>
`;

document.body.appendChild(widget);
return widget;
}

function updateWidgetUI(widget, currentTrack, isPlaying) {
const titleEl = widget.querySelector('#song-current-title');
const artistEl = widget.querySelector('#song-current-artist');
const playToggle = widget.querySelector('#song-play-toggle');

if (!currentTrack) {
  titleEl.textContent = 'Sin canción';
  artistEl.textContent = '';
  playToggle.textContent = '▶';
} else {
  titleEl.textContent = currentTrack.title;
  artistEl.textContent = currentTrack.artist || '';
  playToggle.textContent = isPlaying ? '❚❚' : '▶';
}
}

function buildTrackIdFromPath(path) {
return path.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
}

function buildTrackFromFileName(fileName) {
const title = fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
return {
  id: buildTrackIdFromPath(title),
  title: title || fileName,
  artist: '',
  src: `./assets/music/backgrounds/${encodeURIComponent(fileName)}`
};
}

function parseDirectoryListing(html) {
const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');
const links = Array.from(doc.querySelectorAll('a'));
const tracks = links
  .map((link) => link.getAttribute('href'))
  .filter(Boolean)
  .filter((href) => href.toLowerCase().endsWith('.mp3'))
  .map((href) => {
    const fileName = href.replace(/^.*\//, '');
    return buildTrackFromFileName(decodeURIComponent(fileName));
  });

return tracks.filter((track, index, self) => self.findIndex((t) => t.id === track.id) === index);
}

async function loadManifest() {
try {
  const res = await fetch(MANIFEST_PATH, { cache: 'no-store' });
  if (!res.ok) throw new Error('No se encontró manifest');
  const data = await res.json();
  if (Array.isArray(data) && data.length > 0) {
    soundtrack = data;
    return;
  }
} catch (error) {
  console.warn('No se pudo cargar songs.json, intentando index de carpeta:', error);
}

try {
  const directoryUrl = './assets/music/backgrounds/';
  const res = await fetch(directoryUrl, { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo acceder al directorio de música');
  const html = await res.text();
  const tracks = parseDirectoryListing(html);
  if (tracks.length > 0) {
    soundtrack = tracks;
    return;
  }
  throw new Error('No se encontraron MP3 en el directorio');
} catch (error) {
  console.warn('No se pudo cargar directorio de canciones, usando fallback:', error);
  soundtrack = FALLBACK_SOUNDTRACK;
}
}

function getInitialTrack() {
return soundtrack.find((track) => track.id === getSavedTrackId()) || soundtrack[0];
}

function initSongWidget() {
if (!isSupportedPage()) return;

const widget = createWidget();
const audio = widget.querySelector('#song-player');

async function setup() {
  await loadManifest();
  if (!soundtrack.length) return;

  const mobileToggle = widget.querySelector('#song-mobile-toggle');
  const closeButton = widget.querySelector('#song-close');
  const playButton = widget.querySelector('#song-play-toggle');
  const prevButton = widget.querySelector('#song-prev');
  const nextButton = widget.querySelector('#song-next');
  let currentTrackIndex = soundtrack.findIndex((track) => track.id === getSavedTrackId());
  if (currentTrackIndex < 0) currentTrackIndex = 0;

  function setTrackByIndex(index, autoPlay = false) {
    if (index < 0 || index >= soundtrack.length) return;
    currentTrackIndex = index;
    const track = soundtrack[currentTrackIndex];
    saveTrackId(track.id);
    audio.src = track.src;
    audio.load();
    updateWidgetUI(widget, track, !audio.paused && !audio.ended);
    if (autoPlay) {
      audio.play().then(() => {
        updateWidgetUI(widget, track, true);
        savePlayAllowed();
      }).catch(() => {
        updateWidgetUI(widget, track, false);
      });
    }
  }

  function attemptAutoPlay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    audio.autoplay = true;
    audio.playsInline = true;
    audio.muted = true;
    audio.play().then(() => {
      audio.muted = false;
      setPlayState(true);
    }).catch(() => {
      audio.muted = false;
      // Autoplay bloqueado; el usuario puede iniciar desde el botón.
    });
  }

  function setPlayState(isPlaying) {
    const currentTrack = soundtrack[currentTrackIndex];
    updateWidgetUI(widget, currentTrack, isPlaying);
    if (isPlaying) {
      savePlayAllowed();
    }
  }

  playButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (audio.paused) {
      audio.play().then(() => setPlayState(true)).catch(() => setPlayState(false));
    } else {
      audio.pause();
      setPlayState(false);
    }
  });

  prevButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const previousIndex = currentTrackIndex - 1 < 0 ? soundtrack.length - 1 : currentTrackIndex - 1;
    setTrackByIndex(previousIndex, true);
  });

  nextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const nextIndex = currentTrackIndex + 1 >= soundtrack.length ? 0 : currentTrackIndex + 1;
    setTrackByIndex(nextIndex, true);
  });

  mobileToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    widget.classList.add('open');
  });

  closeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    widget.classList.remove('open');
  });

  document.addEventListener('click', (event) => {
    if (!widget.contains(event.target) && widget.classList.contains('open')) {
      widget.classList.remove('open');
    }
  });

  audio.volume = 0.06;
  audio.autoplay = true;
  audio.playsInline = true;
  audio.addEventListener('play', () => setPlayState(true));
  audio.addEventListener('pause', () => setPlayState(false));
  audio.addEventListener('ended', () => {
    const nextIndex = currentTrackIndex + 1 >= soundtrack.length ? 0 : currentTrackIndex + 1;
    setTrackByIndex(nextIndex, true);
  });

  setTrackByIndex(currentTrackIndex, false);
  updateWidgetUI(widget, soundtrack[currentTrackIndex], false);
  attemptAutoPlay();

  if (hasPlayAllowed()) {
    audio.play().then(() => setPlayState(true)).catch(() => setPlayState(false));
  }
}

setup().catch((error) => console.error('Error inicializando song widget:', error));
}

export { initSongWidget };