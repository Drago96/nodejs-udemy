const yargs = require("yargs");

const notes = require("./notes");

const titleOptions = {
    describe: "Title of note",
    demand: true,
    alias: "t"
};

const bodyOptions = {
    describe: "Body of note",
    demand: true,
    alias: "b"
};

const argv = yargs
    .command("add", "Add a new note", {
        title: titleOptions,
        body: bodyOptions
    })
    .command("list", "List all notes")
    .command("read", "Read a note", {
        title: titleOptions
    })
    .command("remove", "Remove a note", {
        title: titleOptions
    })
    .help()
    .argv;
const command = argv._[0];

if (command === "add") {
    const note = notes.addNote(argv.title, argv.body);
    if (note) {
        console.log("Note created");
        notes.printNoteDetails(note);
    } else {
        console.log("Note already exists");
    }
} else if (command === "list") {
    const allNotes = notes.getAll();
    console.log(`Notes found: ${allNotes.length}`);
    allNotes.forEach(notes.printNoteDetails);
} else if (command === "read") {
    const note = notes.getNote(argv.title);

    if (note) {
        console.log("Note found");
        notes.printNoteDetails(note);
    } else {
        console.log("Note not found");
    }
} else if (command === "remove") {
    const success = notes.removeNote(argv.title);

    if (success) {
        console.log(`Note removed: ${argv.title}`);
    } else {
        console.log("Could not remove note");
    }
} else {
    console.log("Command not recognised.");
}
