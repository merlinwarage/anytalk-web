(function (angular) {


    angular.module("appModule.messenger").config([
        "$stateProvider", "GlobalConstants",
        function ($stateProvider, GlobalConstants) {
            $stateProvider
                .state(GlobalConstants.states.messenger.NAME, {
                    url: GlobalConstants.states.messenger.URL,
                    views: {
                        "main@": {
                            templateUrl: GlobalConstants.states.messenger.TPL,
                            controller: "MessengerController"
                        }
                    },
                    params: {
                        id: null,
                        title: null,
                        msg: null,
                        invite: null
                    },
                    data: {pageTitle: GlobalConstants.states.messenger.TITLE}
                });
        }]);

    angular.module("appModule.messenger").run(['$anchorScroll',
        function ($anchorScroll) {
            $anchorScroll.yOffset = 220;   // always scroll by 50 extra pixels
        }]);

})(window.angular);
