const { JamBuddy } = require("./jam_buddy");
const confetti = require("canvas-confetti");
const {
    initNotes,
    reloadPage,
    disableSubmitAndGiveUpButton,
    enableSubmitAndGiveUpButton,
    showCorrectMessage,
    showStreakMessage,
    switchOffStreakMessage,
    showIncorrectMessage,
    switchMessageOff,
    delayCode,
    switchOffAnswer,
    clearTheBoxes,
    showAnswer,
    doTheExplanation,
    doCount,
    lowerColorButton,
    putColorButtonToNormal
} = require("./script_helper_functions");

const jamBuddy = new JamBuddy();
let streakCounter = 0;
let noteOne, noteTwo;
const streakElement = document.getElementById("streak");
const streakNumberElement = document.getElementById("streak-number");

const inputField = document.getElementById("input-field");
const form = document.getElementById("distance-input-form");
let colorOne = "#007bff";
let colorTwo = "#7da2ca";


[noteOne, noteTwo] = initNotes(jamBuddy, document);

document.getElementById("restart-btn").addEventListener("click", () => reloadPage(window));

document.getElementById("give-up-btn").addEventListener("click", () => {
    disableSubmitAndGiveUpButton(document);
    lowerColorButton(document, colorTwo);
    document.getElementById("input-field").disabled = true;
    clearTheBoxes(document);
    doTheExplanation(document, noteOne, noteTwo, streakCounter);
    streakCounter=0;
    showStreakMessage(document, streakCounter);
});

document.querySelector("#randomize-btn").addEventListener("click", () => {
    clearTheBoxes(document);
    switchOffAnswer(document, noteOne, noteTwo);
    enableSubmitAndGiveUpButton(document);
    putColorButtonToNormal(document, colorOne);
    document.getElementById("input-field").disabled = false;
    [noteOne, noteTwo] = initNotes(jamBuddy, document);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const distance = parseInt(inputField.value);
    if (isNaN(distance)) {
        alert("Input can't be empty");
        return;
    }

    inputField.value = "";
    switchOffAnswer(document, noteOne, noteTwo, jamBuddy);
    switchOffStreakMessage(document);

    if (jamBuddy.checkAnswer(distance)) {
        confetti({
            particleCount: 100,
            spread: 160,
            origin: { y: 0.6 },
        });
        showCorrectMessage(document);
        showAnswer(document, noteOne, noteTwo, jamBuddy);
        streakCounter++;
        disableSubmitAndGiveUpButton(document);
        document.querySelector("#submit-btn").style.backgroundColor = colorTwo;
        document.querySelector("#give-up-btn").style.backgroundColor = colorTwo;
        document.getElementById("input-field").disabled = true;
    } else {
        showIncorrectMessage(document);
        streakCounter = 0;
    }
    delayCode(document, streakCounter);
});
