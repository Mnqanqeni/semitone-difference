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
