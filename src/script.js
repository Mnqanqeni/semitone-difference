const { JamBuddy } = require("./jam_buddy");
const confetti = require("canvas-confetti");

const jamBuddy = new JamBuddy();
let streakCounter = 0;
let noteOne, noteTwo;
const streakElement = document.getElementById("streak");
const streakNumberElement = document.getElementById("streak-number");

const inputField = document.getElementById("input-field");
const form = document.getElementById("distance-input-form");
let colorOne="#007bff"
let colorTwo="#7da2ca";

initNotes(document);

function initNotes(document) {
    jamBuddy.randomizeCurrentNotes();
    [noteOne, noteTwo] = jamBuddy.getCurrentNotes();
    document.querySelector("#first-note").innerText = noteOne;
    document.querySelector("#second-note").innerText = noteTwo;
}

initNotes(document);

function reloadPage(window) {
    window.location.reload();
}

document.getElementById("restart-btn").addEventListener("click", function () {
    reloadPage(window);
});

document.getElementById("give-up-btn").addEventListener("click", function () {
    disableSubmitAndGiveUpButton();
        document.querySelector("#submit-btn").style.backgroundColor = colorTwo;
        document.querySelector("#give-up-btn").style.backgroundColor = colorTwo;
        document.getElementById("input-field").disabled=true;
    clearTheBoxes();
    doTheExplanation(noteOne, noteTwo);
});

document.querySelector("#randomize-btn").addEventListener("click", () => {
    clearTheBoxes();
    switchOffAnswer();
    ableSubmitAndGiveUpButton();
        document.querySelector("#submit-btn").style.backgroundColor = colorOne;
        document.querySelector("#give-up-btn").style.backgroundColor = colorOne;
        document.getElementById("input-field").disabled=false;
        
    initNotes(document);
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const distance = parseInt(inputField.value);
    if (isNaN(distance)) {
        alert("Input can't be empty");
        return;
    }

    inputField.value = "";
    switchOffAnswer();
    switchOffStreakMessage();

    if (jamBuddy.checkAnswer(distance)) {
        confetti({
            particleCount: 100,
            spread: 160,
            origin: { y: 0.6 },
        });
        showCorrectMessage();
        showAnswer(noteOne, noteTwo);
        streakCounter++;
        document.querySelector("#submit-btn").disabled = true;
        document.querySelector("#give-up-btn").disabled = true;
        document.querySelector("#submit-btn").style.backgroundColor = colorTwo;
        document.querySelector("#give-up-btn").style.backgroundColor = colorTwo;
        document.getElementById("input-field").disabled=true;
    } else {
        showIncorrectMessage();
        streakCounter = 0;
    }
    delayCode();
});

function showCorrectMessage() {
    document.getElementById("correctMessage").style.display = "block";
}

function showStreakMessage() {
    streakNumberElement.innerText = streakCounter;
    streakElement.style.display = "block";
}

function switchOffStreakMessage() {
    streakElement.style.display = "none";
}

function showIncorrectMessage() {
    document.getElementById("incorrectMessage").style.display = "block";
}

function switchMessageOff() {
    document.getElementById("correctMessage").style.display = "none";
    document.getElementById("incorrectMessage").style.display = "none";
}

function disableSubmitAndGiveUpButton() {
    document.getElementById("submit-btn").disabled = true;
    document.getElementById("give-up-btn").disabled = true;
}

function ableSubmitAndGiveUpButton() {
    document.getElementById("submit-btn").disabled = false;
    document.getElementById("give-up-btn").disabled = false;
}

function delayCode() {
    setTimeout(function () {
        switchMessageOff();
        showStreakMessage();
    }, 600);
}

function switchOffAnswer() {
    document.querySelector("#explanation").style.display = "none";
    document.querySelector(`#a${JamBuddy.musicalElements[noteOne]}`).style.backgroundColor = "#ccc";
    document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`).style.backgroundColor = "#ccc";
}

function clearTheBoxes() {
    for (let i = 0; i < 12; i++) {
        document.querySelector(`#a${i}`).style.backgroundColor = "#ccc";
    }
}

function showAnswer(noteOne, noteTwo) {
    document.querySelector("#explanation").style.display = "block";
    document.querySelector("#answer-text").style.display = "none";
    document.querySelector(`#a${JamBuddy.musicalElements[noteOne]}`).style.backgroundColor = "red";
    document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`).style.backgroundColor = "yellow";
}

function doTheExplanation(noteOne, noteTwo) {
    streakCounter = 0;
    showStreakMessage();
    showAnswer(noteOne, noteTwo);
    document.querySelector("#answer-text").style.display = "block";
    const one = JamBuddy.musicalElements[noteOne];
    const two = JamBuddy.musicalElements[noteTwo];

    if (one < two) {
        doCount(one, two, document.querySelector("#clockwise-answer"), function () {
            doCount(two, one, document.querySelector("#anti-clockwise-answer"));
        });
    } else {
        doCount(two, one, document.querySelector("#clockwise-answer"), function () {
            doCount(one, two, document.querySelector("#anti-clockwise-answer"));
        });
    }
}

function doCount(num1, num2, id, callback) {
    let count = 0;
    const totalNotes = 12;

    const intervalId = setInterval(() => {
        let store;
        if (num1 !== num2) {
            num1 = (num1 + 1) % totalNotes;
            count++;
            id.innerText = count;
            document.querySelector("#main-counter").innerText = count;

            const element = document.querySelector(`#a${num1}`);
            store = element.style.backgroundColor;
            element.style.backgroundColor = "blue";
            setTimeout(() => {
                element.style.backgroundColor = store;
            }, 600);
        } else {
            clearInterval(intervalId);
            if (typeof callback === "function") {
                callback();
            }
            document.querySelector("#main-counter").innerText = "";
        }
    }, 600);
}

module.exports = {
    initNotes,
    reloadPage,
    showCorrectMessage,
    showStreakMessage,
    switchOffStreakMessage,
    showIncorrectMessage,
    switchMessageOff,
    disableSubmitAndGiveUpButton,
    ableSubmitAndGiveUpButton,
    delayCode,
    switchOffAnswer,
    clearTheBoxes,
    showAnswer,
    doTheExplanation,
    doCount,
};
