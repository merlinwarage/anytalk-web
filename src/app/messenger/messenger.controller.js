(function ( angular ) {
    'use strict';

    angular.module('appModule.messenger').controller('MessengerController', [
        '$rootScope', '$scope', '$state', '$window', '$location', '$stateParams', '$document', '$anchorScroll', 'GlobalConstants', 'AuthService',
        'GlobalFunctionsObject', 'GlobalFunctionsDialog', 'GlobalFunctionsJQ', 'GlobalFunctionsString', 'TableUtilsService',
        'GlobalConfigCacheService', 'socket', 'formElementFocus', 'MessengerConstants', 'MessengerService',
        'RoomService', 'UserService', '$timeout',
        function ( $rootScope, $scope, $state, $window, $location, $stateParams, $document, $anchorScroll, GlobalConstants, AuthService,
                   GlobalFunctionsObject, GlobalFunctionsDialog, GlobalFunctionsJQ, GlobalFunctionsString, TableUtilsService,
                   GlobalConfigCacheService, socket, formElementFocus, MessengerConstants, MessengerService, RoomService,
                   UserService, $timeout ) {

            $timeout(function () {
                var tokenObj = $scope.tokenObj = AuthService.get(GlobalConstants.system.AUTH_TOKEN_KEY);
                var globalConfig = GlobalConfigCacheService.getConfigObject(GlobalConstants.system.GLOBAL_CONFIG_KEY);

                var count = 0;
                var dialogParams = {};
                var parsedData = {};
                var message = GlobalConstants.common.EMPTY_STRING;
                var tableConfig = {
                    sortingOrder: 'createdAt',
                    reverse: true,
                    itemsPerPage: 50,
                    currentPage: 0,
                    pagination: {url: GlobalConstants.states.messenger.API.getByPages}
                };

                $scope.emoji = MessengerConstants.emoji;

                $scope.errorMsg = GlobalConstants.common.EMPTY_STRING;
                $scope.formData = {message: ''};
                $scope.msgData = {};
                $scope.roomData = {};
                $scope.tableData = [];
                $scope.newMessagesCount = GlobalConstants.common.ZERO;
                $scope.replyData = GlobalConstants.common.EMPTY_STRING;
                $scope.replyParent = GlobalConstants.common.EMPTY_STRING;
                $scope.dateFormat = globalConfig.settings.DEFAULTS.dateformat.code + ' HH:mm';
                $scope.users = [];
                $scope.favorite = false;
                $scope.viewPort = TableUtilsService.initFunctions(false, MessengerConstants.viewPort.name, tableConfig);

                $scope.replyModel = {};
                $scope.editModel = {};
                $scope.replyModel.cancelError = function () {
                    $scope.errorMsg = GlobalConstants.common.EMPTY_STRING;
                };

                $scope.replyModel.cancelReply = function ( cancel ) {
                    $scope.replyModel.replyToUser = GlobalConstants.common.EMPTY_STRING;
                    $scope.replyModel.replyToUserLabel = GlobalConstants.common.EMPTY_STRING;
                    $scope.replyModel.replyToMessageId = GlobalConstants.common.EMPTY_STRING;
                    $scope.replyParent = GlobalConstants.common.EMPTY_STRING;
                    if (cancel) {
                        $scope.goTo = GlobalConstants.common.EMPTY_STRING;
                    }
                };

                var initRoom = function ( config, roomTitle ) {
                    RoomService.getRoomByTitle(config, roomTitle).then(function onSuccess( response ) {
                        if (response.data) {
                            $scope.roomData.roomSelected = response.data;
                            if ($scope.roomData.roomSelected.urlToImage) {
                                var defaultImage = globalConfig.SERVER_IMAGES_URL + MessengerConstants.defaults.noImage;
                                RoomService.isImage($scope.roomData.roomSelected.urlToImage).then(function ( result ) {
                                    $scope.roomData.roomSelected.urlToImage = result && uploadResult.status === 200 ? $scope.roomData.roomSelected.urlToImage : defaultImage;
                                });
                            }
                        } else {
                            $state.go(GlobalConstants.states.room.NAME);
                        }
                    });

                    if ($stateParams.msg === 'invite') {
                        RoomService.getRoomByTitle(globalConfig, $stateParams.title).then(function ( roomData ) {
                            if (roomData.data.user !== tokenObj.loginDetails.userId) {
                                RoomService.addMember(globalConfig, roomData.data._id, tokenObj.loginDetails.userId).then(function () {
                                    $state.transitionTo($state.current, {
                                        id: $stateParams.id,
                                        title: $stateParams.title
                                    }, {
                                        reload: true, inherit: false, notify: true
                                    });
                                });
                            }
                        });
                        // RoomService.removeMember(globalConfig, '58596586d36956292411b288', '584b34d7ae138f2ab0840892');
                    } else {
                        $scope.goTo = $stateParams.msg;
                    }

                };
                initRoom(globalConfig, $stateParams.title);

                var getFavoriteRoomList = function () {
                    if (tokenObj && tokenObj.token) {
                        RoomService.getFavoriteRooms(globalConfig).then(function onSuccess( response ) {
                            $scope.favoriteRoomList = response.data;
                        });
                    }
                };
                getFavoriteRoomList();

                socket.on('user:update', function ( data ) {
                    $scope.users = data[$scope.room];
                });

                /****************************************/

                socket.on('send:message', function ( message ) {
                    if ($scope.viewPort.currentPage === 0 && $scope.viewPort.query === '') {
                        $scope.msgData.docs.unshift({
                            _id: message._id,
                            room: $scope.room,
                            user: {id: message.userId, name: message.userName},
                            message: message.message,
                            replyTo: {
                                _id: message.replyTo._id,
                                name: message.replyTo.name
                            },
                            createdAt: message.createdAt
                        });

                        parsedData = MessengerService.parseMessages($scope.msgData);
                        $scope.tableData = parsedData.docs;
                        $scope.newMessagesCount = 0;
                        $scope.msgData.total++;
                    } else {
                        $scope.newMessagesCount++;
                    }
                });

                var getPageData = function ( config, index, room ) {
                    return MessengerService.getMessageByPage(
                        config,
                        room,
                        (index * $scope.viewPort.itemsPerPage),
                        $scope.viewPort.itemsPerPage,
                        $scope.viewPort.query)
                        .then(
                            function onSuccess( result ) {
                                $scope.msgData = MessengerService.parseMessages(result.data);
                                count = Math.floor($scope.msgData.total / $scope.viewPort.itemsPerPage);
                                $scope.totalRows = GlobalFunctionsObject.makeArrayFromNumber(count > 0 ? count + 1 : 1);
                                $scope.tableData = $scope.msgData.docs;
                                $scope.newMessagesCount = 0;
                            }
                        );
                };

                $scope.addTag = function ( tag ) {
                    switch (tag) {
                        case 'bold': {
                            $scope.$emit('insert', '[b]placeholder[/b]');
                            break;
                        }
                        case 'italic': {
                            $scope.$emit('insert', '[i]placeholder[/i]');
                            break;
                        }
                        case 'off': {
                            $scope.$emit('insert', '[off]placeholder[/off]');
                            break;
                        }
                        case 'spoiler': {
                            $scope.$emit('insert', '[spoiler]placeholder[/spoiler]');
                            break;
                        }
                        case 'code': {
                            $scope.$emit('insert', '[code]placeholder[/code]');
                            break;
                        }
                    }
                };

                $scope.showModalContent = function ( url, entity ) {
                    switch (entity) {
                        case 'youtube': {
                            dialogParams = {
                                template: 'assets/messagedialog/templates/media.tpl.html',
                                controller: 'defaultModalDialogController',
                                windowClass: 'modal-dialog-media',
                                backdrop: true,
                                media: {url: url, entity: entity}
                            };
                            GlobalFunctionsDialog.showModalDialog(dialogParams.template, dialogParams, undefined, dialogParams.controller);
                            break;
                        }
                        case 'img': {
                            GlobalFunctionsDialog.showImageModal(url);
                        }
                    }
                };

                $scope.getMessagePostTpl = function () {
                    return 'src/app/messenger/messenger-post.tpl.html';
                };
                $scope.getMessageTpl = function () {
                    return 'src/app/messenger/messenger-message.tpl.html';
                };
                $scope.getReplyTpl = function () {
                    return 'src/app/messenger/messenger-reply.tpl.html';
                };

                $scope.getReplyHistory = function ( parentId, messageId, child ) {
                    var close = ($scope.replyData.length && parentId === $scope.replyParent);

                    if (!child) {
                        $scope.replyData = [];
                        $scope.replyParent = parentId;
                    }

                    if (!close) {
                        MessengerService.getMessagesById(globalConfig, $scope.room, messageId).then(function ( item ) {
                            var isInThere = false;

                            for (var i in $scope.replyData) {
                                if ($scope.replyData[i]._id === item.data._id) {
                                    isInThere = true;
                                    $scope.replyData.splice(parseInt(i), $scope.replyData.length);
                                    return;
                                }
                            }

                            if (!isInThere) {
                                item.data.message = MessengerService.parseMessage(item.data.message);
                                $scope.replyData.push(item.data);
                            }
                        });
                    }
                };

                $scope.isItCode = function ( str ) {
                    return !!str.match(/\[\/?code\]/g);
                };

                $scope.clear = function ( str ) {
                    return str.replace(/\[\/?code\]/g, '');
                };

                $scope.addMessage = function () {
                    if (!!$scope.formData.message.match(/(<([^>]+)>)/ig) && !$scope.formData.message.match(/\[\/?code\]/g)) {
                        $scope.errorMsg = 'Invalid content!';
                        return false;
                    }

                    if ($scope.formData.message && $scope.formData.message.length > 1) {
                        message = $scope.formData.message;

                        MessengerService.addMessage(globalConfig, $scope.room, tokenObj.loginDetails.userId, $scope.formData, $scope.replyModel.replyToMessageId, $scope.replyModel.replyToUser)
                            .then(
                                function onSuccess( result ) {
                                    $scope.errorMsg = GlobalConstants.common.EMPTY_STRING;

                                    if (result.error) {
                                        $scope.errorMsg = result.error;
                                    } else {

                                        socket.emit('send:message', {
                                            _id: result.data._id,
                                            room: $scope.room,
                                            userId: tokenObj.loginDetails.userId,
                                            userName: tokenObj.loginDetails.userName,
                                            message: message,
                                            replyTo: {
                                                _id: $scope.replyModel.replyToMessageId,
                                                name: $scope.replyModel.replyToUser
                                            },
                                            createdAt: result.data.createdAt
                                        });
                                    }

                                    if (!$scope.errorMsg) {
                                        $scope.formData.message = GlobalConstants.common.EMPTY_STRING;
                                        // $scope.$emit('clear');
                                        // $scope.formData = {message: ''};
                                        $scope.replyModel.cancelReply(true);
                                        $document.duScrollTopAnimated(0);
                                        $scope.setPage(0);
                                    }
                                }
                            );

                    } else {
                        $scope.errorMsg = 'Message is too short!';
                    }

                    if (!$scope.errorMsg) {
                        formElementFocus('message-area');
                    }
                };

                $scope.keyPressSubmit = function ( event ) {
                    //CTRL + ENTER
                    if ((event.which === 13) && event.ctrlKey) {
                        $scope.addMessage();
                    }

                    //CTRL + b
                    if ((event.which === 66) && event.ctrlKey) {
                        $scope.addTag('bold');
                    }

                    //CTRL + i
                    if ((event.which === 73) && event.ctrlKey) {
                        $scope.addTag('italic');
                    }

                    //TAB
                    if (event.which === 9) {
                        event.preventDefault();
                        var start = event.target.selectionStart;
                        var end = event.target.selectionEnd;
                        $scope.formData.message = $scope.formData.message.substring(0, start) + '\t' + $scope.formData.message.substring(end);
                        angular.element(event.target).val($scope.formData.message);
                        event.target.selectionStart = event.target.selectionEnd = start + 1;
                    }
                };

                $scope.itIsMe = function ( id ) {
                    return tokenObj && id === tokenObj.loginDetails.userId;
                };

                $scope.itHasPerm = function () {
                    return tokenObj && tokenObj.loginDetails.userPermission === GlobalConstants.permissionCodes.admin;
                };

                $scope.reply = function ( userMessage, index, clear ) {
                    $scope.goTo = index;
                    // $anchorScroll(index);

                    if (clear) {
                        $scope.replyModel.cancelReply(false);
                    }

                    $scope.replyModel.replyToUser = userMessage.user.name;
                    $scope.replyModel.replyToUserLabel = {'name': userMessage.user.name};
                    $scope.replyModel.replyToMessageId = userMessage._id;

                    $timeout(function () {
                        $scope.$emit('focus');
                        // formElementFocus('message-area');
                    });
                };

                $scope.editMessage = function ( userMessage, index, clear ) {
                    $scope.goTo = index;

                    if (clear) {
                        $scope.editModel.cancelEdit(false);
                    }

                    $scope.editModel.data = userMessage;

                    $timeout(function () {
                        $scope.$emit('focus');
                    });
                };

                $scope.cancelError = function () {
                    $scope.errorMsg = GlobalConstants.common.EMPTY_STRING;
                    formElementFocus('message-area');
                };

                $scope.search = function () {
                    getPageData(globalConfig, 0, $scope.room);
                };

                $scope.setPage = function ( index ) {
                    if (index >= 0 && index <= Math.floor($scope.msgData.total / $scope.viewPort.itemsPerPage)) {
                        getPageData(globalConfig, index, $scope.room).then(function onSuccess() {
                            $scope.viewPort.currentPage = index;
                        });
                    }
                };

                $scope.deleteMessage = function ( id ) {
                    GlobalFunctionsDialog.showConfirmDialog(MessengerConstants.dialogParams.delete).then(function onSuccess() {
                        MessengerService.deleteMessage(globalConfig, $scope.room, id).then(function onSuccess() {
                            GlobalFunctionsObject.deleteObjectByProperty($scope.tableData, '_id', id);
                        });
                    });
                };

                $scope.voteMessage = function ( messageId, vote ) {
                    MessengerService.voteMessage(globalConfig, $scope.room, messageId, vote).then(function () {
                        return vote > 0 ? $scope.userActivities.up.push(messageId) : $scope.userActivities.down.push(messageId);
                    });
                };

                $scope.setFavorite = function () {
                    MessengerService.setFavorite(globalConfig, $scope.room, $scope.favorite);
                    $scope.favorite = !$scope.favorite;
                };

                $scope.openNews = function ( url ) {
                    $window.open(url, '_blank');
                };

                $scope.isFavorite = function ( room ) {
                    if ($scope.userActivities && $scope.userActivities.favorites) {
                        return $scope.userActivities.favorites.indexOf(room._id) === -1;
                    } else {
                        return true;
                    }
                };

                $scope.msgCount = function ( msg ) {
                    return ($scope.msgData.total - (msg + ($scope.viewPort.currentPage * $scope.viewPort.itemsPerPage))).toString();
                };

                $scope.toTheTop = function () {
                    $document.duScrollTopAnimated(0);
                };

                $scope.$watch('roomData.roomSelected', function ( value ) {
                    if (value) {
                        $scope.room = $scope.roomData.roomSelected._id;
                        getPageData(globalConfig, 0, $scope.room);

                        if (tokenObj && tokenObj.loginDetails) {
                            socket.emit('user:left', tokenObj.loginDetails.userId);
                            socket.emit('user:join', {
                                room: $scope.room,
                                userId: tokenObj.loginDetails.userId,
                                userName: tokenObj.loginDetails.userName,
                                lastActivity: new Date().toISOString()
                            });

                            UserService.getUserActivities(globalConfig, tokenObj.loginDetails.userId).then(function ( user ) {
                                $scope.userActivities = user.activities;
                                $scope.favorite = ($scope.userActivities && $scope.userActivities.favorites && $scope.userActivities.favorites.indexOf($scope.room) !== -1);
                            });
                        }
                    }
                });
            }, 200);
        }
    ]);

})(window.angular);