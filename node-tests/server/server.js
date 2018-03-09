const express = require("express");

const app = express();

app.get("/", (request, response) => {
    response
        .status(404)
        .send({
            error: "Page not found!",
            name: "Todo App v1.0"
        });
});

app.get("/users", (request, response) => {
    const users = [];

    for (let i = 1; i <= 3; i++) {
        users.push({
            name: `User ${i}`,
            age: (i * 10) % 50
        });
    }

    response.send(users);
});

app.listen(3000);

module.exports.app = app;
