const { JamBuddy } = require("../src/jam_buddy");

let script, jamBuddy, guiElements, scriptHelperFunctions;

describe("DOM Manipulation", function () {
  let firstNoteElement,
    secondNoteElement,
    giveUpBtn,
    randomizeButton,
    inputField,
    submitBtn,
    restartBtn,
    mockWindow,
    streakCounter;

  beforeAll(function () {
    const { JSDOM } = require("jsdom");
    const fs = require("fs");
    const path = require("path");

    const html = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf-8"
    );
    const { window } = new JSDOM(html);
    global.window = window;
    global.document = window.document;

    mockWindow = {
      location: {
        reload: jasmine.createSpy(),
      },
      alert: jasmine.createSpy(),
    };
    global.window = mockWindow;
    global.document = window.document;

    jamBuddy = new JamBuddy();

    script = require("../src/script");
    guiElements = require("../src/script_helper_functions").guiElements;
    scriptHelperFunctions = require("../src/script_helper_functions");
    script.noteOne = "A";
    script.noteTwo = "D";

    form = guiElements.form;

    firstNoteElement = guiElements.firstNote;
    secondNoteElement = guiElements.secondNote;
    giveUpBtn = guiElements.giveUpButton;
    submitBtn = guiElements.submitButton;
    restartBtn = guiElements.restartButton;
    randomizeButton = guiElements.randomizeButton;
    inputField = guiElements.inputField;
    streakCounter = 0;
    spyOn(scriptHelperFunctions, "toggleButtons").and.callThrough();
  });

  it("should initialize notes and display them", function () {
    expect(firstNoteElement).not.toBeNull();
    expect(secondNoteElement).not.toBeNull();
    expect(firstNoteElement.innerText).not.toBe("");
    expect(secondNoteElement.innerText).not.toBe("");
  });

  describe("restart event listener", function () {
    beforeEach(function () {
      restartBtn.addEventListener("click", function () {
        scriptHelperFunctions.reloadPage(window);
      });
    });

    it("should call reloadPage when the restart button is clicked", function () {
      spyOn(scriptHelperFunctions, "reloadPage");
      restartBtn.click();
      expect(scriptHelperFunctions.reloadPage).toHaveBeenCalled();
    });

    it("should reload the page when the restart button is clicked", function () {
      restartBtn.click();
      expect(mockWindow.location.reload).toHaveBeenCalled();
    });
  });

  describe("give up event listener", function () {
    beforeEach(function () {
      giveUpBtn.addEventListener("click", function () {
        scriptHelperFunctions.toggleButtons("disable");
        scriptHelperFunctions.changeButtonColor("#7da2ca");
        inputField.disabled = true;
        scriptHelperFunctions.clearTheBoxes();
        scriptHelperFunctions.doTheExplanation(
          script.noteOne,
          script.noteTwo,
          streakCounter
        );
        streakCounter = 0;
        scriptHelperFunctions.showStreakMessage(streakCounter);
      });
    });

    afterEach(function () {
      scriptHelperFunctions.toggleButtons("enable");
    });

    it("should call toggleButtons, clearTheBoxes, and doTheExplanation when the give up button is clicked", function () {
      spyOn(scriptHelperFunctions, "clearTheBoxes").and.stub();
      spyOn(scriptHelperFunctions, "doTheExplanation").and.stub();
      giveUpBtn.click();
      expect(scriptHelperFunctions.toggleButtons).toHaveBeenCalled();
      expect(scriptHelperFunctions.clearTheBoxes).toHaveBeenCalled();
      expect(scriptHelperFunctions.doTheExplanation).toHaveBeenCalled();
    });

    it("should disable submit and give up buttons when the give up button is clicked", function () {
      giveUpBtn.disabled = false;
      submitBtn.disabled = false;
      spyOn(scriptHelperFunctions, "clearTheBoxes").and.stub();
      spyOn(scriptHelperFunctions, "doTheExplanation").and.stub();
      giveUpBtn.click();
      expect(giveUpBtn.disabled).toBe(true);
      expect(submitBtn.disabled).toBe(true);
    });
  });

  describe("randomize event listener", function () {
    beforeEach(function () {
      randomizeButton.addEventListener("click", () => {
        scriptHelperFunctions.clearTheBoxes();
        scriptHelperFunctions.switchOffAnswer();
        scriptHelperFunctions.toggleButtons("enable");
        scriptHelperFunctions.changeButtonColor("#007bff");
        inputField.disabled = false;
        scriptHelperFunctions.initNotes(jamBuddy);
      });
    });

    it("should call clearTheBoxes, switchOffAnswer, toggleButtons, and initNotes when the randomize button is clicked", function () {
      spyOn(scriptHelperFunctions, "clearTheBoxes");
      spyOn(scriptHelperFunctions, "switchOffAnswer");
      spyOn(scriptHelperFunctions, "initNotes");

      randomizeButton.click();

      expect(scriptHelperFunctions.clearTheBoxes).toHaveBeenCalled();
      expect(scriptHelperFunctions.switchOffAnswer).toHaveBeenCalled();
      expect(scriptHelperFunctions.toggleButtons).toHaveBeenCalled();
      expect(scriptHelperFunctions.initNotes).toHaveBeenCalled();
    });

    it("should enable submit and give up buttons when the randomize button is clicked", function () {
      giveUpBtn.disabled = true;
      submitBtn.disabled = true;
      scriptHelperFunctions.toggleButtons("enable");
      expect(giveUpBtn.disabled).toBe(false);
      expect(submitBtn.disabled).toBe(false);
    });

    it("should update notes when the randomize button is clicked", function () {
      spyOn(scriptHelperFunctions, "initNotes").and.callThrough();
      firstNoteElement.innerText = "k";
      secondNoteElement.innerText = "z";
      scriptHelperFunctions.initNotes(jamBuddy);
      expect("k").not.toBe(firstNoteElement.innerText);
      expect("z").not.toBe(secondNoteElement.innerText);
    });
  });

  describe("submit event listener", function () {
    beforeEach(function () {
      form.addEventListener("click", (event) => {
        event.preventDefault();
        const distance = parseInt(inputField.value);
        if (isNaN(distance)) {
          window.alert("Input can't be empty");
          return;
        }

        inputField.value = "";

        scriptHelperFunctions.switchOffAnswer(
          document,
          script.noteOne,
          script.noteTwo
        );
        scriptHelperFunctions.switchOffStreakMessage();

        if (jamBuddy.checkAnswer(distance)) {
          scriptHelperFunctions.displayAnswerMessage("correct");
          scriptHelperFunctions.showAnswer(
            document,
            script.noteOne,
            script.noteTwo
          );
          streakCounter++;
          scriptHelperFunctions.toggleButtons("disable");
          submitBtn.style.backgroundColor = "#7da2ca";
          giveUpBtn.style.backgroundColor = "#7da2ca";
          inputField.disabled = true;
        } else {
          scriptHelperFunctions.displayAnswerMessage("incorrect");
          streakCounter = 0;
        }
        scriptHelperFunctions.delayCode(streakCounter);
      });
    });
    afterEach(function () {
      scriptHelperFunctions.toggleButtons("enable");
      streakCounter = 0;
    });

    it("should call switchOffAnswer and switchOffStreakMessage when the submit button is clicked", function () {
      spyOn(scriptHelperFunctions, "switchOffAnswer");
      spyOn(scriptHelperFunctions, "switchOffStreakMessage");
      inputField.value = "5";
      submitBtn.click();
      expect(scriptHelperFunctions.switchOffAnswer).toHaveBeenCalled();
      expect(scriptHelperFunctions.switchOffStreakMessage).toHaveBeenCalled();
    });

    it("should show an alert when the submit button is clicked with an invalid input", function () {
      inputField.value = "hello";
      submitBtn.click();
      expect(mockWindow.alert).toHaveBeenCalled();
    });

    it("should handle a correct answer correctly", function () {
      spyOn(scriptHelperFunctions, "switchOffAnswer");
      spyOn(scriptHelperFunctions, "switchOffStreakMessage");
      spyOn(scriptHelperFunctions, "displayAnswerMessage");
      spyOn(scriptHelperFunctions, "showAnswer");
      spyOn(jamBuddy, "checkAnswer").and.returnValue(true);

      inputField.value = "5";

      submitBtn.click();

      expect(scriptHelperFunctions.switchOffAnswer).toHaveBeenCalled();
      expect(scriptHelperFunctions.switchOffStreakMessage).toHaveBeenCalled();
      expect(scriptHelperFunctions.displayAnswerMessage).toHaveBeenCalledWith(
        "correct"
      );
      expect(scriptHelperFunctions.showAnswer).toHaveBeenCalled();
      expect(streakCounter).toBe(1);
      expect(submitBtn.disabled).toBe(true);
    });

    it("should call showAnswer with the correct arguments when the submit button is clicked", function () {
      spyOn(scriptHelperFunctions, "showAnswer");
      jamBuddy.setCurrentNotes(["A", "D"]);
      inputField.value = "5";
      submitBtn.click();
      expect(scriptHelperFunctions.showAnswer).toHaveBeenCalledWith(
        document,
        "A",
        "D"
      );
    });

    it("should handle an incorrect answer correctly", function () {
      spyOn(scriptHelperFunctions, "switchOffAnswer");
      spyOn(scriptHelperFunctions, "switchOffStreakMessage");
      spyOn(scriptHelperFunctions, "displayAnswerMessage");
      spyOn(jamBuddy, "checkAnswer").and.returnValue(false);

      inputField.value = "5";

      submitBtn.click();

      expect(scriptHelperFunctions.switchOffAnswer).toHaveBeenCalled();
      expect(scriptHelperFunctions.switchOffStreakMessage).toHaveBeenCalled();
      expect(scriptHelperFunctions.displayAnswerMessage).toHaveBeenCalledWith(
        "incorrect"
      );
      expect(streakCounter).toBe(0);
      expect(submitBtn.disabled).toBe(false);
    });
  });
});
