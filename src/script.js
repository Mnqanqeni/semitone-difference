const { JamBuddy } = require("./jam_buddy");
const confetti = require("canvas-confetti");

const guiElements = {
  form: document.getElementById("distance-input-form"),
  inputField: document.getElementById("input-field"),
  randomizeButton: document.querySelector("#randomize-btn"),
  submitButton: document.getElementById("submit-btn"),
  correctMessage: document.getElementById("correctMessage"),
  incorrectMessage: document.getElementById("incorrectMessage"),
  mainCounter: document.querySelector("#main-counter"),
  firstNote: document.querySelector("#first-note"),
  secondNote: document.querySelector("#second-note"),
};

const jamBuddy = new JamBuddy();

let [noteOne, noteTwo] = initNotes(jamBuddy);
document.addEventListener("DOMContentLoaded", () => {
  randomizeEventListener();
  submitEventListener();
});

function randomizeEventListener() {
  guiElements.randomizeButton.addEventListener("click", () => {
    toggleButtons("enable");
    guiElements.correctMessage.style.display = "none";
    guiElements.incorrectMessage.style.display = "none";
    [noteOne, noteTwo] = initNotes(jamBuddy);
  });
}

function submitEventListener() {
  guiElements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    guiElements.incorrectMessage.style.display = "none";
    const distance = parseInt(guiElements.inputField.value);

    if (isNaN(distance)) {
      window.alert("Input can't be empty");
      return;
    }

    guiElements.inputField.value = "";

    if (jamBuddy.checkAnswer(distance)) {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 },
      });
      displayAnswerMessage("correct");
      toggleButtons("disable");
      guiElements.inputField.disabled = true;
    } else {
      setTimeout(() => displayAnswerMessage("incorrect"), 100);
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

function toggleButtons(status) {
  const isDisabled = status === "disable";
  guiElements.submitButton.disabled = isDisabled;
  guiElements.inputField.disabled = isDisabled;
}

function displayAnswerMessage(status) {
  guiElements.correctMessage.style.display =
    status === "correct" ? "block" : "none";
  guiElements.incorrectMessage.style.display =
    status === "incorrect" ? "block" : "none";
}

module.exports = {
  randomizeEventListener,
  submitEventListener,
  jamBuddy,
  guiElements,
};
