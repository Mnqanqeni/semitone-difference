const { JamBuddy } = require("./jam_buddy");
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
};

function initNotes(jamBuddy) {
  jamBuddy.randomizeCurrentNotes();
  const [noteOne, noteTwo] = jamBuddy.getCurrentNotes();
  guiElements.firstNote.innerText = noteOne;
  guiElements.secondNote.innerText = noteTwo;
  return [noteOne, noteTwo];
}

function reloadPage(window) {
  window.location.reload();
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

function showStreakMessage(streakCounter) {
  guiElements.streakNumberElement.innerText = streakCounter;
  guiElements.streakElement.style.display = "block";
}

function switchOffStreakMessage() {
  guiElements.streakElement.style.display = "none";
}

function switchMessageOff() {
  guiElements.correctMessage.style.display = "none";
  guiElements.incorrectMessage.style.display = "none";
}

function clearTheBoxes(document) {
  const arrayObject = [1, 4, 6, 9];
  for (let i = 0; i < 12; i++) {
    if (arrayObject.includes(i)) {
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

function delayCode(streakCounter) {
  setTimeout(() => {
    switchMessageOff();
    showStreakMessage(streakCounter);
  }, 600);
}

function showAnswer(document, noteOne, noteTwo) {
  const arrayObject = [1, 4, 6, 9];
  const index1 = JamBuddy.musicalElements[noteOne];
  const index2 = JamBuddy.musicalElements[noteTwo];

  guiElements.explanation.style.display = "block";
  guiElements.answerText.style.display = "none";

  const getColorSelector = (index, note) =>
    `#a${index}${
      arrayObject.includes(index) ? `a${note.includes("#") ? "0" : "1"}` : ""
    }`;

  document.querySelector(
    getColorSelector(index1, noteOne)
  ).style.backgroundColor = "red";
  document.querySelector(
    getColorSelector(index2, noteTwo)
  ).style.backgroundColor = "yellow";
}

function doTheExplanation(document, noteOne, noteTwo, streakCounter) {
  showStreakMessage(streakCounter);
  showAnswer(document, noteOne, noteTwo);
  guiElements.answerText.style.display = "block";

  const one = JamBuddy.musicalElements[noteOne];
  const two = JamBuddy.musicalElements[noteTwo];

  if (one < two) {
    doCount(one, two, guiElements.clockwiseAnswer, () => {
      doCount(two, one, guiElements.antiClockwiseAnswer);
    });
  } else {
    doCount(two, one, guiElements.clockwiseAnswer, () => {
      doCount(one, two, guiElements.antiClockwiseAnswer);
    });
  }
}

function doCount(num1, num2, id, callback) {
  let count = 0;
  const totalNotes = 12;

  const intervalId = setInterval(() => {
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
      clearInterval(intervalId);
      if (typeof callback === "function") {
        callback();
      }
      guiElements.mainCounter.innerText = "";
    }
  }, 600);
}

module.exports = {
  initNotes,
  reloadPage,
  toggleButtons,
  changeButtonColor,
  displayAnswerMessage,
  showStreakMessage,
  switchOffStreakMessage,
  switchMessageOff,
  delayCode,
  switchOffAnswer,
  clearTheBoxes,
  showAnswer,
  doTheExplanation,
  doCount,
  guiElements,
};
