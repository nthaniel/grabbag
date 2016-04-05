var app = angular.module('grabbag', []);

app.controller('AppController', function($scope, Results, Weather, Timer, Clear) {

  $scope.query = '';

  $scope.format = 'h:mm:ss a';
  $scope.timerFormat = 'mm:ss';

  $scope.results = [];

  $scope.submitHandler = function() {
    Results.sendQuery($scope.query)
    .then(function(res) {
      console.dir(res);
      console.log(res.weather);
      if (res.weather) {
        res.weather = JSON.parse(res.weather);
        $scope.results.push(Weather(res.weather));
      } else if (res.timer) {
        // $scope.results.push(res.timer[0] + ' ' + res.timer[1]);
        console.log(res.timer);
        Timer.addTimer(res.timer);
      } else if (res.clear) {
        console.log('hi, clearing now');
        Clear();
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
    time[1][0] === 'm' ? future = future.setMinutes(future.getMinutes() + time[0]).toString()
    : future = future.setSeconds(future.getSeconds() + time[0]).toString();
    console.log(future);

    var $target = $('body');

    var $div = `<my-timer class="widget timer" draggable endtime="(function() {return ` + future + `})"></my-timer>`;

    angular.element($target).injector().invoke(function($compile) {
      var $scope = angular.element($target).scope();
      $target.append($compile($div)($scope));
    // Finally, refresh the watch expressions in the new element
      // $scope.$apply();
    });

  };
  return Timer;
})

app.factory('Clear', function() {
  return function() {
    console.log('widgets are:', $('.widget'));
    $('.widget').remove();
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

    var endtime = eval(attrs.endtime)();

    console.log('endtime is', endtime);

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
          clearInterval(timeinterval);
          window.alert('Time is up!');
          element.remove();
        }
      }

      updateClock();
      var timeinterval = setInterval(updateClock, 1000);

      // start the UI update process; save the timeoutId for canceling
      timeoutId = $interval(function() {
        updateClock(); // update DOM
      }, 1000);
    }

    initializeClock();


    // function updateTime() {
    //   var date = new Date();
    //   date.setMinutes(minutes);
    //   date.setSeconds(seconds);
    //   element.text(dateFilter(date, timerFormat));
    // }

    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });

    // start the UI update process; save the timeoutId for canceling
    // timeoutId = $interval(function() {
    //   updateTime(); // update DOM
    // }, 1000);
  }

  return {
    link: link
  };
}]);