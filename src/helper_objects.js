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
