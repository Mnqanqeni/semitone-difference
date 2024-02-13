const errorMessages = {
  notTwoElements: "The input notes must consist of exactly two elements to be valid.",
  notesNotValid: "The provided notes are not valid. Please refer to the following array for valid notes: [A, A#, B, C, C#, D, D#, E, F, F#, G, G#].",
  noteDuplicated: "Each note in the input must be unique and not duplicated.",
  distanceOutOfRange: "The provided answer is out of range. Please input a value from 1 to 11.",
  negativeDistance: "The distance cannot be negative. Please input a non-negative value for distance."
};

module.exports = { errorMessages };
