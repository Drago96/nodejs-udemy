console.log("Starting app.js...");

const fs = require("fs");
const _ = require("lodash");

const notes = require("./notes");

console.log(process.argv);

const userArguments = process.argv.slice(2);
const command = userArguments[0];
console.log("Command:", command);

if (command === "add") {
    console.log("Adding new note");
} else if (command === "list") {
    console.log("Listing all notes");
} else if (command === "read") {
    console.log("Reading note");
} else if (command === "remove") {
    console.log("Removing note");
} else {
    console.log("Command not recognised.");
}

