( function ( angular ) {


    angular.module( 'appModule.messenger' ).factory( 'socket', function ( $rootScope ) {
        var socket = io.connect();
        return {
            on: function ( eventName, callback ) {
                socket.on( eventName, function () {
                    var args = arguments;
                    $rootScope.$apply( function () {
                        callback.apply( socket, args );
                    } );
                } );
            },
            emit: function ( eventName, data, callback ) {
                socket.emit( eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply( function () {
                        if ( callback ) {
                            callback.apply( socket, args );
                        }
                    } );
                } );
            }
        };
    } );

    angular.module( 'appModule.messenger' ).service( 'MessengerService', [
        'XHR', 'GlobalConstants', 'youtubeEmbedUtils', 'GlobalFunctionsString',
        function ( XHR, GlobalConstants, youtubeEmbedUtils, GlobalFunctionsString ) {

            this.addMessage = function ( config, room, userId, data, replyToMessageId, replyToMessageName ) {
                if ( config.SERVER_URL ) {
                    return XHR.save( config.SERVER_URL + GlobalConstants.states.messenger.API.add, false, {
                        room: room,
                        user: userId,
                        message: data.message,
                        replyToId: replyToMessageId,
                        replyToName: replyToMessageName
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            this.editMessage = function ( config, room, userId, data, replyToMessageId, replyToMessageName, messageId ) {
                if ( config.SERVER_URL ) {
                    return XHR.update( config.SERVER_URL + GlobalConstants.states.messenger.API.update, false, {
                        room: room,
                        user: userId,
                        message: data.message,
                        replyToId: replyToMessageId,
                        replyToName: replyToMessageName,
                        messageId: messageId
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            this.voteMessage = function ( config, room, messageId, vote ) {
                if ( config.SERVER_URL ) {
                    return XHR.update( config.SERVER_URL + GlobalConstants.states.messenger.API.vote, false, {
                        room: room,
                        messageId: messageId,
                        vote: vote
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            this.setFavorite = function ( config, roomId, state ) {
                if ( state ) {
                    return XHR.update( config.SERVER_URL + GlobalConstants.states.user.API.updateFavorites, {}, {
                        room: roomId
                    } ).then( function ( response ) {
                        return response;
                    } );
                } else {
                    return XHR.save( config.SERVER_URL + GlobalConstants.states.user.API.updateFavorites, {}, {
                        room: roomId
                    } ).then( function ( response ) {
                        return response;
                    } );
                }
            };

            this.getAllMessages = function ( config, room ) {
                if ( config.SERVER_URL ) {
                    return XHR.get( config.SERVER_URL + GlobalConstants.states.messenger.API.getAll, { room: room } ).then( function ( result ) {
                        return result;
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            this.getMessageByPage = function ( config, room, from, to, search ) {
                if ( config.SERVER_URL ) {
                    return XHR.save( config.SERVER_URL + GlobalConstants.states.messenger.API.getByPages, {}, {
                        room: room,
                        from: from,
                        to: to,
                        query: { 'message': '%' + search }
                    } ).then( function ( result ) {
                        return result;
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            this.getMessagesById = function ( config, room, messageId ) {
                return XHR.get( config.SERVER_URL + GlobalConstants.states.messenger.API.getOneById, {
                    room: room,
                    id: messageId
                } ).then( function ( result ) {
                    return result;
                } );
            };

            this.getYoutubeData = function ( config, vid ) {
                return XHR.httpGET( 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + vid + '&key=' + config.GOOGLE.apiKey, {} ).then(
                    function onSuccess( response ) {
                        return response;
                    } );
            };

            this.deleteMessage = function ( config, room, messageId ) {
                if ( config.SERVER_URL ) {
                    return XHR.delete( config.SERVER_URL + GlobalConstants.states.messenger.API.delete, {
                        room: room,
                        id: messageId
                    } );
                } else {
                    throw 'SERVER URL is undefined!';
                }
            };

            this.parseMessage = function ( str ) {
                var video, ytid, img, filename;
                var linkCnt = 0;

                if ( !str.match( /\[\/?code\]/g ) ) {
                    str = str.replace( GlobalConstants.regex.urlRegex, function ( url ) {

                        /* IMAGE */
                        if ( !!url.match( GlobalConstants.regex.imageRegex ) ) {
                            filename = GlobalFunctionsString.getFileName( url );
                            return '<div data-ng-click="showModalContent(\'' + url + '\', \'img\')" class="inline margin-right-10 clickable"><div class="thumbnail"><img data-ng-src="' + url + '" alt="' + filename + '" class="img-responsive animate-show" fade-in><div class="caption"></div></div></div></a>';

                            /* YOUTUBE */
                        } else if ( !!url.match( GlobalConstants.regex.youtubeRegex ) ) {
                            ytid = youtubeEmbedUtils.getIdFromURL( url );
                            img = 'https://i.ytimg.com/vi/' + ytid + '/default.jpg';
                            return '<div data-ng-click="showModalContent(\'' + ytid + '\', \'youtube\')" class="inline margin-right-10 clickable" id="loading-spiral"></i><div class="thumbnail"><div class="play-icon"></div><div class="thumbnail-bg" style="background-image: url(' + img + ')"></div><div youtube-title="' + ytid + '"></div></div></div>';

                            /* VIDEO */
                        } else if ( !!url.match( GlobalConstants.regex.videoRegex ) ) {
                            url = url.replace( 'gifv', 'mp4' );
                            return '<video preload="auto" muted="muted" loop="loop" data-webkit-playsinline style="width: 320px; height: 200px;" controls><source src="' + url + '" type="video/mp4">Your browser does not support the video tag.</video>';

                            /* LINK */
                        } else {
                            linkCnt++;
                            return '<a target="_blank" href="' + url + '">' + 'link#' + linkCnt + '</a>';
                        }

                    } )
                        .replace( /(?:\r\n|\r|\n)/g, '<span class="clear-both"><br/></span>' )
                        .replace( /(?:\t)/g, '&emsp;' ).replace( /\s\s\s\s/g, '&emsp;' );
                }

                /* BOLD */
                str = str.replace( /\[b\]/g, '<b>' ).replace( /\[\/b\]/g, '</b>' );

                /* ITALIC */
                str = str.replace( /\[i\]/g, '<i>' ).replace( /\[\/i\]/g, '</i>' );

                /* OFF */
                str = str.replace( /\[off\]/g, '<span style="color: #dfdfdf">' ).replace( /\[\/off\]/g, '</span>' );

                /* SPOILER */
                str = str.replace( /\[spoiler\]/g, '<div class="clickable" data-ng-click="collapsed = !collapsed"><< SPOILER >></div><div data-uib-collapse="!collapsed">' ).replace( /\[\/spoiler\]/g, '</div>' );


                return str;
            };

            this.parseMessages = function ( data ) {
                angular.forEach( data.docs, function ( item ) {
                    var video, ytid, img, filename;
                    var linkCnt = 0;

                    if ( !item.message.match( /\[\/?code\]/g ) ) {
                        item.message = item.message.replace( GlobalConstants.regex.urlRegex, function ( url ) {

                            /* IMAGE */

                            if ( !!url.match( GlobalConstants.regex.imageRegex ) ) {
                                filename = GlobalFunctionsString.getFileName( url );
                                return '<div data-ng-click="showModalContent(\'' + url + '\', \'img\')" class="inline margin-right-10 clickable"><div class="thumbnail"><img data-ng-src="' + url + '" alt="' + filename + '" class="img-responsive animate-show" fade-in><div class="caption"></div></div></div></a>';

                                /* YOUTUBE */
                            } else if ( !!url.match( GlobalConstants.regex.youtubeRegex ) ) {
                                ytid = youtubeEmbedUtils.getIdFromURL( url );
                                img = 'https://i.ytimg.com/vi/' + ytid + '/default.jpg';
                                return '<div data-ng-click="showModalContent(\'' + ytid + '\', \'youtube\')" class="inline margin-right-10 clickable" id="loading-spiral"></i><div class="thumbnail"><div class="play-icon"></div><div class="thumbnail-bg" style="background-image: url(' + img + ')"></div><div youtube-title="' + ytid + '"></div></div></div>';

                                /* VIDEO */
                            } else if ( !!url.match( GlobalConstants.regex.videoRegex ) ) {
                                url = url.replace( 'gifv', 'mp4' );
                                return '<video preload="auto" muted="muted" loop="loop" data-webkit-playsinline style="width: 320px; height: 200px;" controls><source src="' + url + '" type="video/mp4">Your browser does not support the video tag.</video>';

                                /* LINK */
                            } else {
                                linkCnt++;
                                return '<a target="_blank" href="' + url + '">' + 'link#' + linkCnt + '</a>';
                            }

                        } )
                            .replace( /(?:\r\n|\r|\n)/g, '<span class="clear-both"><br/></span>' )
                            .replace( /(?:\t)/g, '&emsp;' ).replace( /\s\s\s\s/g, '&emsp;' );
                    }

                    /* BOLD */
                    item.message = item.message.replace( /\[b\]/g, '<b>' ).replace( /\[\/b\]/g, '</b>' );

                    /* ITALIC */
                    item.message = item.message.replace( /\[i\]/g, '<i>' ).replace( /\[\/i\]/g, '</i>' );

                    /* OFF */
                    item.message = item.message.replace( /\[off\]/g, '<span style="color: #dfdfdf">' ).replace( /\[\/off\]/g, '</span>' );

                    /* SPOILER */
                    item.message = item.message.replace( /\[spoiler\]/g, '<div class="clickable" data-ng-click="collapsed = !collapsed"><< SPOILER >></div><div data-uib-collapse="!collapsed">' ).replace( /\[\/spoiler\]/g, '</div>' );
                } );

                return data;
            };

        } ] );
} )( window.angular );
