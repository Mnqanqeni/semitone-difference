const { JamBuddy } = require("../src/jam_buddy");
const scriptHelperFunctions = require("../src/script_helper_functions");
let script, form, jamBuddy;

describe('DOM Manipulation', function() {
    let firstNoteElement, secondNoteElement, giveUpBtn, randomizeButton, inputField, submitBtn, restartBtn, mockWindow, streakCounter;

    beforeAll(function() {
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
        global.document = window.document;

        jamBuddy = new JamBuddy();

        script = require('../src/script');
        script.noteOne = "A";
        script.noteTwo = "D";

        form = document.querySelector('form');

        firstNoteElement = document.getElementById('first-note');
        secondNoteElement = document.getElementById('second-note');
        giveUpBtn = document.getElementById('give-up-btn');
        submitBtn = document.getElementById('submit-btn');
        restartBtn = document.getElementById('restart-btn');
        randomizeButton = document.querySelector("#randomize-btn");
        inputField = document.getElementById("input-field");

        spyOn(scriptHelperFunctions, 'disableSubmitAndGiveUpButton').and.callThrough();
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
                scriptHelperFunctions.reloadPage(window);
            });
        });

        it('should call reloadPage when the restart button is clicked', function() {
            spyOn(scriptHelperFunctions, "reloadPage");
            restartBtn.click();
            expect(scriptHelperFunctions.reloadPage).toHaveBeenCalled();
        });

        it('should reload the page when the restart button is clicked', function() {
            restartBtn.click();
            expect(mockWindow.location.reload).toHaveBeenCalled();
        });
    });

    describe("give up event listener", function() {
        beforeEach(function() {
            giveUpBtn.addEventListener("click", function() {
                scriptHelperFunctions.disableSubmitAndGiveUpButton(document);
                scriptHelperFunctions.lowerColorButton(document, "#7da2ca");
                inputField.disabled = true;
                scriptHelperFunctions.clearTheBoxes(document);
                scriptHelperFunctions.doTheExplanation(document, script.noteOne, script.noteTwo, streakCounter);
                streakCounter = 0;
                scriptHelperFunctions.showStreakMessage(document, streakCounter);
            });
        });

        afterEach(function() {
            scriptHelperFunctions.enableSubmitAndGiveUpButton(document);
        });

        it('should call disableSubmitAndGiveUpButton, clearTheBoxes, and doTheExplanation when the give up button is clicked', function() {
            spyOn(scriptHelperFunctions, 'clearTheBoxes').and.stub();
            spyOn(scriptHelperFunctions, 'doTheExplanation').and.stub();
            giveUpBtn.click();
            expect(scriptHelperFunctions.disableSubmitAndGiveUpButton).toHaveBeenCalled();
            expect(scriptHelperFunctions.clearTheBoxes).toHaveBeenCalled();
            expect(scriptHelperFunctions.doTheExplanation).toHaveBeenCalled();
        });

        it('should disable submit and give up buttons when the give up button is clicked', function() {
            giveUpBtn.disabled = false;
            submitBtn.disabled = false;
            spyOn(scriptHelperFunctions, 'clearTheBoxes').and.stub();
            spyOn(scriptHelperFunctions, 'doTheExplanation').and.stub();
            giveUpBtn.click();
            expect(giveUpBtn.disabled).toBe(true);
            expect(submitBtn.disabled).toBe(true);
        });

        it('should maintain the gray background color for elements when the give up button is clicked', function() {
            spyOn(scriptHelperFunctions, "showAnswer").and.stub();
            for (let i = 0; i < 12; i++) {
                let element = document.querySelector(`#a${i}`);
                element.style.backgroundColor = "rgb(204, 204, 204)"
            }
            scriptHelperFunctions.showAnswer(document, script.noteOne, script.noteTwo);
            scriptHelperFunctions.clearTheBoxes(document);
            for (let i = 0; i < 12; i++) {
                let element = document.querySelector(`#a${i}`);
                expect(element.style.backgroundColor).toBe("rgb(204, 204, 204)");
            }
        });

    });

    // describe("randomize event listener", function() {

    //     beforeEach(function() {
    //         randomizeButton.addEventListener("click", () => {
    //             scriptHelperFunctions.clearTheBoxes(document);
    //             scriptHelperFunctions.switchOffAnswer(document);
    //             scriptHelperFunctions.enableSubmitAndGiveUpButton(document);
    //             scriptHelperFunctions.putColorButtonToNormal(document, "#007bff");
    //             inputField.disabled = false;
    //             [script.noteOne, script.noteTwo] = scriptHelperFunctions.initNotes(jamBuddy, document);
    //         });
    //     });

    //     it('should call clearTheBoxes, switchOffAnswer, enableSubmitAndGiveUpButton, and initNotes when the randomize button is clicked', function() {
    //         spyOn(scriptHelperFunctions, 'clearTheBoxes');
    //         spyOn(scriptHelperFunctions, 'switchOffAnswer');
    //         spyOn(scriptHelperFunctions, 'enableSubmitAndGiveUpButton');
    //         spyOn(scriptHelperFunctions, "initNotes");

    //         randomizeButton.click();
    
    //         expect(scriptHelperFunctions.clearTheBoxes).toHaveBeenCalled();
    //         expect(script.switchOffAnswer).toHaveBeenCalled();
    //         expect(scriptHelperFunctions.enableSubmitAndGiveUpButton).toHaveBeenCalled();
    //         expect(scriptHelperFunctions.initNotes).toHaveBeenCalled();
    //     });

    //     it('should enable submit and give up buttons when the randomize button is clicked', function() {
    //         giveUpBtn.disabled = true;
    //         submitBtn.disabled = true;
    //         spyOn(scriptHelperFunctions, 'enableSubmitAndGiveUpButton').and.callThrough();
    //         scriptHelperFunctions.enableSubmitAndGiveUpButton(document);
    //         expect(giveUpBtn.disabled).toBe(false);
    //         expect(submitBtn.disabled).toBe(false);
    //     });

    //     it('should update notes when the randomize button is clicked', function() {
    //         spyOn(scriptHelperFunctions, 'initNotes').and.callThrough();
    //         let previousNoteOne = firstNoteElement.innerText;
    //         let previousNoteTwo = secondNoteElement.innerText;
    //         scriptHelperFunctions.initNotes(jamBuddy, document);
    //         expect(previousNoteOne).not.toBe(firstNoteElement.innerText);
    //         expect(previousNoteTwo).not.toBe(secondNoteElement.innerText);
    //     });

    // });

    // describe("submit event listener", function() {

    //     beforeEach(function() {
    //         form.addEventListener("submit", (event) => {
    //             event.preventDefault();
    //             const distance = parseInt(inputField.value);
    //             if (isNaN(distance)) {
    //                 window.alert("Input can't be empty");
    //                 return;
    //             }

    //             inputField.value = "";
    //             script.switchOffAnswer(document, script.noteOne, script.noteTwo, jamBuddy);
    //             scriptHelperFunctions.switchOffStreakMessage(document);

    //             if (jamBuddy.checkAnswer(distance)) {
    //               scriptHelperFunctions.showCorrectMessage(document);
    //               scriptHelperFunctions.showAnswer(document, script.noteOne, script.noteTwo, jamBuddy);
    //               streakCounter++;
    //               scriptHelperFunctions.disableSubmitAndGiveUpButton(document);
    //               submitBtn.style.backgroundColor = "#7da2ca";
    //               giveUpBtn.style.backgroundColor = "#7da2ca";
    //               inputField.disabled = true;
    //             } else {
    //               scriptHelperFunctions.showIncorrectMessage(document);
    //               streakCounter = 0;
    //             }
    //             scriptHelperFunctions.delayCode(document, streakCounter);
    //         });
    //     });

    //     it('should call switchOffAnswer and switchOffStreakMessage when the submit button is clicked', function() {
    //         spyOn(scriptHelperFunctions, 'switchOffAnswer').and.callThrough();
    //         spyOn(scriptHelperFunctions, 'switchOffStreakMessage');
    //         inputField.value = "5";
    //         submitBtn.click();
    
    //         expect(scriptHelperFunctions.switchOffAnswer).toHaveBeenCalled();
    //         expect(scriptHelperFunctions.switchOffStreakMessage).toHaveBeenCalled();
    //     });
    
    //     it('should show an alert when the submit button is clicked with an invalid input', function() {
    //         inputField.value = "hello";
    //         submitBtn.click();
    //         expect(mockWindow.alert).toHaveBeenCalled();
    //     });
    
    //     it('should handle a correct answer correctly', function() {
    //         spyOn(scriptHelperFunctions, 'switchOffAnswer');
    //         spyOn(scriptHelperFunctions, 'switchOffStreakMessage');
    //         spyOn(scriptHelperFunctions, 'showCorrectMessage');
    //         spyOn(scriptHelperFunctions, 'showAnswer');
    //         spyOn(jamBuddy, 'checkAnswer').and.returnValue(true);
    
    //         inputField.value = "5";
        
    //         submitBtn.click();
    
    //         expect(scriptHelperFunctions.switchOffAnswer).toHaveBeenCalled();
    //         expect(scriptHelperFunctions.switchOffStreakMessage).toHaveBeenCalled();
    //         expect(scriptHelperFunctions.showCorrectMessage).toHaveBeenCalled();
    //         expect(scriptHelperFunctions.showAnswer).toHaveBeenCalled();
    //         expect(streakCounter).toBe(1);
    //         expect(submitBtn.disabled).toBe(true);
    //     });
    
    //     it('should call showAnswer with the correct arguments when the submit button is clicked', function() {
    //         spyOn(scriptHelperFunctions, 'showAnswer').and.stub();
    //         jamBuddy.setCurrentNotes(["A", "D"]);
    //         inputField.value = "5";
    //         submitBtn.click();
    //         expect(scriptHelperFunctions.showAnswer).toHaveBeenCalledWith(document, "A", "D", jamBuddy);
    //     });
    
    //     it('should handle an incorrect answer correctly', function() {
    //         spyOn(scriptHelperFunctions, 'switchOffAnswer');
    //         spyOn(scriptHelperFunctions, 'switchOffStreakMessage');
    //         spyOn(scriptHelperFunctions, 'showIncorrectMessage');
    //         spyOn(jamBuddy, 'checkAnswer').and.returnValue(false);
    
    //         inputField.value = "5";
        
    //         submitBtn.click();
    
    //         expect(scriptHelperFunctions.switchOffAnswer).toHaveBeenCalled();
    //         expect(scriptHelperFunctions.switchOffStreakMessage).toHaveBeenCalled();
    //         expect(scriptHelperFunctions.showIncorrectMessage).toHaveBeenCalled();
    //         expect(streakCounter).toBe(0);
    //         expect(submitBtn.disabled).toBe(false);
    //     });
    
    // });

});

