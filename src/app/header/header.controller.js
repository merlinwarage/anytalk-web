(function (angular) {
    "use strict";

    angular.module('appModule').controller('headerController', [
        '$scope', '$state', '$stateParams', '$location', '$translate', 'GlobalConstants', 'UserService', 'HeaderConstants', "AuthService",
        function ($scope, $state, $stateParams, $location, $translate, GlobalConstants, UserService, HeaderConstants, AuthService) {

            $scope.isNavCollapsed = true;
            $scope.userData = UserService.getUserDetails;
            $scope.currentState = $state;

            $scope.selectedCategory = $stateParams.id ? $stateParams : '';
            $scope.$on(GlobalConstants.event.emit.SELECTED_CATEGORY, function (event, args) {
                $scope.selectedCategory = args;
            });

            $scope.sourceList = HeaderConstants.sourceList;

            $scope.collapseNav = function (selected) {
                if (selected) {
                    $scope.selectedCategory = selected;
                }
                $scope.isNavCollapsed = true;
            };

            $scope.showLoginForm = function () {
                UserService.showLoginForm();
            };

            $scope.logout = function () {
                UserService.logout();
                $scope.showAddRoomBtn = false;
            };

            $scope.addRoom = function () {
                $scope.$broadcast(GlobalConstants.event.broadcast.ADD_ROOM);
            };

            $scope.changeLanguage = function (language) {
                AuthService.store(GlobalConstants.settings.LANGUAGE, language);
                AuthService.setCookie(GlobalConstants.settings.LANGUAGE, language);
                $translate.use(GlobalConstants.languages[language]);
                $location.path('/home');
            };

            $scope.$on(GlobalConstants.event.emit.SHOW_ROOM_BUTTON, function (event, args) {
                $scope.showRoomBtn = args;
            });

            $scope.$on(GlobalConstants.event.emit.SHOW_ADD_ROOM_BUTTON, function (event, args) {
                $scope.showAddRoomBtn = args;
            });

            $scope.toTheTop = function () {
                $document.duScrollTopAnimated(0);
            };

        }]);
})(window.angular);