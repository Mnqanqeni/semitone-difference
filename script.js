const { JamBuddy } = require("./src/jam_buddy");
const buddy = new JamBuddy();
let streaks =0;

buddy.randomizeCurrentNotes();
let [noteOne,noteTwo]=buddy.getCurrentNotes();
let firstNote=document.querySelector("#first-note");
let secondNote=document.querySelector("#second-note");
let randomBtn=document.querySelector("#randomize-btn");

firstNote.innerText=noteOne;
secondNote.innerText=noteTwo;

randomBtn.addEventListener("click",()=>{
    buddy.randomizeCurrentNotes()
    let [noteOne,noteTwo]=buddy.getCurrentNotes();
    firstNote.innerText=noteOne;
    secondNote.innerText=noteTwo;

})


const distanceBlock = document.querySelector('#distance-btn');
console.log(distanceBlock);
const distanceButtons = distanceBlock.children;
console.log(distanceButtons);
for (let i = 0; i < distanceButtons.length; i++) {
    distanceButtons[i].addEventListener('click', function() {
            switchOffStreakMessage();
            if(buddy.checkAnswer(i+1)){
                showCorrectMessage();
                buddy.randomizeCurrentNotes()
                let [noteOne,noteTwo]=buddy.getCurrentNotes();
                firstNote.innerText=noteOne;
                secondNote.innerText=noteTwo;
                streaks+=1;
            }else{
                showIncorrectMessage();
                streaks=0;
            }
            delayCode();
    });
}


const correctMessage = document.getElementById("correctMessage");
const incorrectMessage = document.getElementById("incorrectMessage");
const streak=document.getElementById("streak");
console.log(streak);
let streakNumber=document.getElementById("streak-number");
console.log(streakNumber);


function showCorrectMessage() {
    correctMessage.style.display = "block";

}
function showStreakMessage(){
    streakNumber.innerText=streaks;
    streak.style.display="block";
}
function switchOffStreakMessage(){
    streak.style.display="none";
}

function showIncorrectMessage() {
    incorrectMessage.style.display = "block";
}

function switchMessageOff() {
    correctMessage.style.display = "none";
    incorrectMessage.style.display = "none";
}

function delayCode() {
    setTimeout(function() {
        switchMessageOff();
        showStreakMessage();
    }, 500);
}

[noteOne,noteTwo]=buddy.getCurrentNotes();
console.log(noteOne,noteTwo)
console.log(document.querySelector(`#a${JamBuddy.musicalElements[noteOne]}`));
document.querySelector(`#a${JamBuddy.musicalElements[noteOne]}`).style.backgroundColor="red";
console.log(document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`));
document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`).style.backgroundColor="Yellow";
let one=JamBuddy.musicalElements[noteOne];
let two=JamBuddy.musicalElements[noteTwo];

if (one < two) {
    doCount(one, two, document.querySelector("#clockwise-answer"), true);
    doCount(one, two, document.querySelector("#anti-clockwise-answer"), false);
} else {
    doCount(one, two, document.querySelector("#clockwise-answer"), false);
    doCount(one, two, document.querySelector("#anti-clockwise-answer"), true);
}

function doCount(num1, num2, id, clockwise) {
    let count = 1;
    id.innerText = count;
    while (num1 !== num2) {
        id.innerText = count;
        console.log(count);
        if (clockwise) {
            num1 = (num1 + 1) % 11;
        } else {
            num1 = (num1 - 1) % 11; 
        }
        count++;
    }
    id.innerText = count;
}
