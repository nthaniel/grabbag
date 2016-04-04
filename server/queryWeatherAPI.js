var request = require('request');
var API_KEY = require('../.config').API_KEY;


module.exports = function (query) {
  return new Promise(function(resolve, reject) {
    request.get(`http://api.openweathermap.org/data/2.5/weather?zip=${query},us&units=imperial&appid=${API_KEY}`, function(err, res, body) {
      err ? reject(err) : resolve(body);
    });
    
  })
}