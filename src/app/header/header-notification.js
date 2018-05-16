angular.module("appModule").directive("headerNotification", ["GlobalConstants", function (GlobalConstants) {
    return {
        templateUrl: GlobalConstants.states.header.header_notification.TPL,
        restrict: "E",
        replace: true
    };
}]);

angular.module("appModule").controller("headerNotificationController", [
    "$scope", "$document", "$state", "$http", "$translate", "$animate",
    function ($scope, $document, $state, $http, $translate, $animate) {

        $animate.enabled(true);

        /*
         * PAGE SCROLL
         *
         * href:
         * <a du-smooth-scroll class="color-white" href="#page-wrapper"></a>
         * ng-click:
         * <a href class="color-white" ng-click="toTheTop();"></a>
         *
         */

        $scope.toTheTop = function () {
            $document.duScrollTopAnimated(0);
        };
    }]);

