const request = require("request");

function getWeather(latitude, longitude, callback) {
    const weatherUrl = `https://api.darksky.net/forecast/6de63b846fdc67f9934b19dd35494f6d/${latitude},${longitude}`;

    request({
        url: weatherUrl,
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const currently = body.currently;
            callback(undefined, {
                temperature: currently.temperature,
                actualTemperature: currently.apparentTemperature
            });
        } else {
            callback("Unable to fetch weather");
        }
    });
}

module.exports.getWeather = getWeather;
