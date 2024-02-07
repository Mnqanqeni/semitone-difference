const { shuffleArray, validateNotesArray } = require("./helper_functions");
const { errorMessages } = require("./helper_objects");

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
    if (validateNotesArray(arrayNotes, JamBuddy.#musicalElements)) {
      this.#currentNotes = arrayNotes;
    } else {
      throw new Error(errorMessages.inputError);
    }
  }

  checkAnswer(distance) {
    const index1 = JamBuddy.#musicalElements.indexOf(this.getCurrentNotes()[0]);
    const index2 = JamBuddy.#musicalElements.indexOf(this.getCurrentNotes()[1]);

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
