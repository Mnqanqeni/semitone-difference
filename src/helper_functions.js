function validateNotesArray(arrayNotes, musicalElementsArray) {
  return (
    arrayNotes.length === 2 &&
    arrayNotes.every((note) => musicalElementsArray.includes(note)) &&
    arrayNotes[0] !== arrayNotes[1]
  );
}

module.exports = { validateNotesArray };
