const { errorMessages } = require("./helper_objects");

function validateNotesArray(arrayNotes, musicalElementsArray) {
  if(arrayNotes.length !== 2){
    throw new Error(errorMessages.notTwoElements);
  }else if(!arrayNotes.every((note) => musicalElementsArray.includes(note))){
    throw new Error(errorMessages.notesNotValid);
  }else if(arrayNotes[0] === arrayNotes[1]){
    throw new Error(errorMessages.noteDuplicated);
  }
}

function validateDistance(){
  if(distance>11){
    throw new Error(errorMessages.distanceOutOfRange)
  }else if(distance<0){
    throw new Error(errorMessages.negativeDistance)
  }
}
module.exports = { validateDistance,validateNotesArray };
