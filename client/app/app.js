var app = angular.module('grabbag', []);

app.controller('AppController', function($scope, Results) {

  $scope.query = '';

  $scope.results = [];

  $scope.submitHandler = function() {
    Results.sendQuery($scope.query)
    .then(function(res) {
      console.dir(res);
      $scope.results.push(res.name + ': ' + res.main.temp);
      $scope.query = '';
    });
  };
});

app.factory('Results', function($http) {
  var Results = {};
  Results.sendQuery = function(query) {
    return $http.post('/city', {query: query})
    .then(function(res) {
      return res.data;
    })
  }
  return Results;
});