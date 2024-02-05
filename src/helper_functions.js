const crypto = require("crypto");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.randomInt(i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function validateNotesArray(arrayNotes, musicalElementsArray) {
  return (
    arrayNotes.length === 2 &&
    arrayNotes.every((note) => musicalElementsArray.includes(note)) &&
    arrayNotes[0] !== arrayNotes[1]
  );
}

module.exports = { shuffleArray, validateNotesArray };
