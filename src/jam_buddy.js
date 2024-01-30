class JamBuddy {
    static musicalElements = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
    currentNotes = [];

    randomizeCurrentNotes() {
        for (let i = JamBuddy.musicalElements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [JamBuddy.musicalElements[i], JamBuddy.musicalElements[j]] = [JamBuddy.musicalElements[j], JamBuddy.musicalElements[i]];
        }
        this.currentNotes = [JamBuddy.musicalElements[0], JamBuddy.musicalElements[1]];
        return this.currentNotes;
    }

    getCurrentNotes() {
        return this.currentNotes;
    }

    checkAnswer(element1, element2) {
        const index1 = JamBuddy.musicalElements.indexOf(element1);
        const index2 = JamBuddy.musicalElements.indexOf(element2);

        if (index1 === -1 || index2 === -1) {
            return null;
        }
        const absDiff = Math.abs(index1 - index2);
        const cyclicDistance = [absDiff, JamBuddy.musicalElements.length - absDiff];

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
