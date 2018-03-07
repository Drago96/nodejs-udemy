const yargs = require("yargs");

const geocode = require("./geocode/geocode");
const weather = require("./weather/weather");

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
geocode.geocodeAddress(address, (errorMessage, results) => {
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        console.log(results.address);
        weather.getWeather(results.latitude, results.longitude,
            (errorMessage, weatherResults) => {
                if (errorMessage) {
                    console.log(errorMessage);
                } else {
                    console.log(`It's currently ${weatherResults.temperature}. `
                        + `It feels like ${weatherResults.actualTemperature}`);
                }
            });
    }
});
