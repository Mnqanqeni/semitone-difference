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
            setTimeout(switchMessageOff, 1000);
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

let canvas = document.querySelector("canvas");
canvas.width = 1000;
canvas.height = 100;
let ctx = canvas.getContext("2d");

// Get the coordinates
let canvasX = canvas.width / 11; // Divide canvas width into 11 parts for 11 circles
let canvasY = canvas.height / 2; // Place circles at the center of the canvas height
ctx.font = "30px Arial";
ctx.fillStyle = "black";
ctx.fillText("'A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#'", canvasX, canvasY);

for (let i = 0; i < 11; i++) {
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 30, 0,Math.PI,true); // Multiply canvasX by (i + 0.5) to place circles equidistantly
    canvasX+=60;
    ctx.strokeStyle = "gold";
    ctx.stroke();
}



