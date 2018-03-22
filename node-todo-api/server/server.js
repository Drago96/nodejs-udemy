const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get("/todos", (req, res) => {
    Todo.find({}).then((todos) => {
        res.send({ todos });
    }, (e) => res.status(400).send(e));
});

app.get("/todos/:id", (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(400).send("ID not valid");
        return;
    }

    Todo.findById(id)
        .then((todo) => {
            if (!todo) {
                res.status(404).send("Todo not found");
                return;
            }
            res.send({ todo });
        })
        .catch(e => res.status(400).send(e));
});

app.delete("/todos/:id", (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(400).send("ID not valid");
        return;
    }

    Todo.findByIdAndRemove(id)
        .then((todo) => {
            if (!todo) {
                res.status(404).send("Todo not found");
                return;
            }
            res.send({ todo });
        })
        .catch(e => res.status(400).send(e));
});

app.patch("/todos/:id", (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(400).send("ID not valid");
        return;
    }

    const body = _.pick(req.body, ["text", "completed"]);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = Date.now().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todos.findByIdAndUpdate(id, {
        $set: body
    }, {
            new: true
        }).then((todo) => {
            if (!todo) {
                res.status(404).send("Todo not found");
            }

            res.send({ todo });
        }).catch(e => res.status(400).send(e));
});

app.listen(port, () => {
    console.log("Started on port", port);
});

module.exports = {
    app
};
