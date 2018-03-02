// const obj = {
//     name: "Dragomir"
// };

// const stringObj = JSON.stringify(obj);
// console.log(stringObj);

// const personString = `{"name":"Dragomir", "age": 25}`;
// const person = JSON.parse(personString);
// console.log(person);

const fs = require("fs");
const originalNote = {
    title: "Some title",
    body: "Some body"
};
const originalNoteString = JSON.stringify(originalNote);

fs.writeFileSync("notes.json", originalNoteString);

const noteString = fs.readFileSync("notes.json");
const noteObj = JSON.parse(noteString);

console.log(noteObj);
