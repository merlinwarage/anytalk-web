( function ( angular ) {

    angular.module( 'appModule.user' ).controller( 'UserController', [
        '$scope', '$sce', '$state', '$stateParams', 'XHR', 'GlobalConstants', 'AuthService', 'UserService', 'GlobalConfigCacheService',
        'socket', 'GlobalFunctionsDialog', 'GlobalFunctionsObject', 'UserConstants',
        function ( $scope, $sce, $state, $stateParams, XHR, GlobalConstants, AuthService, UserService, GlobalConfigCacheService,
                   socket, GlobalFunctionsDialog, GlobalFunctionsObject, UserConstants ) {

            var globalConfig = GlobalConfigCacheService.getConfigObject( GlobalConstants.system.GLOBAL_CONFIG_KEY );

            $scope.formData = {};
            $scope.formValidation = {};
            $scope.formDataLogin = {};
            $scope.tokenObj = AuthService.get( GlobalConstants.system.AUTH_TOKEN_KEY );

            if ( $scope.tokenObj ) {

                $scope.itHasPerm = () => {
                    return $scope.tokenObj && $scope.tokenObj.loginDetails.userPermission === GlobalConstants.permissionCodes.admin;
                };

                $scope.tableConfig = UserConstants.tableConfig;

                $scope.$on( 'tableUtilsEvent', ( event, args ) => {
                    switch ( args.event ) {
                        case 'edit':
                        case 'dblclick': {
                            $scope.clearData();
                            $scope.formData = args.row;
                            $scope.formData.password = GlobalConstants.common.EMPTY_STRING;
                            $scope.formValidation.password = GlobalConstants.common.EMPTY_STRING;
                            break;
                        }
                        case 'delete': {
                            GlobalFunctionsDialog.showConfirmDialog( args.row.deleted ? UserConstants.dialogParams.undelete : UserConstants.dialogParams.delete ).then( () => {
                                $scope.deleteUser( args.row._id, !args.row.deleted );
                            } );
                            break;
                        }

                    }
                } );

                const getUser = () => {
                    UserService.getAllUsers( globalConfig ).then( result => {
                        $scope.tableConfig.data = result.data;
                        $scope.$broadcast( 'tableUtilsReload', $scope.tableConfig.name );
                    } );
                };

                $scope.addUser = () => {
                    if ( !$scope.formData.permission ) {
                        $scope.formData.permission = 1;
                    }

                    if ( $scope.tokenObj ) {
                        if ( !$scope.itHasPerm() ) {
                            $scope.formData._id = $scope.tokenObj.loginDetails.userId;
                        }
                    }

                    UserService.addUser( globalConfig, $scope.formData ).then( () => {
                        $scope.formDataLogin = angular.copy( $scope.formData );
                        $scope.clearData();

                        if ( $scope.tokenObj && $scope.itHasPerm() ) {
                            getUser();
                        } else if ( !$scope.tokenObj ) {
                            $scope.login();
                        }
                    } );
                };

                $scope.userChangePassswordValidate = () => {
                    return (
                        $scope.formData.password &&
                        $scope.formData.password === $scope.formValidation.password &&
                        $scope.formData.password.length >= 8
                    );
                };

                $scope.userRegistrationValidate = () => {
                    return (
                        $scope.formData &&
                        $scope.formData.name &&
                        $scope.formData.password &&
                        $scope.formData.password === $scope.formValidation.password &&
                        $scope.formData.mail &&
                        $scope.formData.name.length >= 2 &&
                        $scope.formData.password.length >= 8 &&
                        $scope.formData.mail.indexOf( '@' ) !== -1 &&
                        $scope.formData.mail.indexOf( '.' ) !== -1
                    );
                };

                $scope.deleteUser = ( id, status ) => {
                    UserService.deleteUser( globalConfig, id, status ).then( () => {
                        getUser();
                    } );
                };

                $scope.clearData = () => {
                    $scope.formData = GlobalFunctionsObject.clearObject( $scope.formData, {}, true );
                    $scope.formValidation = GlobalFunctionsObject.clearObject( $scope.formValidation, {}, true );
                };

                if ( $state.current.name === GlobalConstants.states.user.NAME ) {
                    getUser();
                }

            }
        }

    ] );

} )( window.angular );
