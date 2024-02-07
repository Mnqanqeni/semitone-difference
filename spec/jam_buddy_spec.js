const { JamBuddy } = require("../src/jam_buddy");
const { errorMessages } = require("../src/helper_objects");

describe("JamBuddy Class:", () => {
  let buddy;

  describe("getCurrentNotes", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
    });

    it("should return an empty array.", () => {
      expect(buddy.getCurrentNotes()).toEqual([]);
    });

    it("should return the currently updated notes when notes have been updated.", () => {
      buddy.setCurrentNotes(["A", "B"]);
      expect(buddy.getCurrentNotes()).toEqual(["A", "B"]);
    });
  });

  describe("setCurrentNotes", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
      buddy.setCurrentNotes(["C", "D#"]);
    });

    it("should throw an error 'invalid input' when notes passed do not exist.", () => {
      expect(() => buddy.setCurrentNotes(["X", "Y"])).toThrowError(
        errorMessages.inputError
      );
    });

    it("should throw an error 'invalid input' when an array of elements not equal to two is passed.", () => {
      expect(() => buddy.setCurrentNotes(["A", "B", "C"])).toThrowError(
        errorMessages.inputError
      );
    });

    it("should throw an error 'invalid input' when an empty array is passed.", () => {
      expect(() => buddy.setCurrentNotes([])).toThrowError(
        errorMessages.inputError
      );
    });
  });

  describe("randomizeCurrentNotes", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
      buddy.setCurrentNotes(["C", "D#"]);
    });

    it("should return randomized notes when called.", () => { 
      const previousNotes = buddy.getCurrentNotes();
      buddy.randomizeCurrentNotes();
      const randomizedNotes = buddy.getCurrentNotes();

      expect(previousNotes).not.toEqual(randomizedNotes);
    });

    it("should return notes with no duplicates when called.", () => {
      buddy.randomizeCurrentNotes();
      const randomizedNotes = buddy.getCurrentNotes();
      expect(randomizedNotes[0]).not.toBe(randomizedNotes[1]);
    });
  });

  describe("checkAnswer", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
      buddy.setCurrentNotes(["C", "D#"]);
    });

    it("should return false when an incorrect distance is passed.", () => {
      expect(buddy.checkAnswer(1)).toBe(false);
    });

    it("should return true when a correct forward distance is passed.", () => {
      expect(buddy.checkAnswer(3)).toBe(true);
    });

    it("should return true when a correct reverse cyclic distance is passed.", () => {
      expect(buddy.checkAnswer(9)).toBe(true);
    });

    it("should return false when no note is randomly generated or set.", () => {
      expect(buddy.checkAnswer(1)).toBe(false);
    });
  });
});
