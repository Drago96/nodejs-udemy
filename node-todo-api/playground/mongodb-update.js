const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
    if (err) {
        return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");

    const db = client.db("TodoApp");

    db.collection("Todos")
        .findOneAndUpdate({ _id: new ObjectID("5aadaa9e435c22db00f61ec8") },
            { $set: { text: "Something new to do" } },
            { returnOriginal: false })
        .then((result) => {
            console.log(result);
        });

    db.collection("Users")
        .findOneAndUpdate({ _id: new ObjectID("5aadad28435c22db00f61fab") },
            { $inc: { age: 1 }, $set: {name: "Drago"} },
            { returnOriginal: false })
        .then((result) => {
            console.log(result);
        });

    client.close();
});
