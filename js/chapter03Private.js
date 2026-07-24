import { CONFIG } from '../config.js';
import { PRIVATE_LETTER } from '../data/privateLetter.js';
import { normalizeAnswer } from './utils.js';
import { crossfadeElements, playCinematicSequence } from './animations.js';
import { navigateTo } from './navigation.js';

const STORAGE_KEY = 'private-letter-revealed';

const getElement = (id) => document.getElementById(id);

const showMessage = (element, message) => {
  element.textContent = message;
  element.classList.remove('hidden');
};

const hideMessage = (element) => {
  element.textContent = '';
  element.classList.add('hidden');
};

const getRandomFailure = () => {
  return PRIVATE_LETTER.failureMessages[
    Math.floor(Math.random() * PRIVATE_LETTER.failureMessages.length)
  ];
};

const renderLetter = async (letterElement) => {
  letterElement.textContent = '';
  letterElement.style.opacity = '1';
  letterElement.classList.remove('hidden');
  await playCinematicSequence(
    letterElement,
    [PRIVATE_LETTER.letter],
    { typewriterSpeed: CONFIG.timings.typewriterSpeed, pauseBetweenPhrases: 800, soundId: 'typing-effect', soundVolume: 0.12 }
  );
};

const setupPrivateLetter = () => {
  if (!window.location.pathname.endsWith('capitulo03.html')) return;

  const mainCard = getElement('chapter-root');
  const privateScreen = getElement('private-letter-container');
  const openButton = getElement('btn-open-private-letter');
  const questionText = getElement('private-question-text');
  const promptContainer = getElement('private-prompt-container');
  const answerInput = getElement('private-answer-input');
  const submitButton = getElement('private-submit-button');
  const feedbackText = getElement('private-feedback-text');
  const letterContent = getElement('private-letter-text');
  const cardContent = getElement('private-letter-content');
  const returnButton = getElement('private-return-button');
  const introText = getElement('private-intro-text');

  if (!mainCard || !privateScreen || !openButton || !questionText || !promptContainer || !answerInput || !submitButton || !feedbackText || !letterContent || !cardContent || !introText) {
    return;
  }

  questionText.textContent = PRIVATE_LETTER.question;
  introText.textContent = PRIVATE_LETTER.intro;

  const revealLetter = async () => {
    hideMessage(feedbackText);
    submitButton.disabled = true;
    answerInput.disabled = true;
    promptContainer.classList.add('fade-out');

    setTimeout(async () => {
      promptContainer.classList.add('hidden');
      promptContainer.classList.remove('fade-out');
      cardContent.classList.remove('hidden');
      cardContent.classList.add('fade-in');
      await renderLetter(letterContent);
      cardContent.classList.remove('fade-in');
      localStorage.setItem(STORAGE_KEY, 'true');
      submitButton.disabled = false;
    }, 650);
  };

  const showPrompt = () => {
    promptContainer.classList.remove('hidden');
    promptContainer.classList.remove('fade-out');
    cardContent.classList.add('hidden');
    cardContent.classList.remove('fade-in');
    answerInput.disabled = false;
    answerInput.value = '';
    answerInput.focus();
    hideMessage(feedbackText);
  };

  const openPrivateScreen = () => {
    crossfadeElements(mainCard, privateScreen);

    const alreadyRevealed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (alreadyRevealed) {
      promptContainer.classList.add('hidden');
      cardContent.classList.remove('hidden');
      cardContent.classList.add('fade-in');
      renderLetter(letterContent).catch(() => {});
      return;
    }

    showPrompt();
  };

  const handleSubmit = () => {
    const rawAnswer = answerInput.value.trim();
    if (!rawAnswer) {
      showMessage(feedbackText, 'Por favor escribe una respuesta para continuar.');
      return;
    }

    const normalizedInput = normalizeAnswer(rawAnswer);
    const isCorrect = PRIVATE_LETTER.validAnswers.some((answer) => normalizeAnswer(answer) === normalizedInput);

    if (isCorrect) {
      revealLetter();
      return;
    }

    showMessage(feedbackText, getRandomFailure());
    answerInput.value = '';
    answerInput.focus();
  };

  const closePrivateScreen = () => {
    crossfadeElements(privateScreen, mainCard);
  };

  openButton.addEventListener('click', openPrivateScreen);
  submitButton.addEventListener('click', handleSubmit);
  answerInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  });
  returnButton.addEventListener('click', () => {
    navigateTo('chapter4');
  });
};

window.addEventListener('DOMContentLoaded', setupPrivateLetter);
