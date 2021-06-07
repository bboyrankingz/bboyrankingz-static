app.directive("owlCarousel", function() {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function(element) {
                $(element).owlCarousel({
                    loop:false,
                    margin:2,
                    responsiveClass:true,
                    nav:true,
                    navText: ['<i class="fa fa-angle-left">', '<i class="fa fa-angle-right">'],
                    dots: true,
                    responsive:{
                        0:{
                            items:2,
                        },
                        480: {
                            items:3
                        },
                        768:{
                            items:5,
                        },
                        992:{
                            items:6,
                        }
                    }
                });
            };
        }
    };
})
.directive('owlCarouselItem', [function() {
    return {
        restrict: 'A',
        transclude: false,
        link: function(scope, element) {
          // wait for the last item in the ng-repeat then call init
            if(scope.$last) {
                scope.initCarousel(element.parent());
            }
        }
    };
}]);



