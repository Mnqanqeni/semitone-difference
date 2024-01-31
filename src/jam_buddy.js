class JamBuddy {
    static musicalElements = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    currentNotes = [];

    randomizeCurrentNotes() {
        let shuffleList= ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
        for (let i = shuffleList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffleList[i], shuffleList[j]] = [shuffleList[j], shuffleList[i]];
        }
        this.currentNotes = [shuffleList[0], shuffleList[1]];

        return this.currentNotes;
    }

    getCurrentNotes() {
        return this.currentNotes;
    }

    checkAnswer(distance) {
        const index1 = JamBuddy.musicalElements.indexOf(this.getCurrentNotes()[0]);
        const index2 = JamBuddy.musicalElements.indexOf(this.getCurrentNotes()[1]);

        if (index1 === -1 || index2 === -1) {
            return null;
        }
        console.log(index1)
        console.log(index2)
        const absDiff = Math.abs(index1 - index2);
        const cyclicDistance = [absDiff, JamBuddy.musicalElements.length - absDiff];
        console.log(cyclicDistance)
        return cyclicDistance.includes(distance);
    }

    setCurrentNotes(arrayNotes) {
        if (arrayNotes.length === 2) {
            this.currentNotes = arrayNotes;
        } else {
            console.error("Invalid array length. Set exactly 2 musical elements.");
        }
    }
}

buddy = new JamBuddy()
console.log(buddy.randomizeCurrentNotes())
console.log(buddy.getCurrentNotes()) // let's say this returns ['C','D#']
console.log(buddy.checkAnswer(1)) // This will return a boolean False
console.log(buddy.checkAnswer(2)) // False again
console.log(buddy.checkAnswer(3)) // This is correct, so it returns True
console.log(buddy.checkAnswer(9)) // This is also correct => True

console.log(buddy.setCurrentNotes(['A','A#']))
console.log(buddy.getCurrentNotes()) // this will return ['A','A#']
console.log(buddy.checkAnswer(1))
console.log(buddy.checkAnswer(11)) // returns a boolean True
//["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]