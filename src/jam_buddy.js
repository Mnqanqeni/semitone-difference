const {
  validateDistance,
  validateNotesArray,
  getIndexes,
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
    let tempArray = Object.keys(JamBuddy.#musicalElements);

    let firstNoteIndex = Math.floor(Math.random() * tempArray.length);
    let firstNote = tempArray[firstNoteIndex];

    let secondNoteIndex;
    let secondNote;

    do {
      secondNoteIndex = Math.floor(Math.random() * tempArray.length);
      secondNote = tempArray[secondNoteIndex];
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
