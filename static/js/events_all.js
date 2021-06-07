var app = angular.module("bboy", ['facebook', 'iso.directives', 'infinite-scroll', 'angucomplete-alt']);

app.controller("JamTime", function($scope, $http, $location, $timeout) {

    $('#id-time-start').datetimepicker({});

    $('#id-time-start').on('changeDate', function(ev){
        date = ev.date.getFullYear() + "-" + (ev.date.getMonth() + 1) + "-" + ev.date.getDate();
        update();
    });


    var s=angular.element('#portfolio-item-container').scope();
    $scope.ordering =  "Upcoming"
    $scope.point = ""
    $scope.tags = ""
    var now = new Date();
    date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

    $scope.showPosition = function (position){
        $scope.$apply();
        $scope.point = '&point=' + position.coords.longitude + ',' + position.coords.latitude + '&dist=100000';
        update();
    }

    $scope.showError = function (){
        $scope.$apply();
        update();
    }

    $scope.input_change = function (selected) {
        $scope.point = '&point=' + selected.originalObject.lon + ',' + selected.originalObject.lat + '&dist=100000';
        update();
    };

    $scope.getLocation = function () {
        if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        }
    }

    $scope.update = function() {
        update();
    };

    $scope.getLocation();

    $http.get('/events/jam.json?ordering=start&start_time=' + date).
      success(function(data, status, headers, config) {
        $scope.jam = data;
      });

    function update(){
        s.items = [];
        $scope.busy = false;
        tags = ($scope.tags ? "&tags=" + $scope.tags : "");
        $scope.reverse = ($scope.ordering != "Upcoming" ? true : false);
        date_filter = ($scope.ordering != "Upcoming" ? "&end_time=" : "&start_time=");
        ordering = ($scope.ordering != "Upcoming" ? "&ordering=-start" : "&ordering=start");
        next('/events/jamtime.json?' + tags + ordering + date_filter + date + $scope.point, false);
    }

    function next(url, more)
    {
        if ($scope.busy) return;
        $scope.busy = true;

        $http({method:"GET", url:url}).then(function(result){
            if(s.items.length == 0 || more) {
                var items = result.data.results;
                $scope.carousels = result.data.carousels;
                $scope.count = result.data.count
                $scope.after = result.data.next;
                items.forEach(function(entry) {
                    s.items.push(entry);
                });
                $timeout(function() {
                    $scope.busy = false;
                });
            }
     
        });
    }

    $scope.next = function(url){
        next(url, true);
    };

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

 



