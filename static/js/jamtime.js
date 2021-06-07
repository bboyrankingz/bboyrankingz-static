var app = angular.module("bboy", ['facebook', 'infinite-scroll']);

app.controller("JamTime", function($scope, $http, requester) {

    $scope.lat = "0";
    $scope.lng = "0";
    $scope.accuracy = "0";
    $scope.showPosition = function (position){
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
        $scope.$apply();

        $http.get('/events/jamtime.json?point=' + $scope.lng + ',' + $scope.lat + '&dist=100000&ordering=start&start_time=' + date).
            success(function(data, status, headers, config) {
            $scope.near_me = data;
        });

    }

    $scope.getLocation = function () {
        if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    }

    $scope.getLocation();

    var now = new Date();
    var date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

  $http.get('/events/jam.json?ordering=start&start_time=' + date).
    success(function(data, status, headers, config) {
      $scope.jam = data;
    });

  var w = moment(now);
  w.add(1, 'weeks');
  next_week = w.toDate();
  var weekend = next_week.getFullYear() + "-" + (next_week.getMonth() + 1) + "-" + next_week.getDate();

  $http.get('/events/jamtime.json?ordering=start&start_time=' + date + '&end_time=' + weekend).
    success(function(data, status, headers, config) {
      $scope.weeks = data;
    });

  var l = moment(now);
  l.add(-2, 'weeks');
  last_week = l.toDate();
  var last = last_week.getFullYear() + "-" + (last_week.getMonth() + 1) + "-" + last_week.getDate();

  $http.get('/events/jamtime.json?ordering=-start&end_time=' + date).
    success(function(data, status, headers, config) {
      $scope.past = data;
    });

  var i = 0;
  var k=0;
  var params = new Object();
  var months = [];
  for(j=1; j<=12; j++)
  {
    i+=1;
    imonth = now.getMonth() + i;
    if(imonth>12)
    {
        i=1;
        k+=1;
        imonth = 1;
    }
    var month = String(imonth);
    if(month.length == 1)
    {
        month = "0" + month;
    }
    var year = now.getFullYear() + k;
    var start = year + "-" + month + "-01";
    var start_date = new Date(start);
    var m = moment(start_date);
    m.add(1, 'months');
    next_month = m.toDate();
    var end = next_month.getFullYear() + "-" + (next_month.getMonth() + 1) + "-" + next_month.getDate();
    months.push(start);
    params[start] = "start_time=" + start + "&end_time=" + end;
  }
  months.push("next year")
  params["next year"] = "start_time=" + end;

  $scope.periods = {}
  $scope.loadMore = function() {
     if(months.length >0)
     {
        month = months.shift()
        requester.getData('/events/jamtime.json?ordering=start&' + params[month], month)
        .then(function(result) {  // this is only run after $http completes
          $scope.periods[result[1]] = result[0];
        });
     }
  }
    $scope.push = function(){
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        toastr.success("Facebook event post for validation...");
        $http({
          url: '/events/jamtime.json',
          data:  {'url': $scope.url},
          method: 'POST'
        }).
        success(function(data) {
               //TODO REMOVE THIS MANUAL REDIRECTION
               toastr.success("Thank you.");
              $http.get(data["url"]).
                success(function(data, status, headers, config) {
                  window.location.href = data["get_absolute_url"]
                });
        }).error(function(data) {
            toastr.error("Cant create your facebook event.");
            window.location.href = data["url"]
        });
    };
});

app.factory('requester', function($http) {

    var getData = function($url, $month) {

        return $http({method:"GET", url:$url}).then(function(result){
            return [result.data, $month];
        });
    };
    return { getData: getData };
});

 



