const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

describe("script", function () {
  let dom;
  let document;
  let window;
  let guiElements;

  const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");

  dom = new JSDOM(html, {
    runScripts: "dangerously"
  });
  document = dom.window.document;
  window = dom.window;
  global.window = window;
  global.document = document;
  const { jamBuddy, reloadPage } = require("../src/index");

  beforeEach(function () {
    guiElements = {
      ...require("../src/index").guiElements,
      firstNote: document.querySelector("#a0"),
      secondNote: document.querySelector("#a5"),
    };

    window.alert = jasmine.createSpy();
    window.confetti = jasmine.createSpy('confetti');
    window.HTMLMediaElement.prototype.pause = () => "pause";
    window.HTMLMediaElement.prototype.play = () => "play";
  });

  describe("Event Listeners", function () {

    describe("Page Refresh Test", function () {
      it("should call refreshPage function to refresh the page", function () {
        const mockLocation = { href: 'http://example.com' };
        reloadPage(mockLocation);
        expect(mockLocation.href).toBe('http://example.com');
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

      it("should pause and reset music on randomize button click", function () {
        const correctMusic = guiElements.correctMusic;
        spyOn(correctMusic, "pause");
        spyOnProperty(correctMusic, "currentTime", "set");
        guiElements.randomizeButton.click();
        expect(correctMusic.pause).toHaveBeenCalled();
        expect(correctMusic.currentTime).toBe(0);
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
        expect(window.alert).toHaveBeenCalledWith("Input can't be empty");
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

      it("should reset the streaks when submitted with incorrect input answer", function () {
        guiElements.streakNumberElement.innerText = 7;
        guiElements.inputField.value = "3";
        guiElements.submitButton.click();
        expect(guiElements.streakNumberElement.innerText).toBe(0);
      });

      it("should display correct answer and play confetti animation on correct guess", function () {
        spyOn(jamBuddy, "checkAnswer").and.returnValue(true);
        guiElements.submitButton.click();
        expect(window.confetti).toHaveBeenCalled();
        expect(guiElements.correctMessage.style.display).toBe("block");
        expect(guiElements.incorrectMessage.style.display).toBe("none");
      });

      it("should display incorrect answer and reset streak on incorrect guess", function () {
        spyOn(jamBuddy, "checkAnswer").and.returnValue(false);
        guiElements.submitButton.click();
        expect(guiElements.correctMessage.style.display).toBe("none");
        expect(guiElements.incorrectMessage.style.display).toBe("block");
        expect(guiElements.streakNumberElement.innerText).toBe(0);
      });

      it("should display correct answer and play music on correct guess", function () {
        spyOn(jamBuddy, "checkAnswer").and.returnValue(true);
        const correctMusic = guiElements.correctMusic;
        spyOn(correctMusic, "play");
        guiElements.submitButton.click();
        expect(window.confetti).toHaveBeenCalled();
        expect(guiElements.correctMessage.style.display).toBe("block");
        expect(guiElements.incorrectMessage.style.display).toBe("none");
        expect(guiElements.streakNumberElement.innerText).not.toBe("0");
        expect(correctMusic.play).toHaveBeenCalled();
      });

      it("should increase the streak when the submit button is pressed with a correct answer", function () {
        spyOn(jamBuddy, "checkAnswer").and.returnValue(true);
        const initialStreak = parseInt(guiElements.streakNumberElement.innerText, 10);
        guiElements.submitButton.click();
        expect(parseInt(guiElements.streakNumberElement.innerText, 10)).toBe(initialStreak + 1);
      });

      it("should trigger confetti with the correct parameters when submitted with correct input answer", function () {
        guiElements.submitButton.click();
        expect(window.confetti).toHaveBeenCalledWith(jasmine.objectContaining({
          particleCount: jasmine.any(Number),
          spread: jasmine.any(Number),
          origin: { y: 0.6 },
          colors: jasmine.any(Array),
        }));
      });

      it("should not trigger confetti when answer is incorrect", function () {
        spyOn(jamBuddy, "checkAnswer").and.returnValue(false);
        guiElements.submitButton.click();
        expect(window.confetti).not.toHaveBeenCalled();
        expect(guiElements.correctMessage.style.display).toBe("none");
      });
    });
  });
});
