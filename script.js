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
            delayedCode();
            showStreakMessage();
    });
}


// Get references to the message div
const correctMessage = document.getElementById("correctMessage");
const incorrectMessage = document.getElementById("incorrectMessage");
const streak=document.getElementById("streak");
console.log(streak);
let streakNumber=document.getElementById("streak-number");
console.log(streakNumber);
// Function to show correct message
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
// Function to show incorrect message
function showIncorrectMessage() {
    incorrectMessage.style.display = "block";
}

function switchMessageOff() {
    correctMessage.style.display = "none";
    incorrectMessage.style.display = "none";
}

function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
async function delayedCode() {
    await delay(2000);
}

let canvas = document.querySelector("canvas");
canvas.width = 1000;
canvas.height = 100;
let ctx = canvas.getContext("2d");

let canvasX = 50; // Starting X position
let canvasY = canvas.height / 2;
ctx.font = "20px Arial";
ctx.fillStyle = "blue";

// Define the starting and ending semitones
let startSemitone = 1; // Start at A#
let endSemitone = 10; // End at G#

// Array of note names
let noteNames = ["A", "A#/Bb", "B", "C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G","G#"];

// Draw note names
for (let i = 0; i <=11; i++) {
    ctx.fillText(noteNames[i], canvasX - 20, canvasY + 20);
    canvasX += 80;
}

// Draw circles
canvasX = 60; // Reset X position
for (let i = 0; i <= 11; i++) {
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 40, 0, Math.PI,true);
    canvasX += 76;
    ctx.strokeStyle = "gold";
    ctx.stroke();
}
