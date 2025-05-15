import { JamBuddy } from './jam_buddy';
import confetti from 'canvas-confetti';
window.confetti = confetti;
import '../css/styles.css';
import correctMusic from '../assets/music/victory.mp3';
import wrongMusic from '../assets/music/wrong.mp3';




const guiElements = {
  form: document.getElementById("distance-input-form"),
  streakElement: document.getElementById("streak"),
  streakNumberElement: document.getElementById("streak-number"),
  inputField: document.getElementById("input-field"),
  restartButton: document.getElementById("restart-btn"),
  giveUpButton: document.getElementById("give-up-btn"),
  randomizeButton: document.querySelector("#randomize-btn"),
  submitButton: document.getElementById("submit-btn"),
  correctMessage: document.getElementById("correctMessage"),
  incorrectMessage: document.getElementById("incorrectMessage"),
  explanation: document.querySelector("#explanation"),
  answerText: document.querySelector("#answer-text"),
  mainCounter: document.querySelector("#main-counter"),
  clockwiseAnswer: document.querySelector("#clockwise-answer"),
  antiClockwiseAnswer: document.querySelector("#anti-clockwise-answer"),
  firstNote: document.querySelector("#first-note"),
  secondNote: document.querySelector("#second-note"),
  correctMusic:document.getElementById('correct-music'),
  wrongMusic :document.getElementById('wrong-music'),
  backgroundMusic:document.getElementById("background-music")
};

const jamBuddy = new JamBuddy();
let streakCounter = 0;
let noteOne, noteTwo;
let doCountIntervalId;

const colorOne = "#007bff";
const colorTwo = "#7da2ca";
const enharmonicEquivelantsIndexArray = [1, 4, 6, 9,11];

[noteOne, noteTwo] = initNotes(jamBuddy);
document.addEventListener("DOMContentLoaded", () => {
  restartEventListener();
  giveUpEventListener();
  randomizeEventListener();
  submitEventListener();
});

function restartEventListener() {
  guiElements.restartButton.addEventListener("click", () => reloadPage(location));
}

function giveUpEventListener() {
  guiElements.giveUpButton.addEventListener("click", () => {
    toggleButtons("disable");
    changeButtonColor(colorTwo);
    guiElements.inputField.disabled = true;
    clearTheBoxes(document);
    doTheExplanation(document, noteOne, noteTwo);
    streakCounter = 0;
    updateStrikes(streakCounter);
  });
}

function randomizeEventListener() {
  guiElements.randomizeButton.addEventListener("click", () => {
    guiElements.correctMusic.pause();
    guiElements.correctMusic.currentTime = 0
    switchOffAnswerMessages();
    clearTheBoxes(document);
    switchOffAnswer(document, noteOne, noteTwo);
    toggleButtons("enable");
    changeButtonColor(colorOne);
    guiElements.inputField.disabled = false;
    [noteOne, noteTwo] = initNotes(jamBuddy);
    if (doCountIntervalId) {
      clearInterval(doCountIntervalId);
    }
  });
}

function submitEventListener() {
  guiElements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const distance = parseInt(guiElements.inputField.value);

    if (isNaN(distance)) {
      window.alert("Input can't be empty");
      return;
    }

    guiElements.inputField.value = "";

    switchOffAnswer(document, noteOne, noteTwo);

    if (jamBuddy.checkAnswer(distance)) {
      const colors = streakCounter > 5 ? ['#ff0000', '#00ff00', '#0000ff'] : ['#007bff', '#ffb700'];
  
        window.confetti({
          particleCount: 100 + streakCounter * 10,
          spread: 160 + streakCounter * 5,
          origin: { y: 0.6 },
          colors: colors,
        });

      guiElements.correctMusic.play();

      displayAnswerMessage("correct");
      showAnswer(document, noteOne, noteTwo);
      streakCounter++;
      toggleButtons("disable");
      changeButtonColor(colorTwo);
      guiElements.inputField.disabled = true;
      updateStrikes(streakCounter);
    } else {

      guiElements.wrongMusic.play();
      displayAnswerMessage("incorrect");
      streakCounter = 0;
      updateStrikes(streakCounter);
    }
  });
}

