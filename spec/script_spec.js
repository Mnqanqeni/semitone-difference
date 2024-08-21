const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const mockWindow = {
  location: {
    reload: jasmine.createSpy(),
  },
  alert: jasmine.createSpy(),
};

describe("script", function () {
  let dom;
  let document;
  let window;
  let guiElements;

  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf-8"
  );
  dom = new JSDOM(html, { runScripts: "dangerously" });

  document = dom.window.document;
  window = dom.window;

  global.window = window;
  global.document = document;

  const { jamBuddy } = require("../src/script");

  beforeEach(function () {
    guiElements = {
      ...require("../src/script").guiElements,
      firstNote: document.querySelector("#a0"),
      secondNote: document.querySelector("#a5"),
    };

    global.window = mockWindow;
    window.alert = jasmine.createSpy();
  });

  describe("Event Listeners:", function () {
    describe("restartEventListener", function () {
      it("should trigger the reload function.", function () {
        guiElements.restartButton.click();
        expect(mockWindow.location.reload).toHaveBeenCalled();
      });
    });

    describe("giveUpEventListener", function () {
      beforeEach(function () {
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

      it("should restart the streaks when triggered", function () {
        guiElements.inputField.value = "3";
        guiElements.streakNumberElement.innerText = 2;
        guiElements.giveUpButton.click();
        expect(guiElements.streakNumberElement.innerText).toBe(0);
      });
    });

    describe("randomizeEventListener", function () {
      it("should enable input field when triggered", function () {
        guiElements.inputField.disabled = true;
        guiElements.randomizeButton.click();
        expect(guiElements.inputField.disabled).toBe(false);
      });

      it("should hide the answer messages when triggered", function () {
        guiElements.randomizeButton.click();
        expect(guiElements.correctMessage.style.display).toBe("none");
        expect(guiElements.incorrectMessage.style.display).toBe("none");
      });
    });

    describe("submitEventListener", function () {
      beforeEach(function () {
        jamBuddy.setCurrentNotes(["A", "D"]);
        guiElements.explanation.style.display = "none";
        guiElements.streakElement.style.display = "block";
        guiElements.inputField.disabled = false;
        guiElements.submitButton.disabled = false;
        guiElements.giveUpButton.disabled = false;
        guiElements.answerText.style.display = "block";
        guiElements.inputField.value = "5";
      });

      it("should trigger an alert when submitted with an empty input field", function () {
        guiElements.inputField.value = "";
        guiElements.submitButton.click();

        expect(mockWindow.alert).toHaveBeenCalledWith("Input can't be empty");
      });

      it("should display the explanation block when submitted with correct input answer", function () {
        guiElements.submitButton.click();
        expect(guiElements.explanation.style.display).toBe("block");
      });

      it("should disable the input field when submitted with correct input answer", function () {
        guiElements.submitButton.click();
        expect(guiElements.inputField.disabled).toBe(true);
      });

      it("should set the background color of the first note to red when submitted with correct input answer", function () {
        guiElements.firstNote.style.backgroundColor = "white";
        guiElements.submitButton.click();
        expect(guiElements.firstNote.style.backgroundColor).toBe("red");
      });

      it("should set the background color of the second note to yellow when submitted with correct input answer", function () {
        guiElements.secondNote.style.backgroundColor = "white";
        guiElements.submitButton.click();
        expect(guiElements.secondNote.style.backgroundColor).toBe("yellow");
      });

      it("should disable the submit button when submitted with correct input answer", function () {
        guiElements.submitButton.click();
        expect(guiElements.submitButton.disabled).toBe(true);
      });

      it("should display correct messages when submitted with correct input answer", function () {
        guiElements.submitButton.click();
        expect(guiElements.correctMessage.style.display).toBe("block");
      });

      it("should display incorrect messages when submitted with incorrect input answer", function () {
        guiElements.inputField.value = "3";
        guiElements.submitButton.click();
        expect(guiElements.incorrectMessage.style.display).toBe("block");
      });

      it("should disable the give up button when submitted with correct input answer", function () {
        guiElements.submitButton.click();
        expect(guiElements.giveUpButton.disabled).toBe(true);
      });

      it("should reset the streaks when submitted with correct input answer", function () {
        guiElements.streakNumberElement.innerText = 7;
        guiElements.inputField.value = "3";
        guiElements.submitButton.click();
        expect(guiElements.streakNumberElement.innerText).toBe(0);
      });
    });
  });
});
