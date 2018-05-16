/**
 * <div ng-google-suggest="" data-ng-model="scope-variable"></div>
 */
angular.module('appModule').directive('ngGoogleSuggest', ['$http', '$sce', '$filter', 'GlobalConstants', 'AuthService',
    function ($http, $sce, $filter, GlobalConstants, AuthService) {
        return {
            restrict: 'AE',
            scope: {
                searchText: '=ngModel'
            },
            templateUrl: 'assets/google-suggest/google-suggest.tpl.html',
            link: function (scope, elem, attrs) {

                scope.suggestions = [];
                scope.selectedTags = [];
                scope.selectedIndex = -1; //currently selected suggestion index

                scope.clearResults = function () {
                    scope.suggestions = [];
                };

                scope.selectSearchTerm = function (index) {
                    if (scope.selectedTags.indexOf(scope.suggestions[index]) === -1) {
                        scope.searchText = scope.suggestions[index];
                        scope.clearResults();
                    }
                };

                var lang = AuthService.get(GlobalConstants.settings.LANGUAGE);
                scope.search = function () {
                    // If searchText empty, don't search
                    if (scope.searchText == null || scope.searchText.length < 1) {
                        return;
                    }

                    var url = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=' + lang + '&q=' + encodeURIComponent(scope.searchText);

                    $http({
                        method: 'JSONP',
                        url: $sce.trustAsResourceUrl(url),
                        cache: false,
                        jsonpCallbackParam: 'callback'
                    }).then(function (response) {
                        var results = response.data[1];
                        if (results.indexOf(scope.searchText) === -1) {
                            response.data[1].unshift(scope.searchText);
                        }
                        scope.suggestions = results;
                        scope.selectedIndex = -1;

                    }, function (error) {
                        console.log(error.data || 'Request failed');
                        console.log(error.status);
                    });
                };

                scope.checkKeyDown = function (event) {
                    if (event.keyCode === 13) { //enter pressed
                        scope.selectSearchTerm(scope.selectedIndex);
                    } else if (event.keyCode === 40) { //down key, increment selectedIndex
                        event.preventDefault();
                        if (scope.selectedIndex + 1 !== scope.suggestions.length) {
                            scope.selectedIndex++;
                        }
                    } else if (event.keyCode === 38) { //up key, decrement selectedIndex
                        event.preventDefault();
                        if (scope.selectedIndex - 1 !== -1) {
                            scope.selectedIndex--;
                        }
                    }
                    //else scope.search();
                };

                scope.checkKeyup = function (event) {
                    if (event.keyCode === 13 || event.keyCode === 40 || event.keyCode === 38) {
                        return;
                    }
                    scope.search();
                };

                scope.$watch('selectedIndex', function (val) {
                    if (val !== -1) {
                        scope.searchText = scope.suggestions[scope.selectedIndex];
                    }
                });

                scope.$watch('searchText', function (val) {
                    scope.searchText = (!!val) ? val.charAt(0).toUpperCase() + val.substr(1).toLowerCase() : '';
                });

                elem.bind('blur', scope.clearResults);
                elem.bind('keyup', scope.checkKeyup);
            }
        };
    }
]);

angular.module('appModule').directive('capitalizeFirst', function ($parse) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
                if (inputValue === undefined) {
                    inputValue = '';
                }
                var capitalized = inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            };
            modelCtrl.$parsers.push(capitalize);
            capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
        }
    };
});