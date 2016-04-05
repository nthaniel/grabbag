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
// var timerRegex = /^give\sme\s(\d+|\w+)\s(minute[s]?|second[s]?)/i;
var timerRegex = /(\d+|\w+)\s(minute[s]?|second[s]?)/i;
var clearRegex = /clear\s?(\w*)/i;


app.post('/query', function(req, res, error) {
  console.log('req.body was', req.body);
  var query = req.body.query;

  var weatherCity = weatherRegex.exec(query);
  var timer = timerRegex.exec(query);
  var clear = clearRegex.exec(query);

  // console.log(weatherCity);
  // console.log(timer);
  console.log(clear);

  if (weatherCity) {
    weatherAPI(weatherCity[1])
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
  } else {
    res.send();
  }

});

app.listen(1337);
console.log('Listening on port 1337');

module.exports = app;