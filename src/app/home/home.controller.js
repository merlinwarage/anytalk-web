(function (angular) {


    angular.module("appModule.home").controller("HomeController", [
        "$scope", "$sce", "$state", "GlobalConstants", "AuthService",
        function ($scope, $sce, $state, GlobalConstants, AuthService) {
            $scope.tokenObj = AuthService.get(GlobalConstants.system.AUTH_TOKEN_KEY);
            $state.go('main.room');
        }
    ]);

})(window.angular);
