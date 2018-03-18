const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

const Todo = mongoose.model("Todo", {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

// const newTodo = new Todo({
//     text: "Cook dinner"
// });

// newTodo.save().then((doc) => {
//     console.log("Saved todo", doc);
// }, (e) => {
//     console.log("Unable to save todo", e);
// });

// const todoWithAllProperties = new Todo({
//     text: "Take an exam",
//     completed: true,
//     completedAt: 123
// });

// todoWithAllProperties.save()
//     .then((doc) => {
//         console.log(JSON.stringify(doc, undefined, 2));
//     }, (e) => {
//         console.log("Unable to save todo", e);
//     });

// const todoWithValidators = new Todo({
//     text: "Walk the dog"
// });

// todoWithValidators.save()
//     .then((doc) => {
//         console.log(JSON.stringify(doc, undefined, 2));
//     }, (e) => {
//         console.log("Unable to save to do", e);
//     });

const User = mongoose.model("User", {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

const myUser = new User({
    email: "  drago@gmail.com  "
});

myUser.save()
    .then((doc) => {
        console.log(JSON.stringify(doc, undefined, 2));
    }, (e) => {
        console.log("Unable to save user", e);
    });
