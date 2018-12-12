(function (angular) {


    angular.module("appModule.messenger").directive('dynamicBind', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, ele, attrs) {
                scope.$watch(attrs.dynamicBind, function (html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    });

    angular.module("appModule.messenger").directive('youtubeTitle', [
        "GlobalConstants", "GlobalConfigCacheService", "MessengerService",
        function (GlobalConstants, GlobalConfigCacheService, MessengerService) {
            return {
                restrict: 'A',
                replace: true,
                template: '<div class="color-white">{{vTitle}}</div>',
                scope: {},
                link: function (scope, ele, attrs) {
                    var globalConfig = GlobalConfigCacheService.getConfigObject(GlobalConstants.system.GLOBAL_CONFIG_KEY);
                    MessengerService.getYoutubeData(globalConfig, attrs.youtubeTitle).then(function (data) {
                        scope.vTitle = undefined;
                        angular.forEach(data.items, function (item) {
                            if (item.id.videoId === attrs.youtubeTitle) {
                                scope.vTitle = item.snippet.title;
                            }
                        });
                    });
                }
            };
        }]);

    angular.module("appModule.messenger").directive('textarea', ['$rootScope', function ($scope) {
        return {
            link: function (scope, element) {
                $scope.$on('clear', function () {
                    element[0].value = '';
                });

                $scope.$on('focus', function () {
                    element[0].focus();
                });

                $scope.$on('insert', function (e, val) {
                    var domElement = element[0];

                    String.prototype.replaceBetween = function (start, end, what) {
                        return this.substring(0, start) + what + this.substring(end);
                    };

                    var textarea = domElement;
                    var value = textarea.value;
                    var startPos = textarea.selectionStart;
                    var endPos = textarea.selectionEnd;
                    var selectedText = value.substring(startPos, endPos);

                    var old = textarea.value;
                    textarea.value = old.replaceBetween(startPos, endPos, val.replace('placeholder', selectedText));

                    // scope.formData.message = domElement.value;
                });
            }
        };
    }]);

    angular.module("appModule.messenger").directive('modalDraggable', function ($document) {
        return function (scope, element) {
            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;
            element = angular.element(document.getElementsByClassName("modal-dialog"));
            element.css({
                position: 'relative',
                cursor: 'move',
                top: startY + 'px',
                left: startX + 'px'
            });

            element.on('mousedown', function (event) {
                event.preventDefault();
                startX = event.screenX - x;
                startY = event.screenY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.screenY - startY;
                x = event.screenX - startX;
                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        };
    });

})(window.angular);
