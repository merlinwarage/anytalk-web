angular.module('ngApplication').directive('fadeIn', ["$timeout", function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, $element, attrs) {
            $element.addClass("ng-hide-remove");
            $element.on('load', function () {
                $element.addClass("ng-hide-add");
            });
        }
    };
}]);