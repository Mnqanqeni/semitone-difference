(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { JamBuddy } = require("./src/jam_buddy");
const buddy = new JamBuddy();
let streaks =0;

buddy.randomizeCurrentNotes();
let [noteOne,noteTwo]=buddy.getCurrentNotes();
let firstNote=document.querySelector("#first-note");
let secondNote=document.querySelector("#second-note");
let randomBtn=document.querySelector("#randomize-btn");

firstNote.innerText=noteOne;
secondNote.innerText=noteTwo;

randomBtn.addEventListener("click",()=>{
    buddy.randomizeCurrentNotes()
    let [noteOne,noteTwo]=buddy.getCurrentNotes();
    firstNote.innerText=noteOne;
    secondNote.innerText=noteTwo;

})


const distanceBlock = document.querySelector('#distance-btn');
console.log(distanceBlock);
const distanceButtons = distanceBlock.children;
console.log(distanceButtons);
for (let i = 0; i < distanceButtons.length; i++) {
    distanceButtons[i].addEventListener('click', function() {
            switchOffStreakMessage();
            if(buddy.checkAnswer(i+1)){
                showCorrectMessage();
                buddy.randomizeCurrentNotes()
                let [noteOne,noteTwo]=buddy.getCurrentNotes();
                firstNote.innerText=noteOne;
                secondNote.innerText=noteTwo;
                streaks+=1;
            }else{
                showIncorrectMessage();
                streaks=0;
            }
            delayedCode();
            showStreakMessage();
    });
}


// Get references to the message div
const correctMessage = document.getElementById("correctMessage");
const incorrectMessage = document.getElementById("incorrectMessage");
const streak=document.getElementById("streak");
console.log(streak);
let streakNumber=document.getElementById("streak-number");
console.log(streakNumber);
// Function to show correct message
function showCorrectMessage() {
    correctMessage.style.display = "block";

}
function showStreakMessage(){
    streakNumber.innerText=streaks;
    streak.style.display="block";
}
function switchOffStreakMessage(){
    streak.style.display="none";
}
// Function to show incorrect message
function showIncorrectMessage() {
    incorrectMessage.style.display = "block";
}

function switchMessageOff() {
    correctMessage.style.display = "none";
    incorrectMessage.style.display = "none";
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
async function delayedCode() {
    await delay(2000);
}

let canvas = document.querySelector("canvas");
canvas.width = 1000;
canvas.height = 100;
let ctx = canvas.getContext("2d");

let canvasX = 50; // Starting X position
let canvasY = canvas.height / 2;
ctx.font = "20px Arial";
ctx.fillStyle = "blue";

// Define the starting and ending semitones
let startSemitone = 1; // Start at A#
let endSemitone = 10; // End at G#

// Array of note names
let noteNames = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G","G#"];

// Draw note names
for (let i = 0; i <=11; i++) {
    ctx.fillText(noteNames[i], canvasX - 20, canvasY + 20);
    canvasX += 80;
}

// Draw circles
canvasX = 60; // Reset X position
for (let i = 0; i <= 11; i++) {
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 40, 0, Math.PI,true);
    canvasX += 76;
    ctx.strokeStyle = "gold";
    ctx.stroke();
}

},{"./src/jam_buddy":4}],2:[function(require,module,exports){
const { errorMessages } = require("./helper_objects");
const maxDistance = 11;

function validateNotesArray(arrayNotes, musicalElementsArray) {
  if (arrayNotes.length !== 2) {
    throw new Error(errorMessages.notTwoElements);
  } else if (!arrayNotes.every((note) => musicalElementsArray.includes(note))) {
    throw new Error(errorMessages.notesNotValid);
  } else if (arrayNotes[0] === arrayNotes[1]) {
    throw new Error(errorMessages.noteDuplicated);
  }
}

function getIndexes(musicalElements, currentNotes) {
  const index1 = musicalElements.indexOf(currentNotes[0]);
  const index2 = musicalElements.indexOf(currentNotes[1]);
  return [index1, index2];
}

function validateDistance(distance) {
  if (typeof distance !== "number") {
    throw new Error(errorMessages.onlyDatatypeOfNumber);
  } else if (!Number.isInteger(distance)) {
    throw new Error(errorMessages.mustBeWholeNumber);
  } else if (distance > maxDistance || distance === 0) {
    throw new Error(errorMessages.distanceOutOfRange);
  } else if (distance < 0) {
    throw new Error(errorMessages.negativeDistance);
  }
}

module.exports = { validateDistance, validateNotesArray, getIndexes };

},{"./helper_objects":3}],3:[function(require,module,exports){
const errorMessages = {
  notTwoElements: "The input must consist of exactly two elements to be valid.",
  notesNotValid:
    "The provided notes are not valid. Please refer to the following array for valid notes: [A, A#, B, C, C#, D, D#, E, F, F#, G, G#].",
  noteDuplicated: "Each note in the input must be unique and not duplicated.",
  distanceOutOfRange:
    "The provided answer is out of range. Please input a value from 1 to 11.",
  negativeDistance:
    "The distance cannot be negative. Please input a non-negative value for the distance.",
  mustBeWholeNumber:
    "The provided number must be a whole number, e.g., 5, not a decimal number like 5.1.",
  onlyDatatypeOfNumber:
    "Only the data type 'number' is valid, e.g., 5, not 'five', '5', or {}.",
};

module.exports = { errorMessages };

},{}],4:[function(require,module,exports){
const {
  validateDistance,
  validateNotesArray,
  getIndexes,
} = require("./helper_functions");

class JamBuddy {
  static #musicalElements = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
  ];

  #currentNotes = [];

  static get musicalElements() {
    return this.#musicalElements;
  }

  randomizeCurrentNotes() {
    let tempArray = [...JamBuddy.#musicalElements];

    const firstNoteIndex = Math.floor(Math.random() * tempArray.length);
    const firstNote = tempArray[firstNoteIndex];
    tempArray = tempArray
      .slice(0, firstNoteIndex)
      .concat(tempArray.slice(firstNoteIndex + 1));

    const secondNoteIndex = Math.floor(Math.random() * tempArray.length);
    const secondNote = tempArray[secondNoteIndex];

    this.setCurrentNotes([firstNote, secondNote]);
  }

  getCurrentNotes() {
    return this.#currentNotes;
  }

  setCurrentNotes(arrayNotes) {
    validateNotesArray(arrayNotes, JamBuddy.#musicalElements);
    this.#currentNotes = arrayNotes;
  }

  checkAnswer(distance) {
    validateDistance(distance);
    const [index1, index2] = getIndexes(
      JamBuddy.#musicalElements,
      this.getCurrentNotes()
    );

    if (index1 === -1 || index2 === -1) {
      return false;
    }

    const absDiff = Math.abs(index1 - index2);
    const cyclicDistance = [
      absDiff,
      JamBuddy.#musicalElements.length - absDiff,
    ];
    return cyclicDistance.includes(distance);
  }
}

module.exports = { JamBuddy };

},{"./helper_functions":2}]},{},[1]);
