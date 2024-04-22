const { JamBuddy } = require("../src/jam_buddy");

describe("JamBuddy", function() {
  let buddy;

  beforeEach(function() {
    buddy = new JamBuddy();
  });

  it("should randomize current notes", function() {
    buddy.randomizeCurrentNotes();
    expect(buddy.getCurrentNotes()).not.toEqual([null, null]);
  });

  it("should check the answer", function() {
    buddy.randomizeCurrentNotes();
    let [noteOne, noteTwo] = buddy.getCurrentNotes();
    let correctAnswer = buddy.calculateDistance(noteOne, noteTwo);
    expect(buddy.checkAnswer(correctAnswer)).toBe(true); // Correct answer
    expect(buddy.checkAnswer(correctAnswer + 1)).toBe(false); // Incorrect answer
  });
});

describe("Event Listeners", function() {
  let buddy, firstNote, secondNote, randomBtn, distanceButtons;

  beforeEach(function() {
    buddy = new JamBuddy();

    document.body.innerHTML = `
      <div id="first-note"></div>
      <div id="second-note"></div>
      <button id="randomize-btn"></button>
      <div id="distance-btn">
        <button></button>
        <button></button>
        <button></button>
      </div>
      <div id="correctMessage"></div>
      <div id="incorrectMessage"></div>
      <div id="streak"><div id="streak-number"></div></div>
    `;
    
    firstNote = document.getElementById("first-note");
    secondNote = document.getElementById("second-note");
    randomBtn = document.getElementById("randomize-btn");
    distanceButtons = document.getElementById("distance-btn").querySelectorAll("button");
  });

  it("should update notes when randomize button is clicked", function() {
    buddy.randomizeCurrentNotes();
    let [noteOne, noteTwo] = buddy.getCurrentNotes();
    randomBtn.click();
    expect(firstNote.innerText).toBe(noteOne);
    expect(secondNote.innerText).toBe(noteTwo);
  });

  it("should handle distance button click events", function() {
    spyOn(buddy, 'checkAnswer');
    spyOn(window, 'showCorrectMessage');
    spyOn(window, 'showIncorrectMessage');
    spyOn(window, 'showStreakMessage');
    spyOn(window, 'switchOffStreakMessage');

    buddy.randomizeCurrentNotes();
    let [noteOne, noteTwo] = buddy.getCurrentNotes();
    let correctAnswer = buddy.calculateDistance(noteOne, noteTwo);

    distanceButtons[correctAnswer - 1].click();
    expect(buddy.checkAnswer).toHaveBeenCalledWith(correctAnswer);
    expect(window.showCorrectMessage).toHaveBeenCalled();
    expect(window.showStreakMessage).toHaveBeenCalled();

    distanceButtons[(correctAnswer % 3)].click();
    expect(buddy.checkAnswer).toHaveBeenCalledWith(correctAnswer + 1);
    expect(window.showIncorrectMessage).toHaveBeenCalled();
    expect(window.switchOffStreakMessage).toHaveBeenCalled();
  });
});