function initNotes(jamBuddy) {
  jamBuddy.randomizeCurrentNotes();
  const [noteOne, noteTwo] = jamBuddy.getCurrentNotes();
  guiElements.firstNote.innerText = noteOne;
  guiElements.secondNote.innerText = noteTwo;

  return [noteOne, noteTwo];
}

function reloadPage(location) {
  location.href = location.href;
}

function toggleButtons(status) {
  const isDisabled = status === "disable";
  guiElements.submitButton.disabled = isDisabled;
  guiElements.giveUpButton.disabled = isDisabled;
}

function changeButtonColor(color) {
  guiElements.submitButton.style.backgroundColor = color;
  guiElements.giveUpButton.style.backgroundColor = color;
}

function displayAnswerMessage(status) {
  guiElements.correctMessage.style.display =
    status === "correct" ? "block" : "none";
  guiElements.incorrectMessage.style.display =
    status === "incorrect" ? "block" : "none";
}

function updateStrikes(streakCounter) {
  guiElements.streakNumberElement.innerText = streakCounter;
}

function clearTheBoxes(document) {
  for (let i = 0; i < 12; i++) {
    if (enharmonicEquivelantsIndexArray.includes(i)) {
      document.querySelector(`#a${i}a0`).style.backgroundColor = "#ccc";
      document.querySelector(`#a${i}a1`).style.backgroundColor = "#ccc";
    } else {
      document.querySelector(`#a${i}`).style.backgroundColor = "#ccc";
    }
  }
}

function switchOffAnswer(document, noteOne, noteTwo) {
  guiElements.explanation.style.display = "none";
  document.querySelector(
    `#a${JamBuddy.musicalElements[noteOne]}`
  ).style.backgroundColor = "#ccc";
  document.querySelector(
    `#a${JamBuddy.musicalElements[noteTwo]}`
  ).style.backgroundColor = "#ccc";
}

function showAnswer(document) {
  let noteOne;
  let noteTwo;
  [noteOne, noteTwo] = jamBuddy.getCurrentNotes();

  const index1 = JamBuddy.musicalElements[noteOne];
  const index2 = JamBuddy.musicalElements[noteTwo];
  guiElements.mainCounter.innerText = "";
  guiElements.explanation.style.display = "block";
  guiElements.answerText.style.display = "none";


  const getColorSelector = (index, note) =>
    `#a${index}${
      enharmonicEquivelantsIndexArray.includes(index) ? `a${note.includes("#") ? "0" : "1"}` : ""
    }`;

  document.querySelector(
    getColorSelector(index1, noteOne)
  ).style.backgroundColor = "red";
  document.querySelector(
    getColorSelector(index2, noteTwo)
  ).style.backgroundColor = "yellow";
}
function switchOffAnswerMessages() {
  guiElements.correctMessage.style.display = "none";
  guiElements.incorrectMessage.style.display = "none";
}

function doTheExplanation(document, noteOne, noteTwo) {
  guiElements.clockwiseAnswer.innerText="";
  guiElements.antiClockwiseAnswer.innerText="";
  guiElements.mainCounter.innerText = "";
  showAnswer(document, noteOne, noteTwo);
  guiElements.answerText.style.display = "block";

  let one = JamBuddy.musicalElements[noteOne];
  let two = JamBuddy.musicalElements[noteTwo];

  [one, two] = one < two ? [one, two] : [two, one];

  doCount(one, two, guiElements.clockwiseAnswer, () => {
    doCount(two, one, guiElements.antiClockwiseAnswer);
  });
}

function doCount(num1, num2, id, callback) {
  let count = 0;
  const totalNotes = 12;

  doCountIntervalId = setInterval(() => {
    if (num1 !== num2) {
      num1 = (num1 + 1) % totalNotes;
      count++;
      id.innerText = count;
      guiElements.mainCounter.innerText = count;

      const element = document.querySelector(`#a${num1}`);
      const store = element.style.backgroundColor;
      element.style.backgroundColor = "blue";
      setTimeout(() => {
        element.style.backgroundColor = store;
      }, 600);
    } else {
      clearInterval(doCountIntervalId);
      if (typeof callback === "function") {
        callback();
      }
      guiElements.mainCounter.innerText = "";
    }
  }, 900);
}

export {
  restartEventListener,
  giveUpEventListener,
  randomizeEventListener,
  submitEventListener,
  reloadPage,
  jamBuddy,
  guiElements,
};
