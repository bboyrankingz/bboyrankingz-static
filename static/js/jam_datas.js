var app = angular.module("bboy", ['facebook', 'angular.filter', 'truncate', 'angularMoment', 'angucomplete-alt']);

app.controller("Profile", function($scope, $http) {

  var input = [];
  input.push(new Object())
  var i = 0;

  pk = angular.element('#pk').text()
  $scope.type = 'Judge'

  $http.get('/events/jamtime/' + pk + '.json').
      success(function(data, status, headers, config) {
        $scope.allmembers = data["members"];
        if(data["jam_times"])
         {
            $http.get('/events/jamtime.json?ordering=-start&jam_times__slug=' + data["jam_times"] + '&end_time=' + data["start"].substr(0, data["start"].indexOf('T')))
                .success(function(data, status, headers, config) {
                    $scope.past_events = data;
            });
         }
    });
    console.log($scope.jam)

  $scope.title = angular.element('#title').text().toLowerCase();

  $http.get('/media/list.json?tags=' + $scope.title)
    .success(function(data, status, headers, config) {
     $scope.medias = data;
  });

    $scope.additems = function (selected) {
      selected.originalObject["person_type"] = $scope.type
      selected.originalObject["name"] = selected.originalObject["title"]
      selected.originalObject["title"] = ""
      $scope.allmembers.unshift(selected.originalObject);
    };

    $scope.input_change = function (selected) {
      input[i]["name"] = selected
      input[i]["title"] = selected
    };

    $scope.checkIfEnter = function($event){
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
        input[i]["person_type"] = $scope.type
        input[i]["get_absolute_url"] = ""
        input[i]["thumbnail"] = "/site_media/static/img/unknow_user.png"
        $scope.allmembers.unshift(input[i]);
        input.push(new Object());
        i = i + 1;
    }

  };

    $scope.removeItem = function(index){
      $scope.allmembers.splice($scope.allmembers.indexOf(index), 1);
    };

    $scope.push = function(){
      $http.defaults.xsrfCookieName = 'csrftoken';
      $http.defaults.xsrfHeaderName = 'X-CSRFToken';

      $http({
          url: '/events/jamtime/' + pk + '/',
          data:  {'members': $scope.allmembers},
          method: 'POST'
        }).
        success(function(data) {
        }).
        error(function(data) {
        });



    };

});

