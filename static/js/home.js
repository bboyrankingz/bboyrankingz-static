var app = angular.module("bboy", ['facebook', 'ngRoute', 'iso.directives','infinite-scroll', 'angularMoment', 'angular.filter']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'site_media/home.html',
            controller: 'Home',
            controllerAs: 'home'
        }).when('/media', {
            templateUrl: 'site_media/media.html',
            controller: 'Media',
            controllerAs: 'media'
        }).when('/search', {
            templateUrl: 'site_media/search.html',
            controller: 'Search',
            controllerAs: 'search'
        }).when('/stats', {
            templateUrl: 'site_media/stats.html',
            controller: 'Stats',
            controllerAs: 'stats'
        }).when('/stream', {
            templateUrl: 'site_media/stream.html',
            controller: 'Stream',
            controllerAs: 'stream'
        }).when('/privacy_policy', {
            templateUrl: 'site_media/privacy_policy.html'
        }).when('/about_ranking', {
            templateUrl: 'site_media/about_ranking.html'
        }).otherwise({
            redirectTo: '/'
        });
    }
])
.controller("Media", function($http, $location, $timeout) {
    var media = this;
    media.usersession = usersession.getToken();
    loc = $location.search()
    var s=angular.element('#portfolio-item-container').scope();
    var first_url = '/media/list.json';
    media.busy=false;


    if('tag_list' in loc)
    {
        media.match = loc['tag_list'];
        first_url = '/media/list.json?tags=' + loc['tag_list'] + '.json';
    }
    else if('tags' in loc)
    {
        media.match = loc['tags'];
        first_url = '/media/search/' + loc['tags'] + '.json';
    }
    else if('channel' in loc)
    {
        media.match = loc['channel'];
        first_url = '/media/list.json?channel_title=' + loc['channel'];
    }
        
    next(first_url, false);

    function next(url, more)
    {
        if (media.busy) return;
        media.busy = true;

        $http({method:"GET", url:url}).then(function(result){
            if(s.items.length == 0 || more) {
                var items = result.data.results;
                media.count = result.data.count
                media.after = result.data.next;
                items.forEach(function(entry) {
                    s.items.push(entry);
                });
                $timeout(function() {
                    media.busy = false;
                });
            }
        });
    }

    media.next = function(url){
        next(url, true);
    };


    media.push = function(){
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';

        $http({
          url: '/footage/list.json',
          data:  {'url': media.form_url},
          method: 'POST'
        }).
        success(function(data) {
            window.location.href = '/footage/' + data["results"][0]["id"];
        }).
            error(function(data) {
        });
    };
})
.controller("Search", function($http, $timeout) {
    var search = this;
    search.q = "";

    search.search = function() {

        if (search.q.length > 0)
        {

            $http.get("/media/search/" + search.q + ".json").
              success(function(data, status, headers, config) {
              search.items = data.results;
            });


            $http.get("/events/search/" + search.q + ".json?page_size=20").
              success(function(data, status, headers, config) {
              search.events = data.results;
            });
            
            $http.get("/bboys/search/" + search.q + ".json").
              success(function(data, status, headers, config) {
              search.artists = data;
            });
            
            $http.get("/crews/search/" + search.q + ".json").
              success(function(data, status, headers, config) {
              search.crews = data;
            });

        }
    }
})
.controller("Stream", function($http, Reddit) {
    var stream = this;
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

    user = '';
    stream.sort = "modified";
    stream.type = '';
    stream.reddit = new Reddit('/blog/api' + user + '.json');

    stream.update = function(){
        stream.reddit = new Reddit('/blog/api' + user + '.json?ordering=-' + stream.sort + '&blog_type=' + stream.type);
        stream.reddit.nextPage();
    };
})
.controller("Home", function($http, $timeout) {
    var home = this;
    home.items = [];
    var now = new Date();
    var tables = new Object();
    var types = ["groups", "artists", "country"];
    types.forEach(function(entry) {
        $http.get('/ranking/' + entry + '/' + now.getFullYear() + '/elo.json?page_size=5').
        success(function(data, status, headers, config) {
            tables[entry] = data.results;
        });
    });

    home.tables = tables;

    date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

    $http.get('/media/list.json?page_size=10').
    success(function(data, status, headers, config) {
        var items = data.results;
        items.forEach(function(entry) {
            home.items.push(entry);
        });
  });

  $http.get('/blog/api.json?on_home_page=True&page_size=3&ordering=-created').
      success(function(data, status, headers, config) {
        home.slider = data;
   });

    $http.get('/events/jamtime.json?&ordering=start&page_size=10&start_time=' + date).
    success(function(data, status, headers, config) {
      home.jamtime = data;
    });

})
.controller("Stats", function($http, $location) {
  var stats = this;

  var date = new Date();
  var currentYear = date.getFullYear();

  stats.theperiod = "year";
  stats.years = new Object();
  stats.tables = new Object();
  stats.tables_person = new Object();
  stats.tables_country = new Object();
  stats.pagers = new Object();
  stats.period = new Object();
  var types = ["Country", "Judge", "Dj", "Host"];
  types.forEach(function(entry) {
      stats.pagers[entry] = 1;
      stats.period[entry] = currentYear;
      get_datas(entry);
  });

  stats.eloperiod = "";
  stats.elo_bboys = new Object();
  stats.elo_max_bboys = new Object();
  stats.elo_crews = new Object();
  stats.elo_max_crews = new Object();
  stats.elo_pager = 1;
  get_elos(stats.elo_pager);

  function get_elos(page)
  {
      $http.get('/ranking/artists/' + (stats.eloperiod === "" ? currentYear : stats.eloperiod)  + '/elo.json?page=' + page).
          success(function(data, status, headers, config) {
            stats.years = data.year
            stats.elo_bboys = data;
          });

      $http.get('/ranking/groups/' + (stats.eloperiod === "" ? currentYear : stats.eloperiod)  + '/elo.json?page=' + page).
          success(function(data, status, headers, config) {
            stats.elo_crews = data;
          });

      $http.get('/ranking/artists/' + (stats.eloperiod === "" ? currentYear : stats.eloperiod)  + '/elo.json?ordering=-max_score&page=' + page).
          success(function(data, status, headers, config) {
            stats.elo_max_bboys = data;
          });

      $http.get('/ranking/groups/' + (stats.eloperiod === "" ? currentYear : stats.eloperiod)  + '/elo.json?ordering=-max_score&page=' + page).
          success(function(data, status, headers, config) {
            stats.elo_max_crews = data;
          });

  }

  stats.update_elo_time = function (period) {
    stats.eloperiod = period;
    get_elos(stats.elo_pager);
  };

  function get_datas(type)
  {
    if(type == "Country")
    {
        $http.get('/ranking/' + type.toLowerCase() + '/' + stats.period[type] + '/elo.json?' + "&page=" + stats.pagers[type]).
        success(function(data, status, headers, config) {
          stats.tables_country[type] = data;
        });
    }
    else
    {
      $http.get('/bboys/api/' + stats.period[type] + '.json?&person_types__slug=' + type + "&page=" + stats.pagers[type]).
      success(function(data, status, headers, config) {
        stats.tables_person[type] = data;
      });
    }
  }

  stats.next_elo = function () {
    stats.elo_pager += 1;
    get_elos(stats.elo_pager);
  };

  stats.previous_elo = function () {
    stats.elo_pager -= 1;
    get_elos(stats.elo_pager);
  };


  stats.next_page = function (table) {
    stats.pagers[table] += 1;
    get_datas(table);
  };

  stats.previous_page = function (table) {
    stats.pagers[table] -= 1;
    get_datas(table);
  };

  stats.update_time = function (table, value) {
    stats.period[table] = value;
    get_datas(table);
  };

})
.directive("revSlider", function($timeout) {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope) {
            scope.initSlider = function() {
              
              $timeout(function() {
                // provide any default options you want
                jQuery('#revslider').revolution({
                    delay:8000,
                    startwidth:1170,
                    startheight:500,
                    fullWidth:"on",
                    fullScreen:"on",
                    hideTimerBar: "off",
                    spinner:"spinner4",
                    navigationStyle: "preview4",
                    soloArrowLeftHOffset:20,
                    soloArrowRightHOffset:20
                });
              });
            };
        }
    };
})
.directive('revSliderItem', [function() {
    return {
        restrict: 'A',
        transclude: false,
        link: function(scope) {
          // wait for the last item in the ng-repeat then call init
            if(scope.$last) {
              scope.initSlider();
            }
        }
    };
}])
.run(function($rootScope) {
    $rootScope.globalFoo = function() {
        alert("I'm global foo!");
    };
});

var usersession = {
    setToken: function(data, token) {
        this.reset();
        localStorage.setItem("jwt", token);
    },
    getToken: function() {
        return localStorage.getItem("jwt");
    },
    getUser: function() {
        return localStorage.getItem("user");
    },
    reset: function() {
        localStorage.removeItem("jwt");
    }
}