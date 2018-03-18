const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
    if (err) {
        return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");

    const db = client.db("TodoApp");

    // db.collection("Todos")
    //     .deleteMany({text: "Eat lunch"})
    //     .then((result) => {
    //         console.log(result);
    //     });

    // db.collection("Todos")
    //     .deleteOne({text: "Something to do"})
    //     .then(result => {
    //         console.log(result);
    //     });

    // db.collection("Todos")
    //     .findOneAndDelete({completed: true})
    //     .then(result => {
    //         console.log(result);
    //     });

    // db.collection("Users")
    //     .findOneAndDelete({_id: new ObjectID("5aac5366b93d103460a3fb09")})
    //     .then(result => {
    //         console.log(result);
    //     });

    db.collection("Users")
        .deleteMany({name: "Dragomir Proychev"})
        .then(result => {
            console.log(result);
        });

    client.close();
});
