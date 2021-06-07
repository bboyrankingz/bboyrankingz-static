var app = angular.module("bboy", ['facebook', 'angular.filter']);

app.controller("JamTime", function($scope, $http, $filter) {
    var lat = "25";
    var lng = "0";
    var zoom = 3;

    $scope.showPosition = function (position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        showMap(lat, lng, 10);
    }

     $scope.showError = function (){
        $scope.$apply();
        showMap(lat, lng, zoom);
    }

    $scope.getLocation = function () {
        if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        }
    }

    $scope.getLocation();

    function getPoi(mymap, date, markerParams) {
        $http.get('/events/jamtime.json?in_bbox=' + mymap.getBounds().toBBoxString() + '&ordering=start&start_time=' + date)
            .success(function(data, status, headers, config) {
                $scope.near_me = data;

                $scope.near_me.results.forEach(function(poi) {
                    L.geoJson(poi["spot"], { pointToLayer: function(feature, latlng) { return  L.circleMarker(latlng, markerParams)}})
                        .bindPopup(bindHtml(L, poi))
                        .addTo(mymap);
                });
        });
    }

    function showMap(lat, lng, zoom) {
        var mymap = L.map('mapid').setView([lat, lng], zoom);
        var now = new Date();
        date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

        // parameters to style the GeoJSON markers
        var markerParams = {
          radius: 4,
          fillColor: 'orange',
          color: '#fff',
          weight: 1,
          opacity: 0.5,
          fillOpacity: 0.8
        };

        getPoi(mymap, date, markerParams);

        mymap.on("moveend", function () {
            getPoi(mymap, date, markerParams);
        });

        L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 18,
            accessToken: 'pk.eyJ1IjoiYmJveXJhbmtpbmd6IiwiYSI6ImNpb3Zrb3hvajAwNmh2YmtqdmY1Nmx0dHAifQ.66vYJSjuAq2fVAJTAzzbIw'
        }).addTo(mymap);
    }

    function bindHtml(L, poi) {

            var div  = L.DomUtil.create('div', 'media');
            var figure = L.DomUtil.create('div', 'media-left', div);
            var link = L.DomUtil.create('a', null, figure);
            var img = L.DomUtil.create('img', null, link);
            var wrapper = L.DomUtil.create('div', 'media-body', div);
            var h3 = L.DomUtil.create('h4', 'media-body', wrapper);
            var title = L.DomUtil.create('a', 'media-heading', h3);
            var date = L.DomUtil.create('strong', null, wrapper);
            var address = L.DomUtil.create('address', null, wrapper);

            var dateOut = new Date(poi.start);
            d = $filter('date')(dateOut, 'd MMM yyyy');
            date.textContent = d;
            address.textContent = poi.spot.properties.address;
            link.href = poi.get_absolute_url;
            img.src = poi.thumbnail;
            img.style.width = '60px';
            img.style.height = '60px';
            title.href = poi.get_absolute_url;
            title.textContent = poi.title;

           return div;
     }
});



