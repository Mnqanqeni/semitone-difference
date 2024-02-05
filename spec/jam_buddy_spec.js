const { JamBuddy } = require("../src/jam_buddy");
const { errorMessages } = require("../src/helper_objects");

describe("JamBuddy Class:", () => {
  let buddy;

  describe("getCurrentNotes", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
    });

    it("should return an empty array when no set or randomly generated notes.", () => {
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
    });

    it("should update the notes when called with valid arguments.", () => {
      buddy.setCurrentNotes(["A", "A#"]);
      expect(buddy.getCurrentNotes()).toEqual(["A", "A#"]);
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
    });

    it("should return randomized notes when called.", () => {
      buddy.setCurrentNotes(["C", "D#"]);
      const previousNotes = buddy.getCurrentNotes();
      const randomizedNotes = buddy.randomizeCurrentNotes();

      expect(previousNotes).not.toEqual(randomizedNotes);
    });

    it("should return notes with no duplicates when called.", () => {
      const randomizedNotes = buddy.randomizeCurrentNotes();
      expect(randomizedNotes[0]).not.toBe(randomizedNotes[1]);
    });

    it("should update the notes to the currently randomly generated notes when called.", () => {
      const randomizedNotes = buddy.randomizeCurrentNotes();
      expect(buddy.getCurrentNotes()).toEqual(randomizedNotes);
    });
  });

  describe("checkAnswer", () => {
    beforeEach(() => {
      buddy = new JamBuddy();
    });

    it("should return false when an incorrect distance is passed.", () => {
      buddy.setCurrentNotes(["C", "D#"]);
      expect(buddy.checkAnswer(1)).toBe(false);
    });

    it("should return true when a correct forward distance is passed.", () => {
      buddy.setCurrentNotes(["C", "D#"]);
      expect(buddy.checkAnswer(3)).toBe(true);
    });

    it("should return true when a correct reverse cyclic distance is passed.", () => {
      buddy.setCurrentNotes(["C", "D#"]);
      expect(buddy.checkAnswer(9)).toBe(true);
    });

    it("should return false when no note is randomly generated or set.", () => {
      expect(buddy.checkAnswer(1)).toBe(false);
    });
  });
});
