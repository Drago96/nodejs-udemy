const moment = require("moment");

const createdAt = 1234567890000;
const date = moment(createdAt);
console.log(date.format("Do MMM YYYY h:mm:ss a"));
