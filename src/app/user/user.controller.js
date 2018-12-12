(function (angular) {

    angular.module("appModule.user").controller("UserController", [
        "$scope", "$sce", "$state", "$stateParams", "XHR", "GlobalConstants", "AuthService", "UserService", "GlobalConfigCacheService",
        "socket", "GlobalFunctionsDialog", "GlobalFunctionsObject", "UserConstants",
        function ($scope, $sce, $state, $stateParams, XHR, GlobalConstants, AuthService, UserService, GlobalConfigCacheService,
                  socket, GlobalFunctionsDialog, GlobalFunctionsObject, UserConstants) {

            var globalConfig = GlobalConfigCacheService.getConfigObject(GlobalConstants.system.GLOBAL_CONFIG_KEY);

            $scope.formData = {};
            $scope.passwordValidation = GlobalConstants.common.EMPTY_STRING;
            $scope.formDataLogin = {};
            $scope.tokenObj = AuthService.get(GlobalConstants.system.AUTH_TOKEN_KEY);

            if ($scope.tokenObj) {

                $scope.itHasPerm = function () {
                    return $scope.tokenObj && $scope.tokenObj.loginDetails.userPermission === GlobalConstants.permissionCodes.admin;
                };

                $scope.tableConfig = UserConstants.tableConfig;

                $scope.$on('tableUtilsEvent', function (event, args) {
                    switch (args.event) {
                        case 'edit':
                        case 'dblclick': {
                            $scope.formData = args.row;
                            break;
                        }
                        case 'delete': {
                            GlobalFunctionsDialog.showConfirmDialog(args.row.deleted ? UserConstants.dialogParams.undelete : UserConstants.dialogParams.delete).then(function onSuccess() {
                                $scope.deleteUser(args.row._id, !args.row.deleted);
                            });
                            break;
                        }

                    }
                });

                var getUser = function () {
                    UserService.getAllUsers(globalConfig).then(function (result) {
                        $scope.tableConfig.data = result.data;
                        $scope.$broadcast('tableUtilsReload', $scope.tableConfig.name);
                    });
                };

                $scope.addUser = function () {
                    if (!$scope.formData.permission) {
                        $scope.formData.permission = 1;
                    }

                    UserService.addUser(globalConfig, $scope.formData).then(function () {
                        $scope.formDataLogin = angular.copy($scope.formData);
                        $scope.formData = {};

                        if ($scope.tokenObj) {
                            getUser();
                        } else {
                            $scope.login();
                        }
                    });
                };

                $scope.userRegistrationValidate = function () {
                    return (
                        $scope.formData &&
                        $scope.formData.name &&
                        $scope.formData.password &&
                        $scope.formData.mail &&
                        $scope.formData.name.length >= 2 &&
                        $scope.formData.password.length >= 8 &&
                        $scope.formData.mail.indexOf('@') !== -1 &&
                        $scope.formData.mail.indexOf('.') !== -1
                    );
                };

                $scope.deleteUser = function (id, status) {
                    UserService.deleteUser(globalConfig, id, status).then(function () {
                        getUser();
                    });
                };

                $scope.clearData = function () {
                    $scope.formData = GlobalFunctionsObject.clearObject($scope.formData, {}, true);
                };

                if ($state.current.name === GlobalConstants.states.user.NAME) {
                    getUser();
                }

            }
        }

    ]);

    angular.module("appModule.user").controller("UserLoginDialogController", [
        "$scope", "$sce", "$state", "XHR", "GlobalConstants", "AuthService", "UserService", "GlobalConfigCacheService",
        "socket", "GlobalFunctionsDialog", '$uibModalInstance', 'dialogParam',
        function ($scope, $sce, $state, XHR, GlobalConstants, AuthService, UserService, GlobalConfigCacheService,
                  socket, GlobalFunctionsDialog, $uibModalInstance, dialogParam) {

            var globalConfig = GlobalConfigCacheService.getConfigObject(GlobalConstants.system.GLOBAL_CONFIG_KEY);

            if (dialogParam) {
                $scope.dialogParam = dialogParam;
            }

            $scope.formData = {};
            $scope.passwordValidation = GlobalConstants.common.EMPTY_STRING;
            $scope.formDataLogin = {};
            $scope.tokenObj = AuthService.get(GlobalConstants.system.AUTH_TOKEN_KEY);

            $scope.addUser = function () {
                UserService.addUser(globalConfig, $scope.formData).then(function () {
                    $scope.formDataLogin = angular.copy($scope.formData);
                    $scope.formData = {};
                    $scope.login();
                });
            };

            $scope.cancelError = function () {
                $scope.errorMsg = GlobalConstants.common.EMPTY_STRING;
            };

            $scope.userRegistrationValidate = function () {
                return (
                    $scope.formData &&
                    $scope.formData.name &&
                    $scope.formData.password &&
                    $scope.formData.mail &&
                    $scope.formData.name.length >= 2 &&
                    $scope.formData.password.length >= 8 &&
                    $scope.formData.password === $scope.passwordValidation &&
                    $scope.formData.mail.indexOf('@') !== -1 &&
                    $scope.formData.mail.indexOf('.') !== -1
                );
            };

            $scope.userLogin = {};
            $scope.login = function () {
                $scope.errorMsg = GlobalConstants.common.EMPTY_STRING;

                UserService.login(globalConfig, $scope.formDataLogin, $scope.userLogin.remember).then(function (response) {
                    socket.emit('user:join', {
                        cid: socket.id,
                        userId: response.loginDetails.userId,
                        userName: response.loginDetails.userName
                    });

                    $scope.formDataLogin = {};
                    $state.reload();
                    $scope.confirmOK();
                }, function (err) {
                    if (err.data.errorMessage) {
                        $scope.errorMsg = 'entities.user.messages.' + err.data.errorMessage;
                    }
                });
            };

            $scope.userLoginValidate = function () {
                return (
                    $scope.formData &&
                    $scope.formData.password &&
                    $scope.formData.mail &&
                    $scope.formData.password.length >= 8 &&
                    $scope.formData.mail.indexOf('@') !== -1 &&
                    $scope.formData.mail.indexOf('.') !== -1
                );
            };

            $scope.confirmOK = function () {
                if (!$scope.errorMsg) {
                    $uibModalInstance.close();
                } else {
                    return false;
                }
            };

            $scope.confirmCancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);

})(window.angular);
