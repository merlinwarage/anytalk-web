(function (angular) {


    angular.module("appModule.user").config([
        "$stateProvider", "GlobalConstants",
        function ($stateProvider, GlobalConstants) {
            $stateProvider.state(GlobalConstants.states.user.NAME, {
                url: GlobalConstants.states.user.URL,
                views: {
                    "main@": {
                        templateUrl: GlobalConstants.states.user.TPL,
                        controller: "UserController"
                    }
                },
                data: {pageTitle: GlobalConstants.states.user.TITLE}
            });
        }]);
})(window.angular);
