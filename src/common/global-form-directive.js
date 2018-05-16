angular.module("appModule").factory('formElementFocus', function ($timeout, $window) {
    return function (id) {
        $timeout(function () {
            var element = $window.document.getElementById(id);
            if (element) {
                element.focus();
            }
        });
    };
});

angular.module("appModule").directive('eventFocus', function (focus) {
    return function (scope, elem, attr) {
        elem.on(attr.eventFocus, function () {
            focus(attr.eventFocusId);
        });

        scope.$on('$destroy', function () {
            element.off(attr.eventFocus);
        });
    };
});