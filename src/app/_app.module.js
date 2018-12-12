( function ( angular ) {
    /**
     * Defining the BASE modules
     */
    angular.module( 'GlobalConfigModule', [ 'GlobalConstantsModule' ] );

    angular.module( 'appModule', [
        'ui.router',
        'ngSanitize',
        'ngResource',
        'ngCookies',
        'ui.bootstrap',
        'ngAnimate',
        'angular-web-notification',
        'angular-loading-bar',
        'angular.filter',
        'GlobalXHRModule',
        'GlobalConstantsModule',
        'GlobalConfigModule',
        'GlobalFunctionsModule',
        'duScroll',
        'GlobalLogModule',
        'GlobalAuthModule',
        'pascalprecht.translate',
        'ClientInfoModule',
        'btford.socket-io',
        'ngSanitize',
        'angulartics',
        'angulartics.google.analytics'
    ] )
        .value( 'duScrollDuration', 200 )
        .value( 'duScrollOffset', 30 );


    /**
     * Defining the APPLICATION modules
     */
    angular.module( 'appModule.home', [ 'appModule' ] );
    angular.module( 'appModule.room', [ 'appModule', 'uiTableUtils', 'slickCarousel' ] );
    angular.module( 'appModule.messenger', [ 'appModule', 'uiTableUtils', 'youtube-embed' ] );
    angular.module( 'appModule.user', [ 'appModule' ] );

    /**
     * Defining the MAIN module
     */
    angular.module( 'ngApplication', [
        'appModule.home', 'appModule.room', 'appModule.messenger', 'appModule.user'
    ] );

    /***************************************************************************************************/

    /**
     * MAIN module config, run, controller methods
     */
    angular.module( 'ngApplication' ).config( [
        '$locationProvider', '$stateProvider', '$urlRouterProvider', '$qProvider', 'GlobalConstants',
        '$resourceProvider', '$animateProvider', '$translateProvider',
        function ( $locationProvider, $stateProvider, $urlRouterProvider, $qProvider, GlobalConstants,
                   $resourceProvider, $animateProvider, $translateProvider ) {
            $locationProvider.hashPrefix( '!' );
            $animateProvider.classNameFilter( /(animate|am|menu|sidebar)-/ );
            $urlRouterProvider.otherwise( GlobalConstants.states.home.URL );
            $resourceProvider.defaults.stripTrailingSlashes = false;
            $qProvider.errorOnUnhandledRejections( false );
            $translateProvider.useStaticFilesLoader( {
                prefix: 'assets/i18n/',
                suffix: '.json'
            } );

            $translateProvider.useSanitizeValueStrategy( null );
            $translateProvider.preferredLanguage( 'hu_HU' ); //todo global configból ha nincs profile
            $translateProvider.useMissingTranslationHandler( 'MissingTranslationHandlerFactory' );
            moment.locale( 'hu' );

            $stateProvider.state( GlobalConstants.states.main.NAME, {
                abstract: true,
                views: GlobalConstants.states.main.TPL,
                resolve: {
                    'globalConfig': function ( GlobalConfigCacheService ) {
                        return GlobalConfigCacheService.xhrLoadConfigObject( GlobalConstants.system.GLOBAL_CONFIG_KEY, GlobalConstants.system.CONFIG_URL );
                    }
                }
            } );
        }
    ] );

    angular.module( 'ngApplication' ).factory( 'MissingTranslationHandlerFactory', [
        '$rootScope', $rootScope => translationID => { //, uses
            if ( translationID.substring( translationID.length - 1 ) === '.' ) {
                return;
            }
            if ( !$rootScope.missingTranslations ) {
                $rootScope.missingTranslations = [];
            }
            if ( $rootScope.missingTranslations.indexOf( translationID ) === -1 ) {
                $rootScope.missingTranslations.push( translationID );
            }
        }
    ] );

    angular.module( 'ngApplication' ).controller( 'ngApplicationController', [
        '$scope', '$rootScope', '$location', '$state', '$timeout', '$animate', '$anchorScroll', '$translate', '$window',
        'GlobalConstants', 'AuthService', 'HeaderMessageManager', 'GlobalFunctionsTimer', 'GlobalFunctionsJQ',
        ( $scope, $rootScope, $location, $state, $timeout, $animate, $anchorScroll, $translate, $window,
          GlobalConstants, AuthService, HeaderMessageManager, GlobalFunctionsTimer, GlobalFunctionsJQ ) => {
            $rootScope.menuStatus = true;
            $scope.pageTitle = 'MWO';

            console.log( 'test' );
            const a = [ 1, 2, 3, 4, 5 ].includes( 1 );
            console.log( a );

            GlobalFunctionsJQ.addHotkeys();
            GlobalFunctionsJQ.addTranslateBreaker();
            GlobalFunctionsJQ.footerHandler();

            const storedLanguage = AuthService.getCookie( GlobalConstants.settings.LANGUAGE );
            if ( storedLanguage ) {
                moment.locale( AuthService.getCookie( GlobalConstants.settings.LANGUAGE ) );
                $translate.use( GlobalConstants.languages[ storedLanguage ] || GlobalConstants.languages.en );
                AuthService.store( GlobalConstants.settings.LANGUAGE, storedLanguage );
            } else {
                const browserLang = $window.navigator.language;
                const langCode = 'hu'; //browserLang.substring(0, 2);
                moment.locale( langCode );
                $translate.use( GlobalConstants.languages[ langCode ] || GlobalConstants.languages.en );
                AuthService.store( GlobalConstants.settings.LANGUAGE, langCode );
                AuthService.setCookie( GlobalConstants.settings.LANGUAGE, langCode );
            }

            const storedLoginData = AuthService.getCookie( GlobalConstants.system.AUTH_TOKEN_KEY );
            if ( storedLoginData ) {
                AuthService.validateToken( storedLoginData ).then( result => {
                    if ( result ) {
                        AuthService.store( GlobalConstants.system.AUTH_TOKEN_KEY, result );
                    }
                } );

            }

            // state change parameters: event, toState, toParams, fromState, fromParams
            $scope.$on( '$stateChangeSuccess', ( event, toState, toParams ) => {
                if ( toParams.msg ) {
                    $timeout( function () {
                        $anchorScroll.yOffset = 50;
                        $anchorScroll( toParams.msg );
                    }, 1000 );
                }

                $scope.pageTitle = toParams.id ? 'MWO | ' + toParams.id : 'MWO';
                $scope.stateName = toState.name.replace( 'main.', '' );

                $scope.$broadcast( 'showRoomBtn', true );
            } );

            // state change parameters: event, toState, toParams, fromState, fromParams
            $scope.$on( '$stateChangeStart', function () {
            } );

            $scope.$on( '$stateChangeError', ( event, toState, toParams, fromState, fromParams ) => {
                console.log( '$stateChangeError - fired when an error occurs during transition.' );
                console.log( arguments );
            } );

            $scope.status = 'ready';
        }
    ] );
} )( window.angular );
