const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const confetti = require("canvas-confetti");
const {JamBuddy} = require("../src/jam_buddy");

describe('JamBuddy', function() {
  let dom;
  let document;
  let window;
  let guiElements;
  let jamBuddy;
  let noteOne, noteTwo;

  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    dom = new JSDOM(html, { runScripts: "dangerously" });
    window = dom.window;
    document = window.document;

    global.window = window;
    global.document = document;

    const {
      toggleButtons,
      changeButtonColor,
      displayAnswerMessage,
      switchOffStreakMessage,
      switchMessageOff,
      clearTheBoxes,
      switchOffAnswer,
      delayCode,
      doTheExplanation,
      showStreakMessage,
      showAnswer,
      doCount,
      initNotes,
      reloadPage,
      restartEventListener,
      giveUpEventListener,
      randomizeEventListener,
      submitEventListener
    } = require('../src/script');


  beforeEach(function() {
    
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
      firstNote: document.querySelector("#first-note"),
      secondNote: document.querySelector("#second-note"),
    };

    const mockWindow = {
      location: {
        reload: jasmine.createSpy(),
      },
      alert: jasmine.createSpy(),
    };
  
    global.window = mockWindow;
    window.alert=jasmine.createSpy();
      
  });

  describe('Event Listeners', function() {
    
    it('should restart the event listener', function() {
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

    it('should give up the event listener', function() {
      giveUpEventListener(guiElements);
      guiElements.giveUpButton.click();
      expect(guiElements.inputField.disabled).toBe(true);
      expect(guiElements.submitButton.disabled).toBe(true);
      expect(guiElements.giveUpButton.disabled).toBe(true);
    });

    it('should randomize event listener', function() {
      randomizeEventListener(guiElements);
      guiElements.randomizeButton.click();
      expect(guiElements.inputField.disabled).toBe(false);
    });

    it('should submit event listener with empty input', function() {
     
      guiElements.inputField.disabled=false;
      guiElements.submitButton.disabled=false;
      guiElements.inputField.value = "";
      submitEventListener(guiElements); 
    
      guiElements.submitButton.click();
    
      expect(mockWindow.alert).toHaveBeenCalledWith("Input can't be empty"); 
    });
    
    

    fit('should submit event listener with valid input', function() {
      const jamBuddy = new JamBuddy();
      jamBuddy.setCurrentNotes(["A","D"])
      guiElements.explanation.style.display = "Block";
      guiElements.streakElement.style.display="Block"
      guiElements.correctMessage.style.display="none";
      guiElements.incorrectMessage.style.display="Block";
      guiElements.inputField.disabled=false;
      guiElements.submitButton.disabled=false;
      guiElements.giveUpButton.disabled=false;
      submitEventListener(guiElements,jamBuddy);
      guiElements.inputField.value = "5";
      guiElements.submitButton.click();

      expect( guiElements.explanation.style.display).toBe("none");
      expect(guiElements.streakElement.style.display).toBe("none");
  
      
      expect(guiElements.correctMessage.style.display).toBe('block');
      // expect(guiElements.incorrectMessage.style.display).toBe('none');
      // expect(guiElements.inputField.disabled).toBe(true);
      // expect(guiElements.submitButton.disabled).toBe(true);
      // expect(guiElements.giveUpButton.disabled).toBe(true);
       
    });

    // it('should handle incorrect answer on submit', function() {
    //   submitEventListener(guiElements);
    //   guiElements.inputField.value = "3";
    //   const event = new dom.window.Event('submit');
    //   guiElements.form.dispatchEvent(event);

    //   expect(guiElements.correctMessage.style.display).toBe('none');
    //   expect(guiElements.incorrectMessage.style.display).toBe('block');
    // });
  });

  // describe('Helper Functions', function() {
  //   it('should toggle buttons', function() {
  //     toggleButtons('disable');
  //     expect(guiElements.submitButton.disabled).toBe(true);
  //     expect(guiElements.giveUpButton.disabled).toBe(true);
  //     toggleButtons('enable');
  //     expect(guiElements.submitButton.disabled).toBe(false);
  //     expect(guiElements.giveUpButton.disabled).toBe(false);
  //   });

  //   it('should change button color', function() {
  //     const color = '#ff0000';
  //     changeButtonColor(color);
  //     expect(guiElements.submitButton.style.backgroundColor).toBe(color);
  //     expect(guiElements.giveUpButton.style.backgroundColor).toBe(color);
  //   });

  //   it('should display correct answer message', function() {
  //     displayAnswerMessage('correct');
  //     expect(guiElements.correctMessage.style.display).toBe('block');
  //     expect(guiElements.incorrectMessage.style.display).toBe('none');
  //   });

  //   it('should display incorrect answer message', function() {
  //     displayAnswerMessage('incorrect');
  //     expect(guiElements.correctMessage.style.display).toBe('none');
  //     expect(guiElements.incorrectMessage.style.display).toBe('block');
  //   });

  //   it('should switch off streak message', function() {
  //     switchOffStreakMessage();
  //     expect(guiElements.streakElement.style.display).toBe('none');
  //   });

  //   it('should switch off messages', function() {
  //     switchMessageOff();
  //     expect(guiElements.correctMessage.style.display).toBe('none');
  //     expect(guiElements.incorrectMessage.style.display).toBe('none');
  //   });

  //   it('should clear the boxes', function() {
  //     clearTheBoxes(document);
  //     const arrayObject = [1, 4, 6, 9];
  //     for (let i = 0; i < 12; i++) {
  //       if (arrayObject.includes(i)) {
  //         expect(document.querySelector(`#a${i}a0`).style.backgroundColor).toBe('#ccc');
  //         expect(document.querySelector(`#a${i}a1`).style.backgroundColor).toBe('#ccc');
  //       } else {
  //         expect(document.querySelector(`#a${i}`).style.backgroundColor).toBe('#ccc');
  //       }
  //     }
  //   });

  //   it('should switch off answer', function() {
  //     switchOffAnswer(document, 'C', 'D');
  //     expect(guiElements.explanation.style.display).toBe('none');
  //     expect(document.querySelector('#a0').style.backgroundColor).toBe('#ccc');
  //     expect(document.querySelector('#a2').style.backgroundColor).toBe('#ccc');
  //   });

  //   it('should show the streak message', function() {
  //     showStreakMessage(3);
  //     expect(guiElements.streakNumberElement.innerText).toBe('3');
  //     expect(guiElements.streakElement.style.display).toBe('block');
  //   });

  //   it('should show the answer', function() {
  //     showAnswer(document, 'C', 'D');
  //     expect(guiElements.explanation.style.display).toBe('block');
  //     expect(document.querySelector('#a0a0').style.backgroundColor).toBe('red');
  //     expect(document.querySelector('#a2a1').style.backgroundColor).toBe('yellow');
  //   });

  //   it('should reload the page', function() {
  //     spyOn(window.location, 'reload');
  //     reloadPage(window);
  //     expect(window.location.reload).toHaveBeenCalled();
  //   });
  // });

});
