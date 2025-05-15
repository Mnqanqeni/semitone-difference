import { JamBuddy } from "../src/jam_buddy.js";
import { errorMessages } from "../src/helper_objects.js";

describe("JamBuddy Class:", () => {
  let buddy;

  beforeEach(() => {
    buddy = new JamBuddy();
    buddy.setCurrentNotes(["C", "D#"]);
  });

  describe("getCurrentNotes", () => {
    it("should return the initially set array ['C', 'D#'].", () => {
      expect(buddy.getCurrentNotes()).toEqual(["C", "D#"]);
    });

    it("should return the currently updated notes when notes have been modified.", () => {
      buddy.setCurrentNotes(["A", "B"]);
      expect(buddy.getCurrentNotes()).toEqual(["A", "B"]);
    });
  });

  describe("setCurrentNotes", () => {
    it("should throw an error when non-existent notes are passed.", () => {
      expect(() => buddy.setCurrentNotes(["X", "Y"])).toThrowError(
        errorMessages.notesNotValid
      );
    });

    it("should throw an error when duplicate notes are passed.", () => {
      expect(() => buddy.setCurrentNotes(["A", "A"])).toThrowError(
        errorMessages.noteDuplicated
      );
    });

    it("should throw an error when an array with elements other than two is passed.", () => {
      expect(() => buddy.setCurrentNotes(["A", "B", "C"])).toThrowError(
        errorMessages.notTwoElements
      );
    });

    it("should throw an error when notes are harmonic equivalents.", () => {
      expect(() => buddy.setCurrentNotes(["F#", "Gb"])).toThrowError(
        errorMessages.inharmonicEquivalentNotesError("F#", "Gb")
      );
      expect(() => buddy.setCurrentNotes(["C#", "Db"])).toThrowError(
        errorMessages.inharmonicEquivalentNotesError("C#", "Db")
      );
    });

    it("should throw an error when an empty array is passed.", () => {
      expect(() => buddy.setCurrentNotes([])).toThrowError(
        errorMessages.notTwoElements
      );
    });
  });

  describe("randomizeCurrentNotes", () => {

    it("should return notes with no duplicates when called.", () => {
      buddy.randomizeCurrentNotes();
      const randomizedNotes = buddy.getCurrentNotes();
      expect(randomizedNotes[0]).not.toBe(randomizedNotes[1]);
    });

    it("should not select inharmonic equivalent notes when randomizing current notes", () => {
      buddy.randomizeCurrentNotes();

      const [firstNote, secondNote] = buddy.getCurrentNotes();
      const isHarmonicEquivalent =
        JamBuddy.musicalElements[firstNote] ===
        JamBuddy.musicalElements[secondNote];

      expect(isHarmonicEquivalent).toBe(false);
    });
  });

  describe("checkAnswer", () => {
    it("should return false when an incorrect distance is passed.", () => {
      expect(buddy.checkAnswer(1)).toBe(false);
    });

    it("should return true when a correct forward distance is passed.", () => {
      expect(buddy.checkAnswer(3)).toBe(true);
    });

    it("should return true when a correct reverse cyclic distance is passed.", () => {
      expect(buddy.checkAnswer(9)).toBe(true);
    });

    it("should return true when the correct answers are passed, where valid set notes are set.", () => {
      buddy.setCurrentNotes(["C", "D#"]);
      expect(buddy.checkAnswer(3)).toBe(true);
      expect(buddy.checkAnswer(9)).toBe(true);
    });

    it("should return false when incorrect answers are passed, where valid note set are set.", () => {
      buddy.setCurrentNotes(["C", "D#"]);
      expect(buddy.checkAnswer(1)).toBe(false);
      expect(buddy.checkAnswer(5)).toBe(false);
    });

    it("should return true when correct answers are passed, where sharp notes are set.", () => {
      buddy.setCurrentNotes(["A", "A#"]);
      expect(buddy.checkAnswer(1)).toBe(true);
      expect(buddy.checkAnswer(11)).toBe(true);
    });

    it("should return true when correct answers are passed, where flat notes are set.", () => {
      buddy.setCurrentNotes(["A", "Bb"]);
      expect(buddy.checkAnswer(1)).toBe(true);
      expect(buddy.checkAnswer(11)).toBe(true);
    });

    it("should return false when incorrect answers are passed, where sharp notes are set.", () => {
      buddy.setCurrentNotes(["A", "A#"]);
      expect(buddy.checkAnswer(9)).toBe(false);
      expect(buddy.checkAnswer(5)).toBe(false);
    });

    it("should return false when incorrect answers are passed, where flat notes are set.", () => {
      buddy.setCurrentNotes(["A", "Bb"]);
      expect(buddy.checkAnswer(9)).toBe(false);
      expect(buddy.checkAnswer(5)).toBe(false);
    });

    it("should throw an error when the distance is out of range.", () => {
      expect(() => buddy.checkAnswer(12)).toThrowError(
        errorMessages.distanceOutOfRange
      );
    });

    it("should throw an error when a negative distance is passed.", () => {
      expect(() => buddy.checkAnswer(-1)).toThrowError(
        errorMessages.negativeDistance
      );
    });

    it("should throw an error when a non-whole number distance is passed.", () => {
      expect(() => buddy.checkAnswer(5.4)).toThrowError(
        errorMessages.mustBeWholeNumber
      );
    });

    it("should throw an error when a data type other than 'number' is passed.", () => {
      expect(() => buddy.checkAnswer("two")).toThrowError(
        errorMessages.onlyDatatypeOfNumber
      );
    });
  });
});
