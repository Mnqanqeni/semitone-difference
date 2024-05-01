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
