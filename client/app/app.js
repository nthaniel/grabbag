var app = angular.module('grabbag', []);

app.controller('AppController', function($scope, Results, Weather, Timer, Clear) {

  $scope.query = '';

  $scope.results = [];

  $scope.submitHandler = function() {
    Results.sendQuery($scope.query)
    .then(function(res) {
      if (res.weather) {
        res.weather = JSON.parse(res.weather);
        $scope.results.push(Weather(res.weather));
      } else if (res.timer) {
        Timer.addTimer(res.timer);
      } else if (res.clear !== undefined) {
        Clear(res.clear);
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

app.factory('Weather', function() {
  return function(weather) {
    return weather.name + ': ' + weather.main.temp + 'ºF and ' + weather.weather[0].description;
  }
})

app.factory('Timer', function() {
  var Timer = {};
  Timer.addTimer = function(time) {

    var future = new Date();
    console.log(time[1]);
    time[1][0] === 'm' ? future = future.setMinutes(future.getMinutes() + time[0]).toString()
    : future = future.setSeconds(future.getSeconds() + time[0]).toString();

    var $target = $('body');

    var $div = `<my-timer class="widget timer" draggable endtime="(function() {return ` + future + `})"></my-timer>`;

    angular.element($target).injector().invoke(function($compile) {
      var $scope = angular.element($target).scope();
      $target.append($compile($div)($scope));
    });

  };
  return Timer;
})

app.factory('Clear', function() {
  return function(toClear) {
    if (toClear === 'all' || toClear === '') {
      $('.widget').remove();
    } else {
      $('.' + toClear).remove();
    }
  }
})

app.directive('draggable', function() {
  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {
      var options = scope.$eval(attrs.draggable);
      elm.draggable(options);
    }
  };
});

app.directive('myTimer', ['$interval', function($interval) {

  function link(scope, element, attrs) {
    var timeoutId;
    var endtime = eval(attrs.endtime)();

    function getTimeRemaining() {
      var t = endtime - Date.parse(new Date());
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor((t / 1000 / 60) % 60);

      seconds = seconds.toString();
      seconds.length === 2 ? seconds = seconds : seconds = '0' + seconds;

      minutes = minutes.toString();
      minutes.length > 1 ? minutes = minutes : minutes = '0' + minutes;

      return {
        'total': t,
        'minutes': minutes,
        'seconds': seconds
      };
    }

    function initializeClock() {

      function updateClock() {
        var t = getTimeRemaining();

        element.text(t.minutes + ':' + t.seconds);

        if (t.total <= 1000) {
          window.alert('Time is up!');
          element.remove();
          scope.$destroy()
        }
      }

      updateClock();

      timeoutId = $interval(function() {
        updateClock(); // update DOM
      }, 1000);
    }

    initializeClock();

    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });
  }

  return {
    link: link
  };
}]);