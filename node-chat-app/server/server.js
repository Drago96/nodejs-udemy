const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const { generateMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "..", "public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
    console.log("New user connected");

    socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));

    socket.broadcast.emit("newMessage", generateMessage("Admin", "A new user joined the chat"));

    socket.on("createMessage", (message, callback) => {
        console.log(message);
        io.emit("newMessage", generateMessage(message.from, message.text));
        callback("This is an acknowledgement from the server");

        // socket.broadcast.emit("newMessage", {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
