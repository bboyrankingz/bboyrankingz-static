var app = angular.module("bboy", ['facebook', 'angular.filter', 'truncate', 'angularMoment', 'angucomplete-alt']);

app.controller("Media", function($scope, $http) {

   $scope.title = angular.element('#title').text().toLowerCase();
        $http.get('/media/list.json?tags=' + $scope.title)
        .success(function(data, status, headers, config) {
            $scope.medias = data;
        });

});