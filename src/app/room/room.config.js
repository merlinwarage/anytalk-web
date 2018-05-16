(function (angular) {
    "use strict";

    angular.module("appModule.room").config([
        "$stateProvider", "GlobalConstants",
        function ($stateProvider, GlobalConstants) {
            $stateProvider
                .state(GlobalConstants.states.room.NAME, {
                    url: GlobalConstants.states.room.URL,
                    views: {
                        "main@": {
                            templateUrl: function ($stateParams) {
                                return $stateParams.id ? GlobalConstants.states.room.TPL_CATEGORY : GlobalConstants.states.room.TPL;
                            },
                            controller: "MessengerRoomController"
                        }
                    },
                    params: {
                        id: ''
                    },
                    data: {pageTitle: GlobalConstants.states.messenger.TITLE}
                });
        }]);

})(window.angular);