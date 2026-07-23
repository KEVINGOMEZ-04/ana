import { sleep } from './utils.js';
import { playCinematicSequence } from './animations.js';
import { navigateTo } from './navigation.js';
import { CONFIG } from '../config.js';

// Sequence control for Capítulo 1
const root = document.getElementById('chapter-root');

function show(element){
  element.classList.remove('hidden');
  requestAnimationFrame(() => element.classList.add('scene-active'));
}
function hide(element){
  element.classList.remove('scene-active');
  element.classList.add('hidden');
}

async function changeScene(from, to){
  from.classList.add('fade-out');
  await sleep(420);
  from.classList.remove('fade-out');
  hide(from);
  show(to);
}

async function scene1(){
  const container = document.getElementById('scene-1');
  const lineEl = document.getElementById('scene-1-line');
  show(container);
  const lines = [
    'Hay algo curioso sobre los recuerdos.',
    'Los importantes casi nunca llegan completos.',
    'No recuerdo la fecha.',
    'No recuerdo la hora.',
    'Ni siquiera recuerdo qué ropa llevábamos.',
    'Pero sí recuerdo perfectamente...',
    '...la conversación más mal entendida de nuestras vidas.'
  ];

  for (let i = 0; i < lines.length; i++){
    lineEl.textContent = lines[i];
    lineEl.classList.add('visible');
    // Tiempo real de lectura: la entrada ya ocurre durante la transición CSS.
    await sleep(i === lines.length - 1 ? 2400 : 2000);
    lineEl.classList.remove('visible');
    await sleep(320);
  }
  // hide scene1
  hide(container);
}

async function scene2(){
  const container = document.getElementById('scene-2');
  show(container);
  await sleep(600);
}

async function scene3_reconstruct(){
  // crossfade to dialog scene
  const fileScene = document.getElementById('scene-2');
  const dialogScene = document.getElementById('scene-3');
  // simple crossfade using CSS classes
  await changeScene(fileScene, dialogScene);
}

async function scene4_dialog(){
  const speakerEl = document.getElementById('dialog-speaker');
  const textEl = document.getElementById('dialog-text');
  const timings = CONFIG.timings || { typewriterSpeed: 72, pauseBetweenPhrases: 1200 };

  const dialogue = [
    { speaker: 'Kevin', text: 'Pensé que tenías cara de que si te hablaba me ibas a responder...' },
    { speaker: 'Kevin', text: 'Habla con la mano.' },
    { speaker: 'Karina', text: '¿Cómo así que hable con tu mano?' },
    { speaker: 'Kevin', text: '...' },
    { speaker: 'Karina', text: 'Yo no voy a hablar con ninguna mano.' },
    { speaker: 'Narrador', text: 'Creo que ahí entendí dos cosas.' },
    { speaker: 'Narrador', text: 'La primera...' },
    { speaker: 'Narrador', text: 'Me explico muy mal cuando estoy nervioso.' },
    { speaker: 'Narrador', text: 'La segunda...' },
    { speaker: 'Narrador', text: 'Esa conversación iba a perseguirnos durante muchos años.' }
  ];

  for(const turn of dialogue){
    speakerEl.textContent = turn.speaker;
    // use playCinematicSequence to type the line
    await playCinematicSequence(textEl, [turn.text], timings);
    // Conservamos la última frase: evita un recuadro vacío antes de la siguiente escena.
    if (turn !== dialogue[dialogue.length - 1]) {
      await sleep(1100);
      textEl.style.opacity = '0';
      await sleep(260);
      textEl.textContent = '';
      textEl.style.opacity = '';
    }
  }
}

async function scene5_analysis(){
  const container = document.getElementById('scene-5');
  await changeScene(document.getElementById('scene-3'), container);
  await sleep(800);
  // after seconds, replace Pendiente... with Confirmado.
  const friendEl = document.getElementById('friendship');
  await sleep(1800);
  // animate opacity out/in
  friendEl.style.transition = 'opacity .8s ease, transform .8s ease';
  friendEl.style.opacity = '0';
  friendEl.style.transform = 'translateY(-6px)';
  await sleep(800);
  friendEl.textContent = 'Confirmado.';
  friendEl.style.opacity = '1';
  friendEl.style.transform = 'translateY(0)';
}

async function scene6_closing(){
  const container = document.getElementById('scene-6');
  await changeScene(document.getElementById('scene-5'), container);
  const lines = container.querySelectorAll('.closing-line');
  for(const el of lines){
    await sleep(700);
    el.classList.add('visible');
  }
  await sleep(450);
  container.querySelector('.closing-note')?.classList.add('visible');
  await sleep(300);
  container.querySelector('.continue-wrap')?.classList.add('visible');
}

// orchestrator
export async function initChapter(){
  // Run scenes in order
  await sleep(200);
  await scene1();
  await scene2();

  // Wire button
  const btn = document.getElementById('btn-reconstruct');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    await scene3_reconstruct();
    await scene4_dialog();
    await sleep(320);
    await scene5_analysis();
    await sleep(700);
    await scene6_closing();
  });

  // Continue navigation
  const continueBtn = document.getElementById('btn-continue');
  continueBtn.addEventListener('click', ()=>{
    // Use navigation system
    navigateTo('chapter2');
  });
}

// Auto init
document.addEventListener('DOMContentLoaded', ()=>{
  initChapter().catch(err => console.error(err));
});
