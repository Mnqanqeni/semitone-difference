import { errorMessages,musicalElementsNotesObject } from "./helper_objects.js";
const maxDistance = 11;

export function validateNotesArray(arrayNotes, musicalElementsArray) {
  if (arrayNotes.length !== 2) throw new Error(errorMessages.notTwoElements);

  if (!arrayNotes.every((note) => musicalElementsArray.includes(note)))
    throw new Error(errorMessages.notesNotValid);

  if (arrayNotes[0] === arrayNotes[1])
    throw new Error(errorMessages.noteDuplicated);

  if (
    musicalElementsNotesObject[arrayNotes[0]] ===
    musicalElementsNotesObject[arrayNotes[1]]
  ) {
    throw new Error(
      errorMessages.inharmonicEquivalentNotesError(arrayNotes[0], arrayNotes[1])
    );
  }
}

export function validateDistance(distance) {
  if (typeof distance !== "number")
    throw new Error(errorMessages.onlyDatatypeOfNumber);

  if (!Number.isInteger(distance))
    throw new Error(errorMessages.mustBeWholeNumber);

  if (distance > maxDistance || distance === 0)
    throw new Error(errorMessages.distanceOutOfRange);

  if (distance < 0) throw new Error(errorMessages.negativeDistance);
}

