var app = angular.module('grabbag', []);

app.controller('AppController', function($scope, Results, Weather, Timer, Clear, Color) {

  $scope.query = '';

  $scope.submitHandler = function() {
    Results.sendQuery($scope.query)
    .then(function(res) {
      if (res.weather) {
        res.weather = JSON.parse(res.weather);
        Weather.addWeather(res.weather);
      } else if (res.timer) {
        Timer.addTimer(res.timer);
      } else if (res.clear !== undefined) {
        Clear(res.clear);
      } else if (res.color) {
        Color(res.color);
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
  var Weather = {};
  Weather.addWeather = function(weather) {
    var $target = $('body');

    var $div = '<my-weather class="widget weather" draggable>' + weather.name + ': ' + weather.main.temp + 'ºF and ' + weather.weather[0].description + '</my-weather>';
    // var $div = '<my-weather class="widget weather" draggable"></my-weather>';

    angular.element($target).injector().invoke(function($compile) {
      console.log('compiling');
      var $scope = angular.element($target).scope();
      $target.append($compile($div)($scope));
    });

  }
  return Weather;
})

app.factory('Timer', function() {
  var Timer = {};
  Timer.addTimer = function(time) {

    var future = new Date();
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

app.factory('Color', function() {
  return function(color) {
    var rgb,
        tmp = document.body.appendChild(document.createElement("div"));

    tmp.style.backgroundColor = color;
    rgb = window.getComputedStyle(tmp, null).backgroundColor;
    rgb = rgb.split('');
    rgb.splice(-1, 0, ', 0.5');
    rgb.splice(3, 0, 'a');
    rgb = rgb.join('');
    document.body.removeChild(tmp);
    $('body').css('background-color', rgb);
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

app.directive('myWeather', function() {
  function link(scope, element, attrs) {

    // element.text(weather.name + ': ' + weather.main.temp + 'ºF and ' + weather.weather[0].description);


    return {
      link: link
    };
  }
});