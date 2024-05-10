const { JamBuddy } = require("./src/jam_buddy");
const confetti = require('canvas-confetti');
const buddy = new JamBuddy();
let streaks =0;

buddy.randomizeCurrentNotes();
let [noteOne,noteTwo]=buddy.getCurrentNotes();
const firstNote=document.querySelector("#first-note");
const secondNote=document.querySelector("#second-note");
const randomBtn=document.querySelector("#randomize-btn");

document.getElementById("restart-btn").addEventListener("click", function() {
    location.reload();
});

document.getElementById("give-up-btn").addEventListener("click", function() {
    clearTheBoxes();
    doTheExplanation(noteOne,noteTwo);
});

firstNote.innerText=noteOne;
secondNote.innerText=noteTwo;

randomBtn.addEventListener("click",()=>{
    location.reload()
    buddy.randomizeCurrentNotes()
    noteOne,noteTwo=buddy.getCurrentNotes();
    firstNote.innerText=noteOne;
    secondNote.innerText=noteTwo;
})


const distanceBlock = document.querySelector('#distance-btn');
const distanceButtons = distanceBlock.children;
for (let i = 0; i < distanceButtons.length; i++) {
    distanceButtons[i].addEventListener('click', function() {
            switchOffAnswer();
            switchOffStreakMessage();
            if(buddy.checkAnswer(i+1)){
                confetti({
                    particleCount: 100,
                    spread: 160,
                    origin: { y: 0.6 }
                  });
                showCorrectMessage();
                showAnswer(noteOne,noteTwo);
                buddy.randomizeCurrentNotes();
                [noteOne,noteTwo]=buddy.getCurrentNotes();
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
    }, 600);
}
function switchOffAnswer(){
    document.querySelector("#explanation").style.display="none";
    document.querySelector(`#a${JamBuddy.musicalElements[noteOne]}`).style.backgroundColor="#ccc";
    document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`).style.backgroundColor="#ccc";
}

function clearTheBoxes(){
    for(let i =0;i<12;i++){
        document.querySelector(`#a${i}`).style.backgroundColor="#ccc";
    }
}
function showAnswer(noteOne,noteTwo){
    document.querySelector("#explanation").style.display="block";
    document.querySelector("#answer-text").style.display="none";
    document.querySelector(`#a${JamBuddy.musicalElements[noteOne]}`).style.backgroundColor="red";
    document.querySelector(`#a${JamBuddy.musicalElements[noteTwo]}`).style.backgroundColor="Yellow";
}
function doTheExplanation(noteOne,noteTwo){
    showAnswer(noteOne,noteTwo);
    document.querySelector("#answer-text").style.display="block";
    const one=JamBuddy.musicalElements[noteOne];
    const two=JamBuddy.musicalElements[noteTwo];

    if (one < two) {
        doCount(one, two, document.querySelector("#clockwise-answer"), function() {
            doCount(two, one, document.querySelector("#anti-clockwise-answer"));
        });
    } else {
        doCount(two, one, document.querySelector("#clockwise-answer"), function() {
            doCount(one, two, document.querySelector("#anti-clockwise-answer"));
        });
    }

}

function doCount(num1, num2, id, callback) {
    let count = 0;
    const totalNotes = 12;

    const intervalId = setInterval(() => {
        let store;
        if (num1 !== num2) {
            num1 = (num1 + 1) % totalNotes;
            count++;

            console.log(`run ${count}`);
            id.innerText = count;
            document.querySelector("#main-counter").innerText=count;
            console.group(`${count}`);
            
            const element = document.querySelector(`#a${num1}`);
            store = element.style.backgroundColor;
            element.style.backgroundColor = "blue";

            setTimeout(() => {
                element.style.backgroundColor = store;
            }, 600);
            
        } else {
            clearInterval(intervalId);
            if (typeof callback === 'function') {
                callback(); 
            }
            document.querySelector("#main-counter").innerText="";
        }
        
    }, 600);
}
