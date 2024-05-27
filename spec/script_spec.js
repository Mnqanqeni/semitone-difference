const exp = require("constants");
const { JamBuddy } = require("../src/jam_buddy");

let script;

describe('DOM Manipulation', function() {
  let firstNoteElement, secondNoteElement, giveUpBtn, randomizeButton, inputField, submitBtn, restartBtn, mockWindow, streakCounter;
  const jamBuddy = new JamBuddy();
  
  beforeEach(function() {
    const { JSDOM } = require('jsdom');
    const fs = require('fs');
    const path = require('path');

    const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
    const { window } = new JSDOM(html);
    global.window = window;
    global.document = window.document;

    mockWindow = {
      location: {
        reload: jasmine.createSpy()
      },
      alert: jasmine.createSpy()
    };
    global.window = mockWindow;
    let confetti = { default: function(){ return true } }
    streakCounter = 0;
    
    script = require('../src/script');
    script.noteOne = "A";
    script.noteTwo = "D";

    firstNoteElement = document.getElementById('first-note');
    secondNoteElement = document.getElementById('second-note');
    giveUpBtn = document.getElementById('give-up-btn');
    submitBtn = document.getElementById('submit-btn');
    restartBtn = document.getElementById('restart-btn');
    randomizeButton = document.querySelector("#randomize-btn");
    inputField = document.getElementById("input-field");

    spyOn(script, 'disableSubmitAndGiveUpButton').and.callThrough();
  });

  it('should initialize notes and display them', function() {
    expect(firstNoteElement).not.toBeNull();
    expect(secondNoteElement).not.toBeNull();
    expect(firstNoteElement.innerText).not.toBe('');
    expect(secondNoteElement.innerText).not.toBe('');
  });

  describe("restart event listener", function() {
    beforeEach(function() {
      restartBtn.addEventListener('click', function() {
        script.reloadPage(window);
      });
    });

    it('should call reloadPage when the restart button is clicked', function() {
      spyOn(script, "reloadPage");
      restartBtn.click();
      expect(script.reloadPage).toHaveBeenCalled();
    });

    it('should reload the page when the restart button is clicked', function() {
      restartBtn.click();
      expect(mockWindow.location.reload).toHaveBeenCalled();
    });
  });

  describe("give up event listener", function() {
    beforeEach(function() {
      giveUpBtn.addEventListener("click", function() {
        script.disableSubmitAndGiveUpButton();
        script.clearTheBoxes();
        script.doTheExplanation(script.noteOne, script.noteTwo);
      });
    });

    it('should call disableSubmitAndGiveUpButton, clearTheBoxes, and doTheExplanation when the give up button is clicked', function() {
      spyOn(script, 'clearTheBoxes').and.stub();
      spyOn(script, 'doTheExplanation').and.stub();
      giveUpBtn.click();
      expect(script.disableSubmitAndGiveUpButton).toHaveBeenCalled();
      expect(script.clearTheBoxes).toHaveBeenCalled();
      expect(script.doTheExplanation).toHaveBeenCalled();
    });

    it('should disable submit and give up buttons when the give up button is clicked', function() {
      giveUpBtn.disabled = false;
      submitBtn.disabled = false;
      spyOn(script, 'clearTheBoxes').and.stub();
      spyOn(script, 'doTheExplanation').and.stub();
      giveUpBtn.click();
      expect(giveUpBtn.disabled).toBe(true);
      expect(submitBtn.disabled).toBe(true);
    });

    it('should maintain the gray background color for elements when the give up button is clicked', function() {
      spyOn(script, "showAnswer").and.stub();
      for (let i = 0; i < 12; i++) {
        let element = document.querySelector(`#a${i}`);
        element.style.backgroundColor = "rgb(204, 204, 204)"
      }
      script.showAnswer(script.noteOne, script.noteTwo);
      script.clearTheBoxes();
      for (let i = 0; i < 12; i++) {
        let element = document.querySelector(`#a${i}`);
        expect(element.style.backgroundColor).toBe("rgb(204, 204, 204)");
      }
    });

  });

  describe("randomize event listener", function() {

    beforeEach(function() {
      document.querySelector("#randomize-btn").addEventListener("click", () => {
        script.clearTheBoxes();
        script.switchOffAnswer();
        script.ableSubmitAndGiveUpButton();
        document.querySelector("#submit-btn").disabled = false;
        script.initNotes(document);
      });
    });

    it('should call clearTheBoxes, switchOffAnswer, ableSubmitAndGiveUpButton, and initNotes when the randomize button is clicked', function() {
      spyOn(script, 'clearTheBoxes');
      spyOn(script, 'switchOffAnswer');
      spyOn(script, 'ableSubmitAndGiveUpButton');
      spyOn(script, "initNotes");

      document.getElementById('randomize-btn').click();
  
      expect(script.clearTheBoxes).toHaveBeenCalled();
      expect(script.switchOffAnswer).toHaveBeenCalled();
      expect(script.ableSubmitAndGiveUpButton).toHaveBeenCalled();
      expect(script.initNotes).toHaveBeenCalled();
    });

    it('should enable submit and give up buttons when the randomize button is clicked', function() {
      giveUpBtn.disabled = true;
      submitBtn.disabled = true;
      spyOn(script, 'ableSubmitAndGiveUpButton').and.callThrough();
      script.ableSubmitAndGiveUpButton();
      expect(giveUpBtn.disabled).toBe(false);
      expect(submitBtn.disabled).toBe(false);
    });

    it('should update notes when the randomize button is clicked', function() {
      spyOn(script, 'initNotes').and.callThrough();
      let previousNoteOne = document.querySelector("#first-note").innerText;
      let previousNoteTwo = document.querySelector("#second-note").innerText;
      script.initNotes(document);
      expect(previousNoteOne).not.toBe(document.querySelector("#first-note").innerText);
      expect(previousNoteTwo).not.toBe(document.querySelector("#second-note").innerText);
    });

  });

  describe("submit event listener", function() {

    beforeEach(function() {
      global.addEventListener = () => {};
      document.getElementById("submit-btn").addEventListener("click", function(event) {
        event.preventDefault();
        const distance = parseInt(inputField.value);
        if (isNaN(distance)) {
          window.alert("Input can't be empty");
          return;
        }
        
        inputField.value = "";
        script.switchOffAnswer();
        script.switchOffStreakMessage();
    
        if (jamBuddy.checkAnswer(distance)) {
          script.showCorrectMessage();
          script.showAnswer(script.noteOne, script.noteTwo);
          streakCounter++;
          document.querySelector("#submit-btn").disabled = true;
        } else {
          script.showIncorrectMessage();
          streakCounter = 0;
        }
        script.delayCode();
        
      });
    });

    it('should call switchOffAnswer and switchOffStreakMessage when the submit button is clicked', function() {
      spyOn(script, 'switchOffAnswer').and.callThrough();
      spyOn(script, 'switchOffStreakMessage');
      inputField.value = "5";
      submitBtn.click();

      expect(script.switchOffAnswer).toHaveBeenCalled();
      expect(script.switchOffStreakMessage).toHaveBeenCalled();
    });

    it('should show an alert when the submit button is clicked with an invalid input', function() {
      inputField.value = "hello";
      submitBtn.click();
      expect(mockWindow.alert).toHaveBeenCalled();
    });
  
    it('should handle a correct answer correctly', function() {
      spyOn(script, 'switchOffAnswer');
      spyOn(script, 'switchOffStreakMessage');
      spyOn(script, 'showCorrectMessage');
      spyOn(script, 'showAnswer');
      spyOn(jamBuddy, 'checkAnswer').and.returnValue(true);

      inputField.value = "5";
    
      submitBtn.click();

      expect(script.switchOffAnswer).toHaveBeenCalled();
      expect(script.switchOffStreakMessage).toHaveBeenCalled();
      expect(script.showCorrectMessage).toHaveBeenCalled();
      expect(script.showAnswer).toHaveBeenCalled();
      expect(streakCounter).toBe(1);
      expect(submitBtn.disabled).toBe(true);
    });

    it('should call showAnswer with the correct arguments when the submit button is clicked', function() {
      spyOn(script, 'showAnswer').and.stub();
      jamBuddy.setCurrentNotes(["A", "D"]);
      inputField.value = "5";
      submitBtn.click();
      expect(script.showAnswer).toHaveBeenCalledWith(script.noteOne, script.noteTwo);
    });

    it('should handle an incorrect answer correctly', function() {
      spyOn(script, 'switchOffAnswer');
      spyOn(script, 'switchOffStreakMessage');
      spyOn(script, 'showIncorrectMessage');
      spyOn(jamBuddy, 'checkAnswer').and.returnValue(false);

      inputField.value = "5";
      submitBtn.click();

      expect(script.switchOffAnswer).toHaveBeenCalled();
      expect(script.switchOffStreakMessage).toHaveBeenCalled();
      expect(script.showIncorrectMessage).toHaveBeenCalled();
      expect(streakCounter).toBe(0);
      expect(submitBtn.disabled).toBe(false);
    });

    it('should call showIncorrectMessage when the submit button is clicked with an incorrect answer', function() {
      spyOn(script, 'showIncorrectMessage');
      jamBuddy.setCurrentNotes(["A", "D"]);
      inputField.value = "9";
      submitBtn.click();
      expect(script.showIncorrectMessage).toHaveBeenCalled();
    });

  });

});
