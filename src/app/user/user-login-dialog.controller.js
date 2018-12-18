( function ( angular ) {
    angular.module( 'appModule.user' ).controller( 'UserLoginDialogController', [
        '$scope', '$sce', '$state', 'XHR', 'GlobalConstants', 'AuthService', 'UserService', 'GlobalConfigCacheService',
        'socket', 'GlobalFunctionsDialog', 'GlobalFunctionsString', '$uibModalInstance', 'dialogParam',
        function ( $scope, $sce, $state, XHR, GlobalConstants, AuthService, UserService, GlobalConfigCacheService,
                   socket, GlobalFunctionsDialog, GlobalFunctionsString, $uibModalInstance, dialogParam ) {

            var globalConfig = GlobalConfigCacheService.getConfigObject( GlobalConstants.system.GLOBAL_CONFIG_KEY );

            if ( dialogParam ) {
                $scope.dialogParam = dialogParam;
            }

            $scope.errorMsg = { login: undefined, registration: undefined };
            $scope.formData = {};
            $scope.passwordValidation = GlobalConstants.common.EMPTY_STRING;
            $scope.formDataLogin = {};
            $scope.tokenObj = AuthService.get( GlobalConstants.system.AUTH_TOKEN_KEY );

            $scope.addUser = () => {
                UserService.addUser( globalConfig, $scope.formData ).then(
                    () => {
                        $scope.formDataLogin = angular.copy( $scope.formData );
                        $scope.formData = {};
                        $scope.login();
                    },
                    err => {
                        if ( err.data.errorMessage ) {
                            $scope.errorMsg.registration = GlobalFunctionsString.errorParse( err.data.errorMessage );
                        }
                    } );
            };

            $scope.cancelError = () => {
                $scope.errorMsg = {};
            };

            $scope.userRegistrationValidate = () => {
                return (
                    $scope.formData &&
                    $scope.formData.name &&
                    $scope.formData.password &&
                    $scope.formData.mail &&
                    $scope.formData.name.length >= 2 &&
                    $scope.formData.password.length >= 8 &&
                    $scope.formData.password === $scope.passwordValidation &&
                    $scope.formData.mail.indexOf( '@' ) !== -1 &&
                    $scope.formData.mail.indexOf( '.' ) !== -1
                );
            };

            $scope.userLogin = {
                remember: false
            };

            $scope.login = () => {
                $scope.errorMsg.login = GlobalConstants.common.EMPTY_STRING;

                UserService.login( globalConfig, $scope.formDataLogin, $scope.userLogin.remember ).then( response => {
                    socket.emit( 'user:join', {
                        cid: socket.id,
                        userId: response.loginDetails.userId,
                        userName: response.loginDetails.userName
                    } );

                    $scope.formDataLogin = {};
                    $state.reload();
                    $scope.cancelError();
                    $scope.confirmOK();
                }, err => {
                    if ( err.data.errorMessage ) {
                        $scope.errorMsg.login = 'entities.user.messages.' + err.data.errorMessage;
                    }
                } );
            };

            $scope.userLoginValidate = () => {
                return (
                    $scope.formData &&
                    $scope.formData.password &&
                    $scope.formData.mail &&
                    $scope.formData.password.length >= 8 &&
                    $scope.formData.mail.indexOf( '@' ) !== -1 &&
                    $scope.formData.mail.indexOf( '.' ) !== -1
                );
            };

            $scope.confirmOK = () => {
                if ( !$scope.errorMsg.login && !$scope.errorMsg.registration ) {
                    $uibModalInstance.close();
                } else {
                    return false;
                }
            };

            $scope.confirmCancel = () => {
                $uibModalInstance.dismiss( 'cancel' );
            };
        } ] );

} )( window.angular );
