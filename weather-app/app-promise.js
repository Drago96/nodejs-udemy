const yargs = require("yargs");
const axios = require("axios");

const argv = yargs.options({
    address: {
        demand: true,
        alias: "a",
        describe: "Address to fetch weather for",
        string: true
    }
})
    .help()
    .alias("help", "h")
    .argv;

const address = argv.address;
const encodedAddress = encodeURIComponent(address);

const locationUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDsTSQ6_JffAdn2QHUmFE9lTpXj1hPRFUE`;

axios.get(locationUrl)
    .then((response) => {
        if (response.data.status === "ZERO_RESULTS") {
            throw new Error("Unable to find the address.");
        }

        const resultLocation = response.data.results[0].geometry.location;
        const latitude = resultLocation.lat;
        const longitude = resultLocation.lng;

        const weatherUrl = `https://api.darksky.net/forecast/6de63b846fdc67f9934b19dd35494f6d/${latitude},${longitude}`;
        return axios.get(weatherUrl);
    })
    .then((response) => {
        const currently = response.data.currently;
        const temperature = currently.temperature;
        const actualTemperature = currently.apparentTemperature;

        console.log(`It's currently: ${temperature}. ` +
            `It feels like ${actualTemperature}.`);
    })
    .catch((error) => {
        if (error.code === "ENOTFOUND") {
            console.log("Unable to connect to API servers.");
        } else {
            console.log(error.message);
        }
    });
