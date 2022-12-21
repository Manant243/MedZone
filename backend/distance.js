const request = require("request");
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibWFuYW50IiwiYSI6ImNsYnh5dWdvdTFjYWMzbm55Y3FzOGdodGoifQ.JZTSHeSgM2xXetzpR1BCQA";

async function getDistancedata(doctorlocation, location) {
  
    // Replace ADDRESS_A and ADDRESS_B with the actual addresses
    const addressA = doctorlocation;
    const addressB = location;
  
    // Geocode the addresses to get their coordinates
    const geocodeResponseA = await new Promise((resolve, reject) => {
      request(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          addressA
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`,
        (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body));
          }
        }
      );
    });
    const coordsA = geocodeResponseA.features[0].geometry.coordinates;
  
    const geocodeResponseB = await new Promise((resolve, reject) => {
      request(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          addressB
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`,
        (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body));
          }
        }
      );
    });
    const coordsB = geocodeResponseB.features[0].geometry.coordinates;
  
    // Calculate the distance between the two coordinates using the Directions API
    const directionsResponse = await new Promise((resolve, reject) => {
      request(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsA[0]},${
          coordsA[1]
        };${coordsB[0]},${coordsB[1]}?access_token=${MAPBOX_ACCESS_TOKEN}`,
        (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(body));
          }
        }
      );
    });
    const distance = directionsResponse.routes[0].distance;
  
    return distance;
}

module.exports = {
    getDistancedata
};
  

  