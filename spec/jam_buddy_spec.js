const { JamBuddy } = require("../src/jam_buddy");
const {errorMessages} = require("../src/helper_objects")

describe("JamBuddy Class:", () => {
  let buddy;

  describe("getCurrentNotes", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
    });

    it("should return an empty array when no set or random generated notes", () => {
      expect(buddy.getCurrentNotes()).toEqual([]);
    });

    it("should return the current updated notes", () => {
      buddy.currentNotes = ["A", "B"];
      expect(buddy.getCurrentNotes()).toEqual(["A", "B"]);
    });
  });

  describe("setCurrentNotes", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
    });

    it("should set currentNotes to the provided valid array of notes", () => {
      buddy.setCurrentNotes(['A','A#']);
      expect(buddy.getCurrentNotes()).toEqual(['A','A#']);
    });

    it("should throw an error for invalid input when notes doesn't exist.", () => {
      expect(() => buddy.setCurrentNotes(["X", "Y"])).toThrowError(errorMessages.inputError);
    });

    it("should throw an error invalid input for a array of elements not equal two.", () => {
      expect(() => buddy.setCurrentNotes(["A", "B", "C"])).toThrowError(errorMessages.inputError);
    });
    
    it("should throw an error invalid input for an empty array.", () => {
      expect(() => buddy.setCurrentNotes([])).toThrowError(errorMessages.inputError);
    });

  });

  describe("randomizeCurrentNotes", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
    });

    it("should randomize the currentNotes", () => {
      const randomizedNotes = buddy.randomizeCurrentNotes();
    
      expect(randomizedNotes[0]!=randomizedNotes[1]).toBe(true);
    });

    it("should should updete the notes to the current rondom generated notes.", () => {
      const randomizedNotes = buddy.randomizeCurrentNotes();
      expect(buddy.getCurrentNotes()).toEqual(randomizedNotes);
    });
   
  });

  describe("checkAnswer", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
    });

    it("should return false for distance  an incorrect distance", () => {
      buddy.setCurrentNotes(["C", "D#"]);
      expect(buddy.checkAnswer(1)).toBe(false);
    });

    it("should return true for a correnct forward distance.", () => {
      buddy.setCurrentNotes(["C", "D#"]);
      expect(buddy.checkAnswer(3)).toBe(true);
    });

    it("should return true for a correct reverse cyclic distance.", () => {
      buddy.setCurrentNotes(["C", "D#"]);
      expect(buddy.checkAnswer(9)).toBe(true);
    });

    it("should return false when no note ranodomly generated or set", () => {
      expect(buddy.checkAnswer(1)).toBe(false);
    });
  });

});
