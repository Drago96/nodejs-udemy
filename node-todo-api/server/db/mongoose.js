const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const mongooseUrl = process.env.MONGODB_URI
    || "mongodb://localhost:27017/TodoApp";
mongoose.connect(mongooseUrl);

module.exports = {
    mongoose
};
