const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const mongooseUrl = process.env.MONGODB_URI;
mongoose.connect(mongooseUrl);

module.exports = {
    mongoose
};
