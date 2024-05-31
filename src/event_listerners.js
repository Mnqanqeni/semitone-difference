function handleRandomize() {
    clearTheBoxes();
    switchOffAnswer();
    ableSubmitAndGiveUpButton();
    document.querySelector("#submit-btn").style.backgroundColor = colorOne;
    document.querySelector("#give-up-btn").style.backgroundColor = colorOne;
    document.getElementById("input-field").disabled = false;
    initNotes(document);
}

function handleSubmit(event) {
    event.preventDefault();
    const distance = parseInt(inputField.value);
    if (isNaN(distance)) {
        alert("Input can't be empty");
        return;
    }

    inputField.value = "";
    switchOffAnswer();
    switchOffStreakMessage();

    if (jamBuddy.checkAnswer(distance)) {
        confetti({
            particleCount: 100,
            spread: 160,
            origin: { y: 0.6 },
        });
        showCorrectMessage();
        showAnswer(noteOne, noteTwo);
        streakCounter++;
        document.querySelector("#submit-btn").disabled = true;
        document.querySelector("#give-up-btn").disabled = true;
        document.querySelector("#submit-btn").style.backgroundColor = colorTwo;
        document.querySelector("#give-up-btn").style.backgroundColor = colorTwo;
        document.getElementById("input-field").disabled = true;
    } else {
        showIncorrectMessage();
        streakCounter = 0;
    }
    delayCode();
}


function handleRestart() {
    reloadPage(window);
}

function handleGiveUp() {
    disableSubmitAndGiveUpButton();
    document.querySelector("#submit-btn").style.backgroundColor = colorTwo;
    document.querySelector("#give-up-btn").style.backgroundColor = colorTwo;
    document.getElementById("input-field").disabled = true;
    clearTheBoxes();
    doTheExplanation(noteOne, noteTwo);
}

function addEventListeners() {
    document.getElementById("restart-btn").addEventListener("click", handleRestart);
    document.getElementById("give-up-btn").addEventListener("click", handleGiveUp);
    document.querySelector("#randomize-btn").addEventListener("click", handleRandomize);
    form.addEventListener("submit", handleSubmit);
}