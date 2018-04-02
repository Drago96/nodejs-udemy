const socket = io();

socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("newMessage", (message) => {
    const formattedTime = moment(message.createdAt).format("h:mm a");

    const template = $("#message-template").html();
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $("#messages").append(html);
});

socket.on("newLocationMessage", (message) => {
    const formattedTime = moment(message.createdAt).format("h:mm a");

    const template = $("#location-message-template").html();
    const html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    $("#messages").append(html);
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
    const message = messageTextBox.val();

    if (message === "") {
        return;
    }

    socket.emit("createMessage", {
        from: "User",
        text: message
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
