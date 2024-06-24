const { JamBuddy } = require("../src/jam_buddy");

let script, jamBuddy, guiElements;

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

    guiElements = require("../src/script").guiElements;
    script = require("../src/script");
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
    spyOn(script, "toggleButtons").and.callThrough();
  });

  it("should initialize notes and display them", function () {
    // expect(firstNoteElement).not.toBeNull();
    // expect(secondNoteElement).not.toBeNull();
    // expect(firstNoteElement.innerText).not.toBe("");
    // expect(secondNoteElement.innerText).not.toBe("");
  });

  // describe("restart event listener", function () {
  //   beforeEach(function () {
  //     restartBtn.addEventListener("click", function () {
  //       script.reloadPage(window);
  //     });
  //   });

  //   it("should call reloadPage when the restart button is clicked", function () {
  //     spyOn(script, "reloadPage");
  //     restartBtn.click();
  //     expect(script.reloadPage).toHaveBeenCalled();
  //   });

  //   it("should reload the page when the restart button is clicked", function () {
  //     restartBtn.click();
  //     expect(mockWindow.location.reload).toHaveBeenCalled();
  //   });
  // });

  // describe("give up event listener", function () {
  //   beforeEach(function () {
  //     giveUpBtn.addEventListener("click", function () {
  //       script.toggleButtons("disable");
  //       script.changeButtonColor("#7da2ca");
  //       inputField.disabled = true;
  //       script.clearTheBoxes();
  //       script.doTheExplanation(
  //         script.noteOne,
  //         script.noteTwo,
  //         streakCounter
  //       );
  //       streakCounter = 0;
  //       script.showStreakMessage(streakCounter);
  //     });
  //   });

  //   afterEach(function () {
  //     script.toggleButtons("enable");
  //   });

  //   it("should call toggleButtons, clearTheBoxes, and doTheExplanation when the give up button is clicked", function () {
  //     spyOn(script, "clearTheBoxes").and.stub();
  //     spyOn(script, "doTheExplanation").and.stub();
  //     giveUpBtn.click();
  //     expect(script.toggleButtons).toHaveBeenCalled();
  //     expect(script.clearTheBoxes).toHaveBeenCalled();
  //     expect(script.doTheExplanation).toHaveBeenCalled();
  //   });

  //   it("should disable submit and give up buttons when the give up button is clicked", function () {
  //     giveUpBtn.disabled = false;
  //     submitBtn.disabled = false;
  //     spyOn(script, "clearTheBoxes").and.stub();
  //     spyOn(script, "doTheExplanation").and.stub();
  //     giveUpBtn.click();
  //     expect(giveUpBtn.disabled).toBe(true);
  //     expect(submitBtn.disabled).toBe(true);
  //   });
  // });

  // describe("randomize event listener", function () {
  //   beforeEach(function () {
  //     randomizeButton.addEventListener("click", () => {
  //       script.clearTheBoxes();
  //       script.switchOffAnswer();
  //       script.toggleButtons("enable");
  //       script.changeButtonColor("#007bff");
  //       inputField.disabled = false;
  //       script.initNotes(jamBuddy);
  //     });
  //   });

  //   it("should call clearTheBoxes, switchOffAnswer, toggleButtons, and initNotes when the randomize button is clicked", function () {
  //     spyOn(script, "clearTheBoxes");
  //     spyOn(script, "switchOffAnswer");
  //     spyOn(script, "initNotes");

  //     randomizeButton.click();

  //     expect(script.clearTheBoxes).toHaveBeenCalled();
  //     expect(script.switchOffAnswer).toHaveBeenCalled();
  //     expect(script.toggleButtons).toHaveBeenCalled();
  //     expect(script.initNotes).toHaveBeenCalled();
  //   });

  //   it("should enable submit and give up buttons when the randomize button is clicked", function () {
  //     giveUpBtn.disabled = true;
  //     submitBtn.disabled = true;
  //     script.toggleButtons("enable");
  //     expect(giveUpBtn.disabled).toBe(false);
  //     expect(submitBtn.disabled).toBe(false);
  //   });

  //   it("should update notes when the randomize button is clicked", function () {
  //     spyOn(script, "initNotes").and.callThrough();
  //     firstNoteElement.innerText = "k";
  //     secondNoteElement.innerText = "z";
  //     script.initNotes(jamBuddy);
  //     expect("k").not.toBe(firstNoteElement.innerText);
  //     expect("z").not.toBe(secondNoteElement.innerText);
  //   });
  // });

  // describe("submit event listener", function () {
  //   beforeEach(function () {
  //     form.addEventListener("click", (event) => {
  //       event.preventDefault();
  //       const distance = parseInt(inputField.value);
  //       if (isNaN(distance)) {
  //         window.alert("Input can't be empty");
  //         return;
  //       }

  //       inputField.value = "";

  //       script.switchOffAnswer(
  //         document,
  //         script.noteOne,
  //         script.noteTwo
  //       );
  //       script.switchOffStreakMessage();

  //       if (jamBuddy.checkAnswer(distance)) {
  //         script.displayAnswerMessage("correct");
  //         script.showAnswer(
  //           document,
  //           script.noteOne,
  //           script.noteTwo
  //         );
  //         streakCounter++;
  //         script.toggleButtons("disable");
  //         submitBtn.style.backgroundColor = "#7da2ca";
  //         giveUpBtn.style.backgroundColor = "#7da2ca";
  //         inputField.disabled = true;
  //       } else {
  //         script.displayAnswerMessage("incorrect");
  //         streakCounter = 0;
  //       }
  //       script.delayCode(streakCounter);
  //     });
  //   });
  //   afterEach(function () {
  //     script.toggleButtons("enable");
  //     streakCounter = 0;
  //     inputField.value = "";
  //   });
    
  //   it("should call switchOffAnswer and switchOffStreakMessage when the submit button is clicked", function () {
  //     inputField.value = "";
  //     submitBtn.click();
  //     expect(window.alert).toHaveBeenCalled();
  //   })
    
  //   it("should call switchOffAnswer and switchOffStreakMessage when the submit button is clicked", function () {
  //     spyOn(script, "switchOffAnswer");
  //     spyOn(script, "switchOffStreakMessage");
  //     inputField.value = "5";
  //     submitBtn.click();
  //     expect(script.switchOffAnswer).toHaveBeenCalled();
  //     expect(script.switchOffStreakMessage).toHaveBeenCalled();
  //   });

  //   it("should show an alert when the submit button is clicked with an invalid input", function () {
  //     inputField.value = "hello";
  //     submitBtn.click();
  //     expect(mockWindow.alert).toHaveBeenCalled();
  //   });

  //   it("should handle a correct answer correctly", function () {
  //     spyOn(script, "switchOffAnswer");
  //     spyOn(script, "switchOffStreakMessage");
  //     spyOn(script, "displayAnswerMessage");
  //     spyOn(script, "showAnswer");
  //     spyOn(jamBuddy, "checkAnswer").and.returnValue(true);

  //     inputField.value = "5";

  //     submitBtn.click();

  //     expect(script.switchOffAnswer).toHaveBeenCalled();
  //     expect(script.switchOffStreakMessage).toHaveBeenCalled();
  //     expect(script.displayAnswerMessage).toHaveBeenCalledWith(
  //       "correct"
  //     );
  //     expect(script.showAnswer).toHaveBeenCalled();
  //     expect(streakCounter).toBe(1);
  //     expect(submitBtn.disabled).toBe(true);
  //   });

  //   it("should call showAnswer with the correct arguments when the submit button is clicked", function () {
  //     spyOn(script, "showAnswer");
  //     jamBuddy.setCurrentNotes(["A", "D"]);
  //     inputField.value = "5";
  //     submitBtn.click();
  //     expect(script.showAnswer).toHaveBeenCalledWith(
  //       document,
  //       "A",
  //       "D"
  //     );
  //   });

  //   it("should handle an incorrect answer correctly", function () {
  //     spyOn(script, "switchOffAnswer");
  //     spyOn(script, "switchOffStreakMessage");
  //     spyOn(script, "displayAnswerMessage");
  //     spyOn(jamBuddy, "checkAnswer").and.returnValue(false);

  //     inputField.value = "5";

  //     submitBtn.click();

  //     expect(script.switchOffAnswer).toHaveBeenCalled();
  //     expect(script.switchOffStreakMessage).toHaveBeenCalled();
  //     expect(script.displayAnswerMessage).toHaveBeenCalledWith(
  //       "incorrect"
  //     );
  //     expect(streakCounter).toBe(0);
  //     expect(submitBtn.disabled).toBe(false);
  //   });
  // });
});
