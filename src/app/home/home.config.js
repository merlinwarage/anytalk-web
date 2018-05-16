(function (angular) {
    "use strict";

    angular.module("appModule.home").config([
        "$stateProvider", "GlobalConstants",
        function ($stateProvider, GlobalConstants) {
            $stateProvider.state(GlobalConstants.states.home.NAME, {
                url: GlobalConstants.states.home.URL,
                views: {
                    "main@": {
                        templateUrl: GlobalConstants.states.home.TPL,
                        controller: "HomeController"
                    }
                },
                data: {pageTitle: GlobalConstants.states.home.TITLE}
            });
        }]);
})(window.angular);