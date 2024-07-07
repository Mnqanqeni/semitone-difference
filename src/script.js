const { JamBuddy } = require("./jam_buddy");
const confetti = require("canvas-confetti");

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

const jamBuddy = new JamBuddy();
let streakCounter = 0;
let noteOne, noteTwo;

const colorOne = "#007bff";
const colorTwo = "#7da2ca";

[noteOne, noteTwo] = initNotes(jamBuddy);

restartEventListener(guiElements);
giveUpEventListener(guiElements);
randomizeEventListener(guiElements);
submitEventListener(guiElements, jamBuddy);

function restartEventListener(guiElements) {
  guiElements.restartButton.addEventListener("click", () => reloadPage(window));
}

function giveUpEventListener(guiElements) {
  guiElements.giveUpButton.addEventListener("click", () => {
    toggleButtons("disable");
    changeButtonColor(colorTwo);
    guiElements.inputField.disabled = true;
    clearTheBoxes(document);
    doTheExplanation(document, noteOne, noteTwo, streakCounter);
    streakCounter = 0;
    showStreakMessage(streakCounter);
  });
}

function randomizeEventListener(gui) {
  guiElements.randomizeButton.addEventListener("click", () => {
    clearTheBoxes(document);
    switchOffAnswer(document, noteOne, noteTwo);
    toggleButtons("enable");
    changeButtonColor(colorOne);
    guiElements.inputField.disabled = false;
    [noteOne, noteTwo] = initNotes(jamBuddy);
  });
}

function submitEventListener(guiElements) {
  guiElements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const distance = parseInt(guiElements.inputField.value);

    if (isNaN(distance)) {
      window.alert("Input can't be empty");
      return;
    }

    guiElements.inputField.value = "";

    switchOffAnswer(document, noteOne, noteTwo);
    switchOffStreakMessage();

    if (jamBuddy.checkAnswer(distance)) {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 },
      });

      displayAnswerMessage("correct");
      showAnswer(document, noteOne, noteTwo);
      streakCounter++;
      toggleButtons("disable");
      changeButtonColor(colorTwo);
      guiElements.inputField.disabled = true;
    } else {
      displayAnswerMessage("incorrect");
      streakCounter = 0;
    }
    delayCode(streakCounter);
  });
}

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

function showAnswer(document) {
  let noteOne;
  let noteTwo;
  [noteOne, noteTwo] = jamBuddy.getCurrentNotes();

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
  }, 900);
}

module.exports = {
  restartEventListener,
  giveUpEventListener,
  randomizeEventListener,
  submitEventListener,
  jamBuddy,
};
