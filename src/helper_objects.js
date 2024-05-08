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
