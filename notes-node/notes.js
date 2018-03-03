const fs = require("fs");
const fileName = "notes-data.json";

const addNote = (title, body) => {
    const notes = getExistingNotes(
        "Error reading existing notes... creating new notes file."
    );
    const noteExists = doesNoteExist(notes, title);

    if (!noteExists) {
        const note = {
            title,
            body
        };
        notes.push(note);
        saveNotes(notes);
        return note;
    }
};

const getAll = () => getExistingNotes();

const getNote = (title) => {
    const notes = getExistingNotes(
        "Error reading existing notes..."
    );
    const nodesByTitle = notes.filter(n => n.title === title);
    return nodesByTitle[0];
};

const removeNote = (title) => {
    let notes = getExistingNotes(
        "Error reading existing notes..."
    );
    if (notes) {
        const noteExists = doesNoteExist(notes, title);

        if (noteExists) {
            notes = notes.filter(n => n.title !== title);
            saveNotes(notes);
            return true;
        }

        return false;
    }

    return false;
};

const getExistingNotes = (error) => {
    try {
        const notesString = fs.readFileSync(fileName);
        return JSON.parse(notesString);
    } catch (err) {
        console.log(error);
        return [];
    }
};

const printNoteDetails = (note) => {
    console.log("...");
    console.log(`Title: ${note.title}`);
    console.log(`Body: ${note.body}`);
};

const saveNotes = (notes) => fs.writeFileSync(fileName, JSON.stringify(notes));

const doesNoteExist = (notes, title) => notes.some(n => n.title === title);

module.exports = {
    addNote,
    getAll,
    getNote,
    removeNote,
    printNoteDetails
};
