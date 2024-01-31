describe('JamBuddy', () => {
    let buddy;

    beforeEach(() => {
        buddy = new JamBuddy();
    });

    it('should randomize current notes', () => {
        buddy.randomizeCurrentNotes();
        expect(buddy.getCurrentNotes().length).toBe(2);
        expect(JamBuddy.musicalElements).toContain(buddy.getCurrentNotes()[0]);
        expect(JamBuddy.musicalElements).toContain(buddy.getCurrentNotes()[1]);
    });

    it('should set current notes with valid input', () => {
        buddy.setCurrentNotes(['C', 'D#']);
        expect(buddy.getCurrentNotes()).toEqual(['C', 'D#']);
    });

    it('should not set current notes with invalid input', () => {
        spyOn(console, 'error');
        buddy.setCurrentNotes(['C', 'D#', 'F']); 
        expect(console.error).toHaveBeenCalledWith("Invalid array length. Set exactly 2 musical elements.");
        expect(buddy.getCurrentNotes()).toEqual([]);
    });

    it('should check answer correctly for distance 1', () => {
        buddy.setCurrentNotes(['C', 'D#']);
        expect(buddy.checkAnswer(1)).toBe(false);
    });

    it('should check answer correctly for distance 2', () => {
        buddy.setCurrentNotes(['C', 'D#']);
        expect(buddy.checkAnswer(2)).toBe(false);
    });

    it('should check answer correctly for distance 3', () => {
        buddy.setCurrentNotes(['C', 'D#']);
        expect(buddy.checkAnswer(3)).toBe(true);
    });

    it('should check answer correctly for distance 9', () => {
        buddy.setCurrentNotes(['C', 'D#']);
        expect(buddy.checkAnswer(9)).toBe(true);
    });

    it('should handle invalid musical elements in checkAnswer', () => {
        spyOn(console, 'log');
        buddy.setCurrentNotes(['Z', 'A#']); 
        expect(console.log).toHaveBeenCalledWith(-1);
        expect(buddy.checkAnswer(1)).toBe(null);
    });

    it('should handle invalid array length in checkAnswer', () => {
        spyOn(console, 'log');
        buddy.setCurrentNotes(['C']); 
        expect(console.log).toHaveBeenCalledWith('Invalid array length. Set exactly 2 musical elements.');
        expect(buddy.checkAnswer(1)).toBe(null);
    });
});
