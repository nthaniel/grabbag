var express = require('express');
var bodyParser = require('body-parser');
require("babel-register")({
  presets: ['es2015']
});
var q = require('./queryWeatherAPI');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));


app.post('/city', function(req, res, error) {
  console.log('req.body was', req.body);
  q(req.body.query)
  .then(function(body) {
    console.log('THIS IS WHAT NATHANIEL WANTED', body);
    res.send(body);
  })
  .catch(console.log.bind(console))
});

app.listen(1337);
console.log('Listening on port 1337');

module.exports = app;