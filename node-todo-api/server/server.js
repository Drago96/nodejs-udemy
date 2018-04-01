require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// TODO routes
app.post("/todos", authenticate, (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get("/todos", authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos });
    }, (e) => res.status(400).send(e));
});

app.get("/todos/:id", authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(400).send("ID not valid");
        return;
    }

    Todo.findOne({ _id: id, _creator: req.user._id })
        .then((todo) => {
            if (!todo) {
                res.status(404).send("Todo not found");
                return;
            }
            res.send({ todo });
        })
        .catch(e => res.status(400).send(e));
});

app.delete("/todos/:id", authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(400).send("ID not valid");
        return;
    }

    Todo.findOneAndRemove({ _id: id, _creator: req.user._id })
        .then((todo) => {
            if (!todo) {
                res.status(404).send("Todo not found");
                return;
            }
            res.send({ todo });
        })
        .catch(e => res.status(400).send(e));
});

app.patch("/todos/:id", authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(400).send("ID not valid");
        return;
    }

    const body = _.pick(req.body, ["text", "completed"]);

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, {
        $set: body
    }, {
            new: true
        }).then((todo) => {
            if (!todo) {
                res.status(404).send("Todo not found");
                return;
            }

            res.send({ todo });
        }).catch(e => res.status(400).send(e));
});

// User routes
app.post("/users", (req, res) => {
    const body = _.pick(req.body, ["email", "password"]);
    const user = new User(body);

    user.save().then((user) => {
        return user.generateAuthToken();
    })
        .then(token => res.header("x-auth", token).send(user))
        .catch(e => res.status(400).send(e));
});

app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

app.post("/users/login", (req, res) => {
    const body = _.pick(req.body, ["email", "password"]);

    const email = body.email;
    const password = body.password;

    User.findByCredentials(email, password)
        .then(user => {
            user.generateAuthToken()
                .then(token => {
                    res.header("x-auth", token).send(user);
                });
        }).catch(e => res.status(400).send(e));
});

app.delete("/users/me/token", authenticate, (req, res) => {
    req.user.removeToken(req.token)
        .then(() => {
            res.status(200).send();
        })
        .catch(() => res.status(400).send());
});

app.listen(port, () => {
    console.log("Started on port", port);
});

module.exports = {
    app
};
