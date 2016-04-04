var app = angular.module('grabbag', []);

app.controller('AppController', function($scope, Results) {

  $scope.query = '';

  $scope.results = [];

  $scope.submitHandler = function() {
    Results.sendQuery($scope.query)
    .then(function(res) {
      console.dir(res);
      console.log(res.weather);
      if (res.weather) {
        res.weather = JSON.parse(res.weather);
        console.log('res.weather is', res.weather);
        console.log('res.weather.name is', res.weather.name);
        $scope.results.push(res.weather.name + ': ' + res.weather.main.temp + 'ºF and ' + res.weather.weather[0].description);
      } else if (res.timer) {
        $scope.results.push(res.timer[0] + ' ' + res.timer[1]);
      }
      $scope.query = '';
    });
  };
});

app.factory('Results', function($http) {
  var Results = {};
  Results.sendQuery = function(query) {
    return $http.post('/query', {query: query})
    .then(function(res) {
      return res.data;
    })
  }
  return Results;
});