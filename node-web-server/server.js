const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

const app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

app.use((request, response, next) => {
    const now = new Date().toString();
    const method = request.method;
    const url = request.url;
    const log = `${now}: ${method} ${url}`;

    fs.appendFile("server.log", log + "\n", (err) => {
        if (err) {
            console.log("Unable to append to server.log.");
        }
    });
    next();
});

// app.use((request, response, next) => {
//     response.render("maintenance.hbs", {
//        pageTitle: "Maintenance"
//     });
// });

app.use(express.static(__dirname + "/public"));

hbs.registerHelper("getCurrentYear", () => {
    return new Date().getFullYear();
});
hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
});

app.get("/", (request, response) => {
    // response.send("<h1>Hello Express!</h1>");
    response.render("home.hbs", {
        pageTitle: "Home Page",
        welcomeMessage: "Welcome to my website"
    });
});

app.get("/about", (request, response) => {
    response.render("about.hbs", {
        pageTitle: "About page",
    });
});

app.get("/bad", (request, response) => {
    response.send({
        error: "Error handling request"
    });
});

app.listen(3000, () => console.log("Server is up on port 3000"));
