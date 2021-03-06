( function ( angular ) {
    'use strict';

    /**
     * @object globalConfig.settings.DEFAULTS.dateformat.code
     * @param {{DEFAULTS: object}} globalConfig
     * @param {{dateformat: object}} DEFAULTS
     */
    angular.module( 'appModule.room' ).controller( 'MessengerRoomController', [
        '$scope', '$state', '$stateParams', '$window', '$translate', '$compile', '$timeout', 'RoomService', 'MessengerService',
        'GlobalConstants', 'AuthService', 'GlobalFunctionsObject', 'RoomConstants', 'GlobalFunctionsDialog',
        'GlobalFunctionsString', 'TableUtilsService', 'GlobalConfigCacheService', 'UserService',
        function ( $scope, $state, $stateParams, $window, $translate, $compile, $timeout, RoomService, MessengerService,
                   GlobalConstants, AuthService, GlobalFunctionsObject, RoomConstants, GlobalFunctionsDialog,
                   GlobalFunctionsString, TableUtilsService, GlobalConfigCacheService, UserService ) {

            const tokenObj = $scope.tokenObj = AuthService.get( GlobalConstants.system.AUTH_TOKEN_KEY );

            const globalConfig = GlobalConfigCacheService.getConfigObject( GlobalConstants.system.GLOBAL_CONFIG_KEY );
            const tableConfig = {
                sortingOrder: 'createdAt',
                reverse: true,
                itemsPerPage: 10,
                currentPage: 0,
                pagination: { url: GlobalConstants.states.messenger.API.getByPages }
            };
            let count = 0;

            $scope.news = { articles: [] };
            $scope.newsCount = RoomConstants.settings.newsCount;
            $scope.errorMsg = GlobalConstants.common.EMPTY_STRING;
            $scope.formData = {};
            $scope.tableData = [];

            $scope.roomPages = { hot: 0, latest: 0 };
            $scope.hotRoomListPageDisplay = '0-10';
            $scope.newRoomListPageDisplay = '0-10';

            $scope.dateFormat = globalConfig.settings.DEFAULTS.dateformat.code + GlobalConstants.settings.HOUR_AND_MIN;
            $scope.dateFormatNoYear = globalConfig.settings.DEFAULTS.dateformat.code.replace( GlobalConstants.regex.getYear, '' ) + GlobalConstants.settings.HOUR_AND_MIN;
            $scope.viewPort = TableUtilsService.initFunctions( false, RoomConstants.viewPort.name, tableConfig );

            $scope.roomListTitleContainerStyle = $scope.tokenObj && $scope.tokenObj.loginDetails.userPermission === GlobalConstants.permissionCodes.admin ? 'room-list-title-container-p' : 'room-list-title-container';

            $scope.$emit( GlobalConstants.event.emit.SHOW_ROOM_BUTTON, false );

            $scope.$watch( 'tokenObj', val => {
                if ( !!val ) {
                    $scope.$emit( GlobalConstants.event.emit.SHOW_ADD_ROOM_BUTTON, true );
                }
            } );

            $scope.$on( GlobalConstants.event.broadcast.ADD_ROOM, () => {
                $scope.addRoom( false, false );
            } );

            $scope.itHasPerm = () => tokenObj && tokenObj.loginDetails.userPermission === GlobalConstants.permissionCodes.admin;

            /**
             * Get News
             * @param category
             * @param language
             */
            $scope.getNews = ( category, language ) => {
                const skipImages = false;
                if ( category || GlobalConstants.states.room.CATEGORY.general ) {
                    RoomService.getNews( globalConfig, language, category, $scope.newsCount, skipImages ).then( response => {
                        $scope.news = response;
                        $scope.slickConfigLoaded = true;
                        $scope.slickConfig = RoomConstants.slickConfig;
                    } );
                }
            };

            $scope.getNews( $stateParams.id || 'home', AuthService.get( GlobalConstants.settings.LANGUAGE ) );
            $scope.$emit( GlobalConstants.event.emit.SELECTED_CATEGORY, $stateParams.id );

            $scope.openNews = url => $window.open( url, '_blank' );

            /**
             * Article Room Management
             * @param data
             */
            $scope.goOrCreateRoom = ( data ) => {
                if ( data.hasRoom ) {
                    $state.go( GlobalConstants.states.messenger.NAME, {
                        title: GlobalFunctionsString.removeDiacritics( data.title )
                    } );
                } else {
                    $scope.addRoom( false, data );
                }
            };

            const getRoomList = () => {
                if ( $scope.tokenObj ) {
                    /**
                     * Activities
                     */
                    UserService.getUserActivities( globalConfig ).then( user => {
                        $scope.userActivities = user.activities;
                    } );

                    /**
                     * Favorite rooms by selected language
                     */
                    RoomService.getFavoriteRooms( globalConfig ).then( response => {
                        $scope.favoriteRoomList = response.data;

                        /**
                         * Private rooms by selected language
                         */
                        RoomService.getPrivateRooms( globalConfig ).then( response => {
                            $scope.privateRoomList = response.data;
                        } );
                    } );
                }

                /**
                 * Featured rooms by selected language
                 */
                RoomService.getFeaturedRooms( globalConfig ).then( response => {
                    $scope.featuredRoomList = response.data;
                } );

                /**
                 * Hot rooms by selected language
                 */
                RoomService.getHotRooms( globalConfig, $stateParams.id ).then( response => {
                    $scope.hotRoomList = response.data;
                } );

                /**
                 * New rooms by selected language
                 */
                RoomService.getNewRooms( globalConfig, $stateParams.id ).then( response => {
                    $scope.newRoomList = response.data;
                } );

                $scope.slickConfigUserRooms = RoomConstants.slickConfigUserRooms;
                $scope.slickConfigRooms = RoomConstants.slickConfigRooms;
                /**
                 * Room Pagination
                 * @param type
                 * @param direction
                 */
                $scope.slickConfigRooms.method.getRoomPages = ( type, direction ) => {
                    $scope.limitReached = {};

                    if ( $scope.limitReached[ type ] !== direction && $scope.roomPages[ type ] + parseInt( direction ) >= 0 ) {
                        $scope.roomPages[ type ] = $scope.roomPages[ type ] + parseInt( direction ) >= 0 ? $scope.roomPages[ type ] + parseInt( direction ) : 0;
                        RoomService.getRoomPages( globalConfig, $stateParams.id || GlobalConstants.states.room.CATEGORY.general, type, $scope.roomPages[ type ] )
                            .then( response => {
                                if ( response.data && response.data.length > 0 ) {
                                    $scope.limitReached[ type ] = 0;

                                    switch ( type ) {
                                        case 'hot':
                                            $scope.hotRoomList = response.data;
                                            $scope.hotRoomListPageDisplay = $scope.roomPages.hot < 10 ? '0-10' : $scope.roomPages.hot + '-' + ( $scope.roomPages.hot + 10 );
                                            break;
                                        case 'latest':
                                            $scope.newRoomList = response.data;
                                            $scope.newRoomListPageDisplay = $scope.roomPages.latest < 10 ? '0-10' : $scope.roomPages.latest + '-' + ( $scope.roomPages.latest + 10 );
                                            break;
                                    }
                                } else {
                                    $scope.limitReached[ type ] = direction;
                                    $scope.roomPages[ type ] = $scope.roomPages[ type ] - parseInt( direction );
                                }
                            } );
                    }
                };
            };

            /**
             *
             * @param id -existing room (for update)
             * @param data -room from news (room from news)
             */
            $scope.addRoom = ( id, data ) => {
                const dialogParams = RoomConstants.dialogParams.add;
                dialogParams.args = {
                    config: globalConfig,
                    id: id,
                    data: data,
                    category: $stateParams.id || GlobalConstants.states.room.CATEGORY.general
                };

                GlobalFunctionsDialog.showModalDialog( dialogParams.template, dialogParams, null, dialogParams.controller ).then(
                    roomData => {
                        if ( roomData.message ) {
                            MessengerService.addMessage( globalConfig, roomData._id, tokenObj.loginDetails.userId, roomData ).then( () => {
                                $state.go( GlobalConstants.states.messenger.NAME, { title: roomData.titleNorm } );
                            } );
                        }
                    }
                );
            };

            getRoomList();

            $scope.normalizeTitle = str => {
                return GlobalFunctionsString.removeDiacritics( str );

            };

            $scope.deleteRoom = id => {
                GlobalFunctionsDialog.showConfirmDialog( RoomConstants.dialogParams.delete ).then( () => {
                    RoomService.deleteRoom( globalConfig, id ).then( () => {
                        getRoomList();
                    } );
                } );
            };

            $scope.showLogin = () => {
                UserService.showLoginForm();
            };

            $scope.getNewsTpl = () => 'src/app/room/room-news.tpl.html';

            const getPageData = ( config, index, category ) => {
                return RoomService.getRoomsByPage(
                    config,
                    category,
                    ( index * $scope.viewPort.itemsPerPage ),
                    $scope.viewPort.itemsPerPage,
                    $scope.viewPort.query
                ).then(
                    result => {
                        $scope.filteredData = result.data;
                        count = Math.floor( $scope.filteredData.total / $scope.viewPort.itemsPerPage );
                        $scope.totalRows = GlobalFunctionsObject.makeArrayFromNumber( count > 0 ? count + 1 : 1 );
                        $scope.filteredRoomList = $scope.filteredData.docs;
                    }
                );
            };

            $scope.search = () => {
                if ( $scope.viewPort.query.length > 1 ) {
                    getPageData( globalConfig, 0, $scope.selectedCategory );
                }
            };

            $scope.setPage = index => {
                if ( index >= 0 && index <= Math.floor( $scope.msgData.total / $scope.viewPort.itemsPerPage ) ) {
                    getPageData( globalConfig, index, $scope.room ).then( () => {
                        $scope.viewPort.currentPage = index;
                    } );
                }
            };

        } ] );

} )( window.angular );
