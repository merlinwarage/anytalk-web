( function ( angular ) {


    /**
     * @param {{SERVER_URL:string}} config
     */

    angular.module( 'appModule.messenger' ).service( 'RoomService', [
        '$q', 'XHR', 'GlobalConstants',
        function ( $q, XHR, GlobalConstants ) {

            const vm = this;

            /** Rooms
             *
             */

            /**
             *
             * @param config
             * @param roomData
             * @returns {Promise|Promise.<>|IPromise<>|*}
             */
            this.addRoom = ( config, roomData ) => {

                console.log( config, roomData );
                if ( config.SERVER_URL ) {
                    return XHR.save( config.SERVER_URL + GlobalConstants.states.room.API.add, {}, roomData ).then(
                        result => result,
                        err => err
                    );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            this.getRoomPages = ( config, category, type, direction ) => {
                switch ( type ) {
                    case 'hot':
                        return vm.getHotRooms( config, category, direction );
                    case 'latest':
                        return vm.getNewRooms( config, category, direction );
                }
            };

            /**
             *
             * @param config
             * @returns {*}
             */
            this.getPrivateRooms = ( config ) => {
                if ( config.SERVER_URL ) {
                    return XHR.get( config.SERVER_URL + GlobalConstants.states.room.API.getPrivates );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            this.getFavoriteRooms = ( config ) => {
                if ( config.SERVER_URL ) {
                    return XHR.get( config.SERVER_URL + GlobalConstants.states.room.API.getFavorites );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };
            this.getFeaturedRooms = ( config ) => {
                if ( config.SERVER_URL ) {
                    return XHR.get( config.SERVER_URL + GlobalConstants.states.room.API.getFeatured );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };
            this.getHotRooms = ( config, category, pageModifier ) => {
                if ( config.SERVER_URL ) {
                    return XHR.get( config.SERVER_URL + GlobalConstants.states.room.API.getHot, {
                        category: category,
                        pageModifier: pageModifier || 0
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };
            this.getNewRooms = ( config, category, pageModifier ) => {
                if ( config.SERVER_URL ) {
                    return XHR.get( config.SERVER_URL + GlobalConstants.states.room.API.getNew, {
                        category: category,
                        pageModifier: pageModifier || 0
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };


            /**
             *
             * @param config
             * @param roomTitle
             * @returns {*}
             */
            this.getRoomByTitle = ( config, roomTitle ) => {
                if ( config.SERVER_URL ) {
                    return XHR.get( config.SERVER_URL + GlobalConstants.states.room.API.getOneByTitle, { title: roomTitle } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            /**
             *
             * @param config
             * @param roomId
             * @returns {*}
             */
            this.getRoom = ( config, roomId ) => {
                if ( config.SERVER_URL ) {
                    return XHR.get( config.SERVER_URL + GlobalConstants.states.room.API.getOneById, { id: roomId } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            /**
             *
             * @param config
             * @param category
             * @param from
             * @param to
             * @param search
             * @returns {Promise|Promise.<>|IPromise<>|*}
             */
            this.getRoomsByPage = ( config, category, from, to, search ) => {
                if ( config.SERVER_URL ) {
                    return XHR.save( config.SERVER_URL + GlobalConstants.states.room.API.getByPages, {}, {
                        category: category,
                        from: from,
                        to: to,
                        query: {
                            'title': '%' + search
                        }
                    } ).then( function ( result ) {
                        return result;
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            /**
             *
             * @param config
             * @param roomId
             * @returns {*}
             */
            this.deleteRoom = ( config, roomId ) => {
                if ( config.SERVER_URL ) {
                    return XHR.delete( config.SERVER_URL + GlobalConstants.states.room.API.delete, {
                        id: roomId
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            /** Members
             *
             */

            /**
             *
             * @param config
             * @param roomId
             * @param userId
             * @returns {Promise|Promise.<>|IPromise<>|*}
             */
            this.addMember = ( config, roomId, userId ) => {
                return XHR.save( config.SERVER_URL + GlobalConstants.states.room.API.addMember, {}, {
                    room: roomId,
                    member: userId
                } ).then( function ( response ) {
                    return response;
                } );
            };

            /**
             *
             * @param config
             * @param roomId
             * @param userId
             * @returns {Promise|Promise.<>|IPromise<>|*}
             */
            this.removeMember = ( config, roomId, userId ) => {
                return XHR.update( config.SERVER_URL + GlobalConstants.states.room.API.addMember, {}, {
                    room: roomId,
                    member: userId
                } ).then( function ( response ) {
                    return response;
                } );
            };

            /**
             *
             * @param members
             * @param userId
             * @returns {boolean}
             */
            this.isMember = ( members, userId ) => {
                for ( let key in members ) {
                    if ( members.hasOwnProperty( key ) && members[ key ]._id === userId ) {
                        return true;
                    }
                }
            };

            /** News
             *
             */

            /**
             *
             * @param config
             * @param language
             * @param category
             * @param itemCount
             * @returns {Promise|Promise.<>|IPromise<>|*}
             */
            this.getNews = ( config, language, category, itemCount, noImages ) => {
                return XHR.save( config.SERVER_URL + GlobalConstants.states.room.API.getNews, {}, {
                    language: language,
                    category: category,
                    itemCount: itemCount,
                    noImages: noImages
                }, true, true ).then( function ( response ) {
                    return response.data;
                }, function ( err ) {
                    return err;
                } );
            };

        } ] );
} )( window.angular );
