const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const exp = require("constants");
const { prototype } = require("events");
const confetti = {
  default: jasmine.createSpy(),
};

describe("script", function () {
  let dom;
  let document;
  let window;
  let guiElements;
  let noteOne, noteTwo;

  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf-8"
  );
  dom = new JSDOM(html, { runScripts: "dangerously" });

  document = dom.window.document;
  window = dom.window;

  global.window = window;
  global.document = document;
  global.confetti = jasmine.createSpy("confetti");

  const {
    restartEventListener,
    giveUpEventListener,
    randomizeEventListener,
    submitEventListener,
    jamBuddy,
  } = require("../src/script");

  beforeEach(function () {
    guiElements = {
      form: document.getElementById("distance-input-form"),
      streakElement: document.getElementById("streak"),
      streakNumberElement: document.getElementById("streak-number"),
      inputField: document.getElementById("input-field"),
      restartButton: document.getElementById("restart-btn"),
      giveUpButton: document.getElementById("give-up-btn"),
      randomizeButton: document.querySelector("#randomize-btn"),
      submitButton: document.getElementById("submit-btn"),
      correctMessage: document.getElementById("correctMessage"),
      incorrectMessage: document.getElementById("incorrectMessage"),
      explanation: document.querySelector("#explanation"),
      answerText: document.querySelector("#answer-text"),
      mainCounter: document.querySelector("#main-counter"),
      clockwiseAnswer: document.querySelector("#clockwise-answer"),
      antiClockwiseAnswer: document.querySelector("#anti-clockwise-answer"),
      firstNote: document.querySelector("#a0"),
      secondNote: document.querySelector("#a5"),
    };

    const mockWindow = {
      location: {
        reload: jasmine.createSpy(),
      },
      alert: jasmine.createSpy(),
    };

    global.window = mockWindow;
    window.alert = jasmine.createSpy();
  });

  describe("Event Listeners:", function () {
    describe("restartEventListener", function () {
      it("should trigger the reload function.", function () {
        const mockWindow = {
          location: {
            reload: jasmine.createSpy(),
          },
          alert: jasmine.createSpy(),
        };

        global.window = mockWindow;

        restartEventListener(guiElements);
        guiElements.restartButton.click();
        expect(mockWindow.location.reload).toHaveBeenCalled();
      });
    });

    describe("giveUpEventListener", function () {
      beforeEach(function(){
        giveUpEventListener(guiElements);
        guiElements.inputField.disabled = false;
        guiElements.giveUpButton.disabled = false;
        guiElements.submitButton.disabled = false;
      });

      it("should disable input field when triggered", function () {
        guiElements.giveUpButton.click();
        expect(guiElements.inputField.disabled).toBe(true);
        
      });

      it("should disable give up button when triggered", function () {
        guiElements.giveUpButton.click();
        expect(guiElements.giveUpButton.disabled).toBe(true);
      });

      it("should disable submit button when triggered", function () {
        guiElements.giveUpButton.click();
        expect(guiElements.submitButton.disabled).toBe(true);
      });
    });

    describe("randomizeEventListener", function () {
      beforeEach(function (){
        randomizeEventListener(guiElements);
      });

      it("should randomize event listener", function () {
        guiElements.randomizeButton.click();
        expect(guiElements.inputField.disabled).toBe(false);
      });
    });

    describe("submitEventListener", function () {
      
      it("should  trigger the alert when the the is a submit of an empty field", function () {
        const mockWindow = {
          location: {
            reload: jasmine.createSpy(),
          },
          alert: jasmine.createSpy(),
        };

        global.window = mockWindow;

        guiElements.inputField.disabled = false;
        guiElements.submitButton.disabled = false;
        guiElements.inputField.value = "";
        submitEventListener(guiElements);

        guiElements.submitButton.click();

        expect(mockWindow.alert).toHaveBeenCalledWith("Input can't be empty");
      });

      it("should submit event listener with valid input", function () {
        
        jamBuddy.setCurrentNotes(["A", "D"]);
        guiElements.explanation.style.display = "none";
        guiElements.streakElement.style.display = "block";
        guiElements.inputField.disabled = false;
        guiElements.submitButton.disabled = false;
        guiElements.giveUpButton.disabled = false;
        guiElements.answerText.style.display = "block";
        guiElements.inputField.value = "5";

        guiElements.submitButton.click();

        expect(guiElements.explanation.style.display).toBe("block");
        expect(guiElements.streakElement.style.display).toBe("none");
        expect(guiElements.inputField.disabled).toBe(true);
        expect(guiElements.answerText.style.display).toBe("none");
        expect(guiElements.firstNote.style.backgroundColor).toBe("red");
        expect(guiElements.secondNote.style.backgroundColor).toBe("yellow");
        expect(guiElements.submitButton.disabled).toBe(true);
        expect(guiElements.giveUpButton.disabled).toBe(true);
      });

      it("should handle incorrect answer on submit", function () {
        submitEventListener(guiElements);
        guiElements.inputField.value = "3";

        guiElements.submitButton.click();
        setTimeout(() => {
          expect(guiElements.streakNumberElement.innerText).toBe("0");
        }, 700);
      });
    });
  });
});
