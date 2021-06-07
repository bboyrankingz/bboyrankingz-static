app.config(function(FacebookProvider) {
    FacebookProvider.init('188177647885818');
})
.controller("HeaderCtrl", function($scope, $location, $http, $timeout, Facebook) {

    $scope.login = function() {
        Facebook.login(function(response) {
            Facebook.getLoginStatus(function(response) {
                if(response.status === 'connected') {
                    Facebook.api('/me?fields=id,name,email,events,friends,cover,link', function(response) {
                        source = null;
                        if(response.cover !== undefined){source = response.cover.source;}
                        $http({ url: '/users/list.json', data: { "facebook_id": response.id, "first_name": response.name, "email": response.email, "cover": source, "link": response.link}, method: 'POST' })
                        .success(function (data, status, headers, config) {
                            toastr.success("Welcome.");
                            location.reload();
                        })
                        .error(function (error) {
                            toastr.success("Error please retry.");
                            console.log("[ERROR] - " + error);
                        });
                    });
                }
            });
        });
    }
});