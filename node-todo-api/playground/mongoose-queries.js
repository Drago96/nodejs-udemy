const { ObjectID } = require("mongodb");
const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// const todoId = "5ab1288112658123f0746c7f";

// if (!ObjectID.isValid(todoId)) {
//     console.log("ID not valid");
// } else {
//     Todo.find({
//         _id: todoId
//     }).then((todos) => {
//         console.log("Todos", todos);
//     }).catch(e => console.log(e));

//     Todo.findOne({
//         _id: todoId
//     }).then((todo) => {
//         console.log("Todo", todo);
//     }).catch(e => console.log(e));

//     Todo.findById(todoId)
//         .then((todo) => {
//             console.log("Todo by id", todo);
//         })
//         .catch(e => console.log(e));
// }

const userId = "5aae615fe3f6e21d702f72de";

if (!ObjectID.isValid(userId)) {
    console.log("ID not valid");
} else {
    User.findById(userId)
        .then(user => {
            if (!user) {
                console.log("Unable to find user");
                return;
            }
            console.log(JSON.stringify(user, undefined, 2));
        })
        .catch(e => console.log(e));
}
