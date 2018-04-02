const socket = io();

socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("newMessage", (message) => {
    const li = $("<li>");
    li.text(`${message.from}: ${message.text}`);

    $("#messages").append(li);
});

// socket.emit("createMessage", {
//     from: "Me",
//     text: "Hi"
// }, function (message) {
//     console.log("Message arrived");
//     console.log(message);
// });

$("#message-form").submit((e) => {
    e.preventDefault();

    socket.emit("createMessage", {
        from: "User",
        text: $("input[name=message]").val()
    }, function () {

    });
});
