angular.module("appModule").directive('headerMessage', function () {
    return {
        controller: ["$scope", "$element", "$attrs", "GlobalConstants", "GlobalFunctionsTimer", "$translate",
            function ($scope, $element, $attrs, GlobalConstants, GlobalFunctionsTimer, $translate) {
                
                var ERROR_MESSAGE_START = 'entities.';

                $scope.messages = [];
                $scope.lastIndex = -1;

                $scope.$on(GlobalConstants.event.broadcast.HEADER_MESSAGE, function (event, args) {
                        if (args.entityType !== GlobalConstants.entity_type.NO_MESSAGE) {
                            $scope.lastIndex++;
                            if (args.entityType === GlobalConstants.entity_type.DESTROY) {
                                //destroy all messages
                                $scope.messages = [];
                            } else {
                                if (!args.message) {
                                    var parameters = args.parameters ? args.parameters : {};
                                    var messageCfg = {
                                        result: args.result,
                                        entityType: args.entityType,
                                        operation: args.operation,
                                        details: args.details ? args.details : args.type === GlobalConstants.dialog_type_class.ERROR ? "No stack trace to display..." : args.details,
                                        parameters: parameters,
                                        messageClasses: args.type,
                                        showDetails: false,
                                        detailsButtonClass: 'glyphicon glyphicon-menu-right',
                                        headerMessage: translateErrorMessage(ERROR_MESSAGE_START + args.entityType + ".messages." + args.operation + "." + args.result, parameters),
                                        index: $scope.lastIndex
                                    };
                                    $scope.messages.push(messageCfg);
                                } else {
                                    $scope.messages.push({
                                        result: args.result,
                                        entityType: args.entityType,
                                        details: args.details ? args.details : args.type === GlobalConstants.dialog_type_class.ERROR ? "No stack trace to display..." : args.details,
                                        parameters: args.parameters ? args.parameters : {},
                                        messageClasses: args.type,
                                        showDetails: false,
                                        detailsButtonClass: 'glyphicon glyphicon-menu-right',
                                        headerMessage: $translate.instant(args.message),
                                        index: $scope.lastIndex
                                    });
                                }
                            }

                            //GlobalFunctionsTimer.cancelAll();
                            if (args.type !== GlobalConstants.dialog_type_class.ERROR && args.type !== GlobalConstants.dialog_type_class.WARNING) {
                                var index = $scope.lastIndex;
                                GlobalFunctionsTimer.addTimer(GlobalConstants.timer.STATUSDIALOG_HIDE.name + $scope.lastIndex,
                                    function () {
                                        $scope.emptyMessage(
                                            function () {
                                                return index;
                                            });
                                    },
                                    GlobalConstants.timer.STATUSDIALOG_HIDE.delay
                                );
                            }

                        }
                    }
                );


                $scope.emptyMessage = function (index) {
                    if (index === GlobalConstants.common.UNDEFINED) {
                        index = 0;
                    }
                    for (var i = 0; i < $scope.messages.length; i++) {
                        if ($scope.messages[i].index === index()) {
                            $scope.messages.splice(i, 1);
                            return;
                        }
                    }
                };

                $scope.emptyMessageByRepeatIndex = function (index) {
                    $scope.messages.splice(index, 1);
                };

                $scope.getTemplateUrl = function () {
                    return GlobalConstants.states.header.header_message.TPL;
                };

                $scope.detailsControl = function (message) {
                    if (message.showDetails) {
                        message.showDetails = false;
                        message.detailsButtonClass = "glyphicon glyphicon-menu-right";
                    } else {
                        message.showDetails = true;
                        message.detailsButtonClass = "glyphicon glyphicon-menu-down";
                    }
                };

                function translateErrorMessage(msg, params) {
                    var result = $translate.instant(msg, params);
                    if (result.indexOf(ERROR_MESSAGE_START) !== -1){
                        result = $translate.instant('message.common.error');
                    }
                    return result;
                }

            }],

        template: '<ng-include src="getTemplateUrl()"/>',
        restrict: 'E',
        replace: true
    }
        ;
})
;