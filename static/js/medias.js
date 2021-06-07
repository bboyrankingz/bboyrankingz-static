var app = angular.module("bboy", ['facebook', 'iso.directives', 'infinite-scroll']);

app.controller("Media", function($scope, $http, $location, $timeout) {

    loc = $location.search()
    var s=angular.element('#portfolio-item-container').scope();
    $scope.busy=false;

    $scope.background = "/site_media/static/img/redbull.jpg";
    var url = '/media/list.json?';
    var channel = '';
    var tags = '';

    if('tag_list' in loc)
    {
        $scope.match = loc['tag_list'];
        tags = '&tags=' + loc['tag_list'];
    }
    else if('channel' in loc)
    {
        $scope.match = loc['channel'];
        channel = '&channel_title=' + loc['channel'];
    }

    next(url + channel + tags, false);

    $scope.update = function(type){
        s.items = [];
        $scope.busy = false;

        if (type === ''){
            $scope.background = "/site_media/static/img/redbull.jpg";
            channel = '';
            tags = '';
            url = '/media/list.json?';
        }
        else if('tag_list' in loc)
        {
            tags = '&tags=' + loc['tag_list'] + "," + type;
        }
        else if(channel !== '')
        {
            tags = "&tags=" + type;
        }
        else if(url.includes("channel_id"))
        {
            channel = '';
            tags = "&tags=" + type;
        }
        else
        {
            tags = "&tags=" + type;
        }
        next(url + channel + tags, true);
    }

    function next(url, more)
    {
        if ($scope.busy) return;
        $scope.busy = true;

        $http({method:"GET", url:url}).then(function(result){
            if(s.items.length == 0 || more) {
                var items = result.data.results;
                $scope.carousels = result.data.carousels;
                if(result.data.channel != undefined)
                {
                    $scope.background = result.data.channel.image_url;
                    $scope.match = result.data.channel.title;
                }
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

    $scope.show_channel = function(channel_url){
        s.items = [];
        $scope.busy = false;
        url = channel_url;
        next(url, true);
        toastr.success("You change the channel");

    };

    $scope.push = function(){
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';

        $http({
          url: '/footage/list.json',
          data:  {'url': $scope.form_url},
          method: 'POST'
        }).
        success(function(data) {
            window.location.href = '/footage/' + data["results"][0]["id"];
        }).
            error(function(data) {
        });
    };
});