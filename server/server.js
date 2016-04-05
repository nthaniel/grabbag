var express = require('express');
var bodyParser = require('body-parser');
require("babel-register")({
  presets: ['es2015']
});
var weatherAPI = require('./queryWeatherAPI');
var string2num = require('./stringToNumber')

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

var weatherRegex = /\w*weather\sin\s([\w\s]*)/i;
var timerRegex = /(\d+|\w+)\s(minute[s]?|second[s]?)/i;
var clearRegex = /clear\s?(\w*)/i;
var colorRegex = /^make\sit\s(\w*)/i;


app.post('/query', function(req, res, error) {
  console.log('req.body was', req.body);
  var query = req.body.query;

  var weather = weatherRegex.exec(query);
  var timer = timerRegex.exec(query);
  var clear = clearRegex.exec(query);
  var color = colorRegex.exec(query);

  if (weather) {
    weatherAPI(weather[1])
    .then(function(body) {
      console.log('received this from weather API:', body);
      res.send({weather: body});
    })
    .catch(console.log.bind(console))
  } else if (timer) {
    timer[1] = string2num(timer[1]);
    res.send({timer: [timer[1], timer[2]]}); 
  } else if (clear) {
    res.send({clear: clear[1]});
  } else if (color) {
    res.send({color: color[1]});
  } else {
    // search database for query
      // if it's there, increment frequency by one
      // otherwise, add it to database
    res.send();
  }

});

app.listen(1337);
console.log('Listening on port 1337');

module.exports = app;