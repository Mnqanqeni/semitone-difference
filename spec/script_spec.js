const { reloadPage } = require('../script');

let script;

describe('DOM Manipulation', function() {

  beforeEach(function() {
    const { JSDOM } = require('jsdom');
    const fs = require('fs');

    const html = fs.readFileSync("./index.html", "utf-8");
    const { document } = new JSDOM(html).window;
    global.document = document;

    const dom = new JSDOM(html);
    global.window = dom.window;

    mockWindow = {
      location: {
        reload: jasmine.createSpy()
      }
    };
    global.window = mockWindow;

    script = require('../script');

  
    jamBuddy = script.jamBuddy;
    noteOne = script.noteOne;
    noteTwo = script.noteTwo;
    firstNoteElement = document.getElementById('first-note');
    secondNoteElement = document.getElementById('second-note');
  });

  it('should initialize notes and display them', function() {
    expect(document.getElementById('first-note').innerText).not.toBe('');
    expect(document.getElementById('second-note').innerText).not.toBe('');
  });

  describe("restart event listener: ",function(){

    beforeEach(function(){
      
      document.getElementById('restart-btn').addEventListener('click', function() {
        script.reloadPage(window);
      });
    });

    it('should reload the page when restart button is clicked', function() {
      document.getElementById('restart-btn').click();
      expect(mockWindow.location.reload).toHaveBeenCalled();
    });

    it('should reload the page when restart button is clicked', function() {
  
      document.getElementById('restart-btn').click();
      expect(script.reloadPage).toHaveBeenCalled();
    });


  })

  describe("give up event listener: ",function(){

    beforeEach(function() {

      document.getElementById('give-up-btn').addEventListener("click", function() {
        script.disableSubmitAndGiveUpButton();
        script.clearTheBoxes();
        script.doTheExplanation(script.noteOne, script.noteTwo); 
      });
    });

    it('should call appropriate functions when give up button is clicked', function() {
      spyOn(script,'disableSubmitAndGiveUpButton');
      spyOn(script,'clearTheBoxes');
      spyOn(script,'doTheExplanation');

      document.getElementById('give-up-btn').click();
    
      expect(script.disableSubmitAndGiveUpButton).toHaveBeenCalled();
      expect(script.clearTheBoxes).toHaveBeenCalled();
      expect(script.doTheExplanation).toHaveBeenCalled();
    });

  })

  describe("randomize event listener: ",function(){

    beforeEach(function() {

      document.getElementById('randomize-btn').addEventListener("click", () => {
        script.clearTheBoxes();
        script.switchOffAnswer();
        script.ableSubmitAndGiveUpButton();
        document.querySelector("#submit-distance").disabled=false;
        jamBuddy.randomizeCurrentNotes();
        [noteOne, noteTwo] = jamBuddy.getCurrentNotes();
        firstNoteElement.innerText = noteOne;
        secondNoteElement.innerText = noteTwo;
      });
    
    });

    it('should update notes when randomize button is clicked', function() {

      spyOn(script,'clearTheBoxes');
      spyOn(script,'switchOffAnswer');
      spyOn(script,'ableSubmitAndGiveUpButton');

      document.getElementById('randomize-btn').click();
  
      expect(script.clearTheBoxes).toHaveBeenCalled();
      expect(script.switchOffAnswer).toHaveBeenCalled();
      expect(script.ableSubmitAndGiveUpButton).toHaveBeenCalled();
    });

  })

  describe("submit event listener: ",function(){

    beforeEach(function() {
    
      document.getElementById('submit-distance-form').addEventListener("submit", function(event) {
        event.preventDefault();
        const distanceInputElement = document.getElementById('distance-input');
        const distance = parseInt(distanceInputElement.value);
        if (isNaN(distance)) {
            alert("Input can't be empty");
            return;
        }
        
        distanceInputElement.value = "";
        script.switchOffAnswer();
        script.switchOffStreakMessage();
      
        if (jamBuddy.checkAnswer(distance)) {
            confetti({
                particleCount: 100,
                spread: 160,
                origin: { y: 0.6 }
            });
            script.showCorrectMessage();
            script.showAnswer(noteOne, noteTwo);
            script.streakCounter++;
            document.querySelector("#submit-distance").disabled=true;
        } else {
            script.showIncorrectMessage();
            script.streakCounter = 0;
        }
      
        script.delayCode(); 
      });
    })

    it('should call appropriate functions when submit button is clicked', function() {
      spyOn(script,'switchOffAnswer');
      spyOn(script,'switchOffStreakMessage');

      document.getElementById('submit-distance-form').submit();

      expect(script.switchOffAnswer).toHaveBeenCalled();
      expect(script.switchOffStreakMessage).toHaveBeenCalled();
    });
  })
});


  // it('should switch off answer and clear the boxes', function() {
  //   script.switchOffAnswer();

  //   expect(document.getElementById('explanation').style.display).toBe('none');

  //   for (let i = 0; i < 12; i++) {
  //     expect(document.querySelector(`#a${i}`).style.backgroundColor).toBe('rgb(204, 204, 204)');
  //   }
  // });

  // it('should show correct message', function() {
  //   script.showCorrectMessage();

  //   expect(document.getElementById('correctMessage').style.display).toBe('block');
  // });

  // Add more test cases as needed...