const { JamBuddy } = require("./jam_buddy");
const confetti = require("canvas-confetti");
const {
  initNotes,
  reloadPage,
  toggleButtons,
  changeButtonColor,
  displayAnswerMessage,
  showStreakMessage,
  switchOffStreakMessage,
  delayCode,
  switchOffAnswer,
  clearTheBoxes,
  showAnswer,
  doTheExplanation,
  guiElements,
} = require("./script_helper_functions");

const jamBuddy = new JamBuddy();
let streakCounter = 0;
let noteOne, noteTwo;

const colorOne = "#007bff";
const colorTwo = "#7da2ca";

[noteOne, noteTwo] = initNotes(jamBuddy);

guiElements.restartButton.addEventListener("click", () => reloadPage(window));

guiElements.giveUpButton.addEventListener("click", () => {
  toggleButtons("disable");
  changeButtonColor(colorTwo);
  guiElements.inputField.disabled = true;
  clearTheBoxes(document);
  doTheExplanation(document, noteOne, noteTwo, streakCounter);
  streakCounter = 0;
  showStreakMessage(streakCounter);
});

guiElements.randomizeButton.addEventListener("click", () => {
  clearTheBoxes(document);
  switchOffAnswer(document, noteOne, noteTwo);
  toggleButtons("enable");
  changeButtonColor(colorOne);
  guiElements.inputField.disabled = false;
  [noteOne, noteTwo] = initNotes(jamBuddy);
});

guiElements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const distance = parseInt(guiElements.inputField.value);
  if (isNaN(distance)) {
    alert("Input can't be empty");
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
