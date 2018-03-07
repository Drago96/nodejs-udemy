const request = require("request");

function geocodeAddress(address, callback) {
    const encodedAddress = encodeURIComponent(address);

    const locationUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyDsTSQ6_JffAdn2QHUmFE9lTpXj1hPRFUE`;

    request({
        url: locationUrl,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback("Unable to connect to Google servers.");
        } else if (body.status === "ZERO_RESULTS") {
            callback("Unable to find that address.");
        } else if (body.status === "OK") {
            const resultLocation = body.results[0];
            const location = resultLocation.geometry.location;
            callback(undefined, {
                address: resultLocation.formatted_address,
                latitude: location.lat,
                longitude: location.lng
            });
        }
    });
}

module.exports.geocodeAddress = geocodeAddress;
