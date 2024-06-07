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

module.exports = { guiElements };
