var app = angular.module("bboy", ['facebook', 'angular.filter', 'truncate', 'angularMoment', 'angucomplete-alt', 'youtube-embed']);

app.controller("Tags", function($scope, $http) {

  moment.locale('en', {
      relativeTime : {
          future: "in %s",
          past:   "%s",
          s:  "Today",
          m:  "Today",
          mm: "Today",
          h:  "Today",
          hh: "Today",
          d:  "Today",
          dd: "%d days ago",
          M:  "a month ago",
          MM: "%d months ago",
          y:  "a year ago",
          yy: "%d years ago"
      }
  });
    $scope.video = angular.element('#url').text()
    var pk = angular.element('#pk').text();
    var jam_id = angular.element('#jam_id').text();
    if (jam_id != "")
    {
      $http.get('/events/jamtime/' + jam_id + '.json').
        success(function(data, status, headers, config) {
          $scope.allmembers = data["members"];
      });
    }

    $http.get('/media/tags_by_pk/' + pk + '.json').
      success(function(data, status, headers, config) {
        $scope.alltags = data.results;
        $scope.user = data.user;
        $scope.is_submitter = data.is_submitter;
        var tags = "";
        angular.forEach($scope.alltags, function(value,index){
          tags = tags + value.title.toLowerCase() + ","
        })
        if (tags != "")
        {
          tags = tags.slice(0, tags.length - 1)
          $scope.tags = tags
          $http.get('/media/list.json?tags=' + $scope.tags)
            .success(function(data, status, headers, config) {
                $scope.medias = data;
            });
        }
    });

    $scope.additems = function (selected) {
      selected.originalObject["submitted_by"] = $scope.user
      $scope.alltags.unshift(selected.originalObject);
    };

    $scope.removeItem = function(index){
      $scope.alltags.splice(index, 1);
    };

    $scope.push = function(){
      $http.defaults.xsrfCookieName = 'csrftoken';
      $http.defaults.xsrfHeaderName = 'X-CSRFToken';

      $http({
          url: '/media/tags_by_pk/' + pk + '/',
          data:  {'tags': $scope.alltags},
          method: 'POST'
        }).
        success(function(data) {
        }).
        error(function(data) {
        });



    };

});





