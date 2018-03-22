const { ObjectID } = require("mongodb");
const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

Todo.remove({})
    .then((result) => console.log(result));

Todo.findByIdAndRemove("myId")
    .then(doc => console.log(doc));

Todo.findOneAndRemove({ _id: "myId" })
    .then(doc => console.log(doc));
