var app = angular.module("bboy", ['facebook', 'angular.filter', 'truncate', 'angularMoment', 'angucomplete-alt']);

app.controller("Profile", function($scope, $http) {

  slug = angular.element('#slug').text()
  $scope.title = angular.element('#title').text().toLowerCase();
  var now = new Date();
  $scope.now = now.getFullYear()
  $scope.maxYear  = now.getFullYear()
  var awards = [];

  $http.get('/bboys/apis/' + slug + '.json').
      success(function(data, status, headers, config) {
        $scope.allmembers = data["group_memberships"];
        data["tournamentroundplayers_set"].forEach(function(entry) {
        if(entry["round_level"] == 1)
        {
          awards.push(entry);
        }
        });
        data["jam_memberships"].forEach(function(entry) {
          awards.push(entry);
        });
        $scope.awards = awards;
    });

  $http.get('/media/list.json?tags=' + $scope.title)
    .success(function(data, status, headers, config) {
        $scope.medias = data;
    });


  $scope.show_awards = function () {
      get_datas('/tournaments/elo.json?user=' + slug);
  };

  function get_datas(url)
  {
       $http.get(url).
          success(function(data, status, headers, config) {
            $scope.allawards = data;
        });
  }

   $scope.previous_page = function (url) {
    get_datas(url);
  };

   $scope.next_page = function (url) {
    get_datas(url);
  };

  $scope.greaterThan = function(year){
    return function(item){
      return item["$key"] <= year;
    }
  }

  $scope.updateMaxYear = function(year){
     $scope.maxYear = year
  }


});

