// Importing modules
const { JamBuddy } = require("./src/jam_buddy");
const confetti = require('canvas-confetti');

// Initializing variables
const jamBuddy = new JamBuddy();
let streakCounter = 0;
let noteOne,noteTwo;
const correctMessageElement = document.getElementById("correctMessage");
const incorrectMessageElement = document.getElementById("incorrectMessage");
const streakElement = document.getElementById("streak");
const streakNumberElement = document.getElementById("streak-number");

// Getting DOM elements
const firstNoteElement = document.querySelector("#first-note");
const secondNoteElement = document.querySelector("#second-note");
const restartButton = document.getElementById("restart-btn");
const giveUpButton = document.getElementById("give-up-btn");
const randomizeButton = document.querySelector("#randomize-btn");
const distanceForm = document.getElementById("distance-input-form");
const distanceInputElement = document.getElementById("distance-input");

// initializing the random notes
init();
function init(){
    jamBuddy.randomizeCurrentNotes();
[noteOne, noteTwo] = jamBuddy.getCurrentNotes();
firstNoteElement.innerText = noteOne;
secondNoteElement.innerText = noteTwo;

}

// Event listeners
function reloadPage(window){
    window.location.reload();
}
  
document.getElementById('restart-btn').addEventListener('click', function() {
    reloadPage(window);
  });


giveUpButton.addEventListener("click", function() {
    disableSubmitAndGiveUpButton();
    clearTheBoxes();
    doTheExplanation(noteOne, noteTwo);
    console.log("click");
});
    
randomizeButton.addEventListener("click", () => {
    clearTheBoxes();
    switchOffAnswer()
    ableSubmitAndGiveUpButton();
    document.querySelector("#submit-distance").disabled=false;
    jamBuddy.randomizeCurrentNotes();
    [noteOne, noteTwo] = jamBuddy.getCurrentNotes();
    firstNoteElement.innerText = noteOne;
    secondNoteElement.innerText = noteTwo;
});

distanceForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const distance = parseInt(distanceInputElement.value);
    if (isNaN(distance)) {
        alert("Input can't be empty");
        return;
    }
    
    distanceInputElement.value = "";
    switchOffAnswer();
    switchOffStreakMessage();

    if (jamBuddy.checkAnswer(distance)) {
        confetti({
            particleCount: 100,
            spread: 160,
            origin: { y: 0.6 }
        });
        showCorrectMessage();
        showAnswer(noteOne, noteTwo);
        streakCounter++;
        document.querySelector("#submit-distance").disabled=true;
    } else {
        showIncorrectMessage();
        streakCounter = 0;
    }
    delayCode();
    
});

function showCorrectMessage() {
    correctMessageElement.style.display = "block";
}

function showStreakMessage() {
    streakNumberElement.innerText = streakCounter;
    streakElement.style.display = "block";
}

function switchOffStreakMessage() {
    streakElement.style.display = "none";
}

function showIncorrectMessage() {
    incorrectMessageElement.style.display = "block";
}

function switchMessageOff() {
    correctMessageElement.style.display = "none";
    incorrectMessageElement.style.display = "none";
}

function disableSubmitAndGiveUpButton() {
    document.querySelector("#submit-distance").disabled = true;
    giveUpButton.disabled = true;
}

function ableSubmitAndGiveUpButton() {
    document.querySelector("#submit-distance").disabled = false;
    giveUpButton.disabled = false;
}

function delayCode() {
    setTimeout(function() {
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
    document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`).style.backgroundColor = "Yellow";
}

function doTheExplanation(noteOne, noteTwo) {
    showAnswer(noteOne, noteTwo);
    document.querySelector("#answer-text").style.display = "block";
    const one = JamBuddy.musicalElements[noteOne];
    const two = JamBuddy.musicalElements[noteTwo];

    if (one < two) {
        doCount(one, two, document.querySelector("#clockwise-answer"), function() {
            doCount(two, one, document.querySelector("#anti-clockwise-answer"));
        });
    } else {
        doCount(two, one, document.querySelector("#clockwise-answer"), function() {
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
            if (typeof callback === 'function') {
                callback();
            }
            document.querySelector("#main-counter").innerText = "";
        }
    }, 600);
}

module.exports = {
    init,
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
};
