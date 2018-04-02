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

socket.on("newLocationMessage", (message) => {
    const li = $("<li>");
    const a = $(`<a target="_blank">My current location</a>`);
    a.attr("href", message.url);
    li.text(`${message.from}: `);
    li.append(a);

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

    const messageTextBox = $("input[name=message]");

    socket.emit("createMessage", {
        from: "User",
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val("");
    });
});

const locationButton = $("#send-location");
locationButton.click(() => {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported by your browser");
    }

    locationButton.attr("disabled", "disabled").text("Sending location...");

    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr("disabled").text("Send location");
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttr("disabled").text("Send location");
        alert("Unable to fetch location");
    });
});
