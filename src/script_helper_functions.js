// helpers.js
const { JamBuddy } = require("./jam_buddy");
function initNotes(jamBuddy, document) {
    jamBuddy.randomizeCurrentNotes();
    const [noteOne, noteTwo] = jamBuddy.getCurrentNotes();
    document.querySelector("#first-note").innerText = noteOne;
    document.querySelector("#second-note").innerText = noteTwo;
    return [noteOne, noteTwo];
}

function reloadPage(window) {
    window.location.reload();
}

function disableSubmitAndGiveUpButton(document) {
    document.getElementById("submit-btn").disabled = true;
    document.getElementById("give-up-btn").disabled = true;
}

function enableSubmitAndGiveUpButton(document) {
    document.getElementById("submit-btn").disabled = false;
    document.getElementById("give-up-btn").disabled = false;
}
function lowerColorButton(document, colorTwo) {
    document.querySelector("#submit-btn").style.backgroundColor = colorTwo;
    document.querySelector("#give-up-btn").style.backgroundColor = colorTwo;
}

function putColorButtonToNormal(document, colorOne) {
    document.querySelector("#submit-btn").style.backgroundColor = colorOne;
    document.querySelector("#give-up-btn").style.backgroundColor = colorOne;
}
function showCorrectMessage(document) {
    document.getElementById("correctMessage").style.display = "block";
}

function showStreakMessage(document, streakCounter) {
    const streakElement = document.getElementById("streak");
    const streakNumberElement = document.getElementById("streak-number");
    streakNumberElement.innerText = streakCounter;
    streakElement.style.display = "block";
}

function switchOffStreakMessage(document) {
    document.getElementById("streak").style.display = "none";
}

function showIncorrectMessage(document) {
    document.getElementById("incorrectMessage").style.display = "block";
}

function switchMessageOff(document) {
    document.getElementById("correctMessage").style.display = "none";
    document.getElementById("incorrectMessage").style.display = "none";
}

function delayCode(document, streakCounter) {
    setTimeout(() => {
        switchMessageOff(document);
        showStreakMessage(document, streakCounter);
    }, 600);
}

function switchOffAnswer(document, noteOne, noteTwo) {
    document.querySelector("#explanation").style.display = "none";
    document.querySelector(`#a${JamBuddy.musicalElements[noteOne]}`).style.backgroundColor = "#ccc";
    document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`).style.backgroundColor = "#ccc";
}

function clearTheBoxes(document) {
    const arrayObject = [1, 4, 6, 9];
    for (let i = 0; i < 12; i++) {
        if (arrayObject.includes(i)) {
            document.querySelector(`#a${i}a0`).style.backgroundColor = "#ccc";
            document.querySelector(`#a${i}a1`).style.backgroundColor = "#ccc";
        }else{
            document.querySelector(`#a${i}`).style.backgroundColor = "#ccc";
        }
    }
}

function showAnswer(document, noteOne, noteTwo) {
    const arrayObject = [1, 4, 6, 9];
    const index1 = JamBuddy.musicalElements[noteOne];
    const index2 = JamBuddy.musicalElements[noteTwo];

    document.querySelector("#explanation").style.display = "block";
    document.querySelector("#answer-text").style.display = "none";
    document.querySelector(`#a${index1}${arrayObject.includes(index1) ? `a${noteOne.includes("#") ? "0" : "1"}` : ""}`).style.backgroundColor = "red";
    document.querySelector(`#a${index2}${arrayObject.includes(index2) ? `a${noteTwo.includes("#") ? "0" : "1"}` : ""}`).style.backgroundColor = "yellow";
}

function doTheExplanation(document, noteOne, noteTwo, streakCounter) {
    showStreakMessage(document, streakCounter);
    showAnswer(document, noteOne, noteTwo);
    document.querySelector("#answer-text").style.display = "block";

    const one = JamBuddy.musicalElements[noteOne];
    const two = JamBuddy.musicalElements[noteTwo];

    if (one < two) {
        doCount(one, two, document.querySelector("#clockwise-answer"), document, () => {
            doCount(two, one, document.querySelector("#anti-clockwise-answer"), document);
        });
    } else {
        doCount(two, one, document.querySelector("#clockwise-answer"), document, () => {
            doCount(one, two, document.querySelector("#anti-clockwise-answer"), document);
        });
    }
}

function doCount(num1, num2, id, document, callback) {
    let count = 0;
    const totalNotes = 12;

    const intervalId = setInterval(() => {
        if (num1 !== num2) {
            num1 = (num1 + 1) % totalNotes;
            count++;
            id.innerText = count;
            document.querySelector("#main-counter").innerText = count;

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
            document.querySelector("#main-counter").innerText = "";
        }
    }, 600);
}

module.exports = {
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
};
