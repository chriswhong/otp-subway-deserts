//gets otp walksheds for all of the subway stops in NYC

var fs = require('fs'),
  request = require('request'),
  Mustache = require('mustache');

//http://104.131.4.58:8080/otp/routers/default/isochrone?routeId=default&batch=true&fromPlace=40.753499070431374,-73.96957397460938&date=2017/09/25&time=12:00:00&mode=WALK&cutoffSec=900&cutoffSec=1800&cutoffSec=2700&cutoffSec=3600

var stations = JSON.parse(fs.readFileSync('./stations.geojson'));

stations.features.forEach(function(feature, i) {
  getIsochrone(feature.geometry.coordinates, i)
});

//pass in lat/lon as coordinate array, return geoJson IsoChrones for 5, 7.5, and 10 minute walksheds
function getIsochrone(coords, i) {

  var apiCall = Mustache.render('http://104.131.4.58:8080/otp/routers/default/isochrone?routeId=default&batch=true&fromPlace={{lat}},{{lng}}&date=2017/09/25&time=12:00:00&mode=WALK&cutoffSec=300&cutoffSec=450&cutoffSec=600', {
    lat: coords[1],
    lng: coords[0]
  });

  console.log(apiCall)

  request.get(apiCall, function(err, response, data) {
    writeToFile(data, i);
  })
}

function writeToFile(geojson, i) {
  var outputFile = fs.createWriteStream('isochrones/' + i + '.geojson');
  outputFile.write(geojson);
}


