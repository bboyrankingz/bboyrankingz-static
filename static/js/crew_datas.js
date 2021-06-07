var app = angular.module("bboy", ['facebook', 'angular.filter', 'truncate', 'angularMoment', 'angucomplete-alt']);

app.controller("Profile", function($scope, $http) {
    var input = [];
    input.push(new Object())
    var i = 0;

    slug = angular.element('#slug').text()
    var now = new Date();
    $scope.now = now.getFullYear()
    $scope.maxYear  = now.getFullYear()
    var awards = [];
  
    $http.get('/crews/apis/' + slug + '.json')
    .success(function(data, status, headers, config) {
        $scope.allmembers = data["group_members"];
        data["tournamentroundplayers_set"].forEach(function(entry) {
            if(entry["round_level"] == 1)
            {
              awards.push(entry);
            }
        });
        $scope.awards = awards;
        $scope.user = data["user"];
        $scope.is_superuser = data["is_superuser"];
    });

    $scope.title = angular.element('#title').text().toLowerCase();
    $http.get('/media/list.json?tags=' + $scope.title)
    .success(function(data, status, headers, config) {
        $scope.medias = data;
    });

    $scope.additems = function (selected) {
      selected.originalObject["submitted_by"] = $scope.user
      selected.originalObject["name"] = selected.originalObject["title"]
      selected.originalObject["title"] = selected.originalObject["title"]
      $scope.allmembers.unshift(selected.originalObject);
    };


    $scope.input_change = function (selected) {
      input[i]["name"] = selected
      input[i]["title"] = selected
    };

    $scope.checkIfEnter = function($event){
    var keyCode = $event.which || $event.keyCode;
    if (keyCode === 13) {
        input[i]["get_absolute_url"] = ""
        input[i]["submitted_by"] = $scope.user
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
          url: '/crews/apis/' + slug + '/',
          data:  {'members': $scope.allmembers},
          method: 'POST'
        }).
        success(function(data) {
        }).
        error(function(data) {
        });

    };

  $scope.show_awards = function () {
      get_datas('/tournaments/elo.json?group=' + slug);
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

