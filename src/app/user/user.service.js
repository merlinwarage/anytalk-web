( function ( angular ) {

    angular.module( 'appModule.user' ).service( 'UserService', [
        '$state', 'XHR', 'GlobalConstants', 'AuthService', 'GlobalFunctionsDialog', 'socket',
        function ( $state, XHR, GlobalConstants, AuthService, GlobalFunctionsDialog, socket ) {

            this.getUserActivities = function ( config ) {
                return XHR.get( config.SERVER_URL + GlobalConstants.states.user.API.getActivities ).then( function ( result ) {
                    return result.data;
                } );
            };

            this.getAllUsers = function ( config ) {
                return XHR.get( config.SERVER_URL + GlobalConstants.states.user.API.getAll ).then( function ( result ) {
                    return result;
                } );
            };

            this.addUser = function ( config, data ) {
                return XHR.save( config.SERVER_URL + GlobalConstants.states.user.API.add, false, data, true, true );
            };

            this.login = function ( config, data, remember ) {
                return XHR.save( config.SERVER_URL + GlobalConstants.states.user.API.login, false, data, true, true ).then( function ( response ) {
                    AuthService.store( GlobalConstants.system.AUTH_TOKEN_KEY, response );
                    if ( remember ) {
                        AuthService.setCookie( GlobalConstants.system.AUTH_TOKEN_KEY, response.token );
                    }
                    return response;
                } );
            };

            this.deleteUser = function ( config, id, deleted ) {
                return XHR.delete( config.SERVER_URL + GlobalConstants.states.user.API.delete, {
                    id: id,
                    deleted: deleted
                } );
            };

            this.getUserDetails = function () {
                const userData = AuthService.get( GlobalConstants.system.AUTH_TOKEN_KEY );

                if ( userData && userData.loginDetails ) {
                    return userData.loginDetails;
                }
            };

            this.logout = function () {
                const tokenObj = AuthService.get( GlobalConstants.system.AUTH_TOKEN_KEY );
                socket.emit( 'user:left', tokenObj.loginDetails.userId );
                AuthService.store( GlobalConstants.system.AUTH_TOKEN_KEY, undefined );
                AuthService.removeCookie( GlobalConstants.system.AUTH_TOKEN_KEY );
                $state.go( GlobalConstants.states.home.NAME );
            };

            this.showLoginForm = function () {
                const dialogParams = {
                    template: 'src/app/user/user-login-dialog.tpl.html',
                    controller: 'UserLoginDialogController',
                    buttonCancel: 'common.button.cancel',
                    buttonOk: 'common.button.ok',
                    windowClass: 'modal-dialog-login'
                };
                GlobalFunctionsDialog.showModalDialog( dialogParams.template, dialogParams, undefined, dialogParams.controller );
            };

        } ] );
} )( window.angular );
