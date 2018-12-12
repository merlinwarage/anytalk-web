(function (angular) {


    angular.module('appModule').directive('header', ["$location", "GlobalConstants",
        function ($location, GlobalConstants) {
            return {
                templateUrl: GlobalConstants.states.header.TPL,
                restrict: 'E',
                replace: true,
                link: function (scope, element, attrs) {
                    scope.buildInfo = attrs.buildInfo;
                }
            };

        }]);
})(window.angular);
