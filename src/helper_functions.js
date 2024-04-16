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

module.exports = { validateDistance, validateNotesArray, getIndexes };
