var app = angular.module("bboy", ['facebook','infinite-scroll', 'angular.filter', 'truncate']);

app.controller("Rankings", function($scope, $http, $location, Reddit) {
  var date = new Date();
  var currentYear = date.getFullYear();
  var nature_map  = {
    "crews"  : 'groups',
    "bboys"     : 'artists'
   };

  var filter_map  = {
    "crews"  : 'group',
    "bboys"     : 'user'
   };

  loc = $location.hash()
  nature_type = (loc ? loc : "crews");
  $scope.nature = nature_type;
  $scope.nature_object = nature_type.slice(0, -1);
  ordering  = ""
  $scope.sort = "";
  $scope.country = "";
  $scope.period = currentYear.toString();
  $scope.sort_name = {"": "ranking", "-maxscore": "sort by max score"};
  $scope.dict_countries = {null: "World"}
  $scope.reddit = new Reddit('/ranking/' + nature_map[nature_type]  + '/' + $scope.period + '/elo.json');

  $scope.update = function() {
        nature = "";
        ordering = ($scope.sort ? "&ordering=" + $scope.sort : "");
        nature_type = ($scope.nature == "crews" ? "crews": "bboys");
        if (!(["crews", "bboys"].indexOf($scope.nature) > -1))
        {
          nature = "&person_types__slug=" + $scope.nature;
          $scope.reddit = new Reddit('/' + nature_type + '/api/' + $scope.period + '.json?' + "spot__country=" + $scope.country + ordering + nature);
        }
        else
        {
          country = ($scope.country ? "&" + filter_map[nature_type] + "__spot__country=" + $scope.country : "");
          ordering = ($scope.sort ? "&ordering="  + ($scope.sort === "created" ? "-" : "") + filter_map[nature_type] + "__" + $scope.sort : "");
          url = '/ranking/' + nature_map[nature_type] + '/' + $scope.period + '/elo.json?' + country + ordering + nature;
          $scope.reddit = new Reddit(url);
        }
        $scope.reddit.nextPage();
  };

  $http.get('/ranking/' + nature_map[nature_type] + '/' + currentYear + '/elo.json?ordering=-max_score').
  success(function(data, status, headers, config) {
    $scope.tops = data.results;
  });

});



