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
            delayCode();
    });
}


const correctMessage = document.getElementById("correctMessage");
const incorrectMessage = document.getElementById("incorrectMessage");
const streak=document.getElementById("streak");
console.log(streak);
let streakNumber=document.getElementById("streak-number");
console.log(streakNumber);


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

function showIncorrectMessage() {
    incorrectMessage.style.display = "block";
}

function switchMessageOff() {
    correctMessage.style.display = "none";
    incorrectMessage.style.display = "none";
}

function delayCode() {
    setTimeout(function() {
        switchMessageOff();
        showStreakMessage();
    }, 500);
}

[noteOne,noteTwo]=buddy.getCurrentNotes();
console.log(noteOne,noteTwo)
console.log(document.querySelector(`#a${JamBuddy.musicalElements[noteOne]}`));
document.querySelector(`#a${JamBuddy.musicalElements[noteOne]}`).style.backgroundColor="red";
console.log(document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`));
document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`).style.backgroundColor="Yellow";
let one=JamBuddy.musicalElements[noteOne];
let two=JamBuddy.musicalElements[noteTwo];

if (one < two) {
    doCount(one, two, document.querySelector("#clockwise-answer"), true);
    doCount(one, two, document.querySelector("#anti-clockwise-answer"), false);
} else {
    doCount(one, two, document.querySelector("#clockwise-answer"), false);
    doCount(one, two, document.querySelector("#anti-clockwise-answer"), true);
}

function doCount(num1, num2, id, clockwise) {
    let count = 1;
    id.innerText = count;
    while (num1 !== num2) {
        id.innerText = count;
        console.log(count);
        if (clockwise) {
            num1 = (num1 + 1) % 11;
        } else {
            num1 = (num1 - 1) % 11; 
        }
        count++;
    }
    id.innerText = count;
}

},{"./src/jam_buddy":4}],2:[function(require,module,exports){
const {
  errorMessages,
  musicalElementsNotesObject,
} = require("./helper_objects");
const maxDistance = 11;

function validateNotesArray(arrayNotes, musicalElementsArray) {
  if (arrayNotes.length !== 2) {
    throw new Error(errorMessages.notTwoElements);
  } else if (!arrayNotes.every((note) => musicalElementsArray.includes(note))) {
    throw new Error(errorMessages.notesNotValid);
  } else if (arrayNotes[0] === arrayNotes[1]) {
    throw new Error(errorMessages.noteDuplicated);
  } else if (
    musicalElementsNotesObject[arrayNotes[0]] ===
    musicalElementsNotesObject[arrayNotes[1]]
  ) {
    throw new Error(
      errorMessages.inharmonicEquivalentNotesError(arrayNotes[0], arrayNotes[1])
    );
  }
}

function getIndexes(currentNotes) {
  const index1 = musicalElementsNotesObject[currentNotes[0]];
  const index2 = musicalElementsNotesObject[currentNotes[1]];
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

const getRandomNote = (arrayOfAllNotes) =>
  arrayOfAllNotes[Math.floor(Math.random() * arrayOfAllNotes.length)];

module.exports = {
  validateDistance,
  validateNotesArray,
  getIndexes,
  getRandomNote,
};

},{"./helper_objects":3}],3:[function(require,module,exports){
const errorMessages = {
  notTwoElements: "The input must consist of exactly two elements to be valid.",
  notesNotValid:
    "The provided notes are not valid. Please refer to the following array for valid notes: ['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#'].",
  noteDuplicated: "Each note in the input must be unique and not duplicated.",
  distanceOutOfRange:
    "The provided answer is out of range. Please input a value from 1 to 11.",
  negativeDistance:
    "The distance cannot be negative. Please input a non-negative value for the distance.",
  mustBeWholeNumber:
    "The provided number must be a whole number, e.g., 5, not a decimal number like 5.1.",
  onlyDatatypeOfNumber:
    "Only the data type 'number' is valid, e.g., 5, not 'five', '5', or {}.",
  inharmonicEquivalentNotesError: (note1, note2) =>
    `${note1} and ${note2} are inharmonic equivalent notes; there is no semitone between them.`,
};

const musicalElementsNotesObject = {
  "A": 0,
  "A#": 1,
  "Bb": 1,
  "B": 2,
  "C": 3,
  "C#": 4,
  "Db": 4,
  "D": 5,
  "D#": 6,
  "Eb": 6,
  "E": 7,
  "F": 8,
  "F#": 9,
  "Gb": 9,
  "G": 10,
  "G#": 11,
};

module.exports = { errorMessages, musicalElementsNotesObject };

},{}],4:[function(require,module,exports){
const {
  validateDistance,
  validateNotesArray,
  getIndexes,
  getRandomNote,
} = require("./helper_functions");
const { musicalElementsNotesObject } = require("./helper_objects");

class JamBuddy {
  static #musicalElements = musicalElementsNotesObject;
  #currentNotes = [];

  static get musicalElements() {
    return this.#musicalElements;
  }

  getCurrentNotes() {
    return this.#currentNotes;
  }

  setCurrentNotes(arrayNotes) {
    validateNotesArray(arrayNotes, Object.keys(JamBuddy.#musicalElements));
    this.#currentNotes = arrayNotes;
  }

  randomizeCurrentNotes() {
    const tempArray = Object.keys(JamBuddy.#musicalElements);
    let firstNote, secondNote;

    do {
      firstNote = getRandomNote(tempArray);
      secondNote = getRandomNote(tempArray);
    } while (
      JamBuddy.#musicalElements[firstNote] ===
      JamBuddy.#musicalElements[secondNote]
    );

    this.setCurrentNotes([firstNote, secondNote]);
  }

  checkAnswer(distance) {
    validateDistance(distance);
    const [index1, index2] = getIndexes(this.getCurrentNotes());
    const totalHarmonicNotes = 12;
    const absDiff = Math.abs(index1 - index2);
    const cyclicDistance = [absDiff, totalHarmonicNotes - absDiff];
    return cyclicDistance.includes(distance);
  }
}

module.exports = { JamBuddy };

},{"./helper_functions":2,"./helper_objects":3}]},{},[1]);
