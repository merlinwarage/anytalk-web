( function ( angular ) {


    angular.module( 'appModule.room' ).controller( 'NewRoomDialogController', [
        '$scope', '$uibModalInstance', '$translate', 'GlobalConstants', 'RoomConstants', 'dialogParam', 'RoomService', 'AuthService',
        'GlobalFunctionsString', 'webNotification',
        function ( $scope, $uibModalInstance, $translate, GlobalConstants, RoomConstants, dialogParam, RoomService, AuthService,
                   GlobalFunctionsString, webNotification ) {

            const tokenObj = AuthService.get( GlobalConstants.system.AUTH_TOKEN_KEY );
            $scope.formData = {};
            $scope.homeState = GlobalConstants.states.room.CATEGORY.general;

            /**
             * If we have args.id we will modify an existing room, so we query the room
             * If we have args.data we prepare a room for an article
             */
            if ( dialogParam.args.config ) {
                $scope.formData = { category: dialogParam.args.category };
                if ( dialogParam ) {
                    if ( dialogParam.args.id ) {
                        RoomService.getRoom( dialogParam.args.config, dialogParam.args.id ).then( response => {
                            $scope.formData = response.data;
                        } );
                    } else if ( dialogParam.args.data ) {
                        $scope.formData = {
                            title: dialogParam.args.data.title,
                            description: dialogParam.args.data.description,
                            language: AuthService.get( GlobalConstants.settings.LANGUAGE ),
                            category: GlobalConstants.states.room.CATEGORY[ dialogParam.args.category ],
                            type: GlobalConstants.states.room.TYPE.article,
                            url: dialogParam.args.data.url,
                            urlToImage: dialogParam.args.data.urlToImage,
                            messageCount: 0,
                            closed: false,
                            private: false,
                            featured: false
                        };
                    }
                    $scope.dialogParam = dialogParam;
                    $scope.dialogParam.permission = tokenObj.loginDetails.userPermission;
                }
            } else {
                return false;
            }

            $scope.cancelError = function () {
                $scope.errorMsg = GlobalConstants.common.EMPTY_STRING;
            };

            /**
             * 1 When we create a room we have to fill the title and message, when we modify, we have to fill only the title
             * 2 We use the login id if the formData does not have that already
             * 3 We generating an url-normalized title from the title
             * 4 If the room set as private we generate a prefix for it
             * 5 if we have the normalized title, we create the room
             * 6 After we have the room, we fill the formData with the lang data and the inserted record`s id
             * 7 We sending back the formdata for the parent controller
             * @returns false || formData
             */
            $scope.confirmOK = function () {
                if (
                    ( !dialogParam.args.id && $scope.formData.title && $scope.formData.title.length > 2 && $scope.formData.message && $scope.formData.message.length > 30 ) ||
                    ( dialogParam.args.id && $scope.formData.title && $scope.formData.title.length > 2 )
                ) {

                    $scope.formData.user = !$scope.formData.user ? tokenObj.loginDetails.userId : $scope.formData.user._id;
                    $scope.formData.titleNorm = $scope.formData.title ? GlobalFunctionsString.removeDiacritics( $scope.formData.title ) : false;

                    if ( $scope.formData.private ) {
                        const dc = new Date().getMinutes();
                        $scope.formData.titleNorm = 'P' + dc + '-' + $scope.formData.titleNorm;
                    }

                    if ( $scope.formData.titleNorm ) {
                        RoomService.addRoom( dialogParam.args.config, $scope.formData ).then( result => {

                            if ( result.errorMessage ) {
                                $scope.errorMsg = GlobalFunctionsString.errorParse( result.errorMessage );
                                return false;
                            }

                            $scope.formData.language = AuthService.get( GlobalConstants.settings.LANGUAGE );
                            $scope.formData._id = result._id;

                            //Notification
                            if ( !result.private ) {
                                webNotification.showNotification( $translate.instant( 'entities.rooms.label.add' ), {
                                        body: $translate.instant( 'entities.rooms.label.newRoomCreated' ) + result.title,
                                        icon: 'assets/images/favicon.ico',
                                        // onClick: function onNotificationClicked() {
                                        //     console.log('Notification clicked.');
                                        // },
                                        autoClose: 10000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                                    }
                                    // , function onShow(error, hide) {
                                    //     if (error) {
                                    //         window.alert('Unable to show notification: ' + error.message);
                                    //     } else {
                                    //         console.log('Notification Shown.');
                                    //         setTimeout(function hideNotification() {
                                    //             console.log('Hiding notification....');
                                    //             hide(); //manually close the notification (you can skip this if you use the autoClose option)
                                    //         }, 5000);
                                    //     }
                                    // }
                                );
                            }

                            $uibModalInstance.close( $scope.formData );
                        } );
                    }
                } else {
                    $scope.errorMsg = RoomConstants.messages.missingData;
                    return null;
                }
            };

            $scope.confirmCancel = function () {
                $uibModalInstance.dismiss( 'cancel' );
            };
        } ] );

} )( window.angular );
