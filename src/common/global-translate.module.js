angular.module('GlobalTranslateModule', ['pascalprecht.translate'])
    .config(['$translateProvider', function ($translateProvider) {
        try { //hack avoid unexpected get in numerous unit test
            if (isTesting) {
                isTesting = !!isTesting;
                angular.module("appModule")
                    .value('duScrollDuration', 0) //hack remove page scroll animation for e2e tests
                    .value('duScrollOffset', 0);
            }
        } catch (err) {
            $translateProvider.useStaticFilesLoader({
                prefix: 'assets/i18n/',
                suffix: '.json'
            });
        }

        $translateProvider.preferredLanguage('hu_HU'); //todo global configból ha nincs profile
        $translateProvider.useSanitizeValueStrategy('sanitize');
        moment.locale("hu");

        $translateProvider.useMissingTranslationHandler('MissingTranslationHandlerFactory');
    }])

    .value('langAliasToIdMap', {
        'hu_HU': 0,
        'en_US': 1,
        'de_DE': 2
    })

    .service('TranslateLangIdCache', ['AuthService', 'GlobalConstants', 'GlobalConfigCacheService', 'XHR', 'langAliasToIdMap',
        function (AuthService, GlobalConstants, GlobalConfigCacheService, XHR, langAliasToIdMap) {
            var vm = this;
            this.refresh = function () {
                var url = GlobalConfigCacheService.getConfigObject(GlobalConstants.system.GLOBAL_CONFIG_KEY).SERVER_URL + GlobalConstants.states.admin_system_settings.API_URL;
                vm.langId = AuthService.get(GlobalConstants.settings.LANGUAGE);
                vm.langId = vm.langId && vm.langId.settingValue2 ? vm.langId.settingValue2 : 0;
                return XHR.get(url).then(function (data) {
                    vm.systemLangId = langAliasToIdMap[data.data.defaultLanguage];
                });
            };

            this.get = function () {
                return vm.langId;
            };

            this.getSystem = function () {
                return vm.systemLangId;
            };
        }])

    .service('TranslateService', ['AuthService', 'GlobalConstants', 'GlobalConfigCacheService', 'TranslateLangIdCache', function (AuthService, GlobalConstants, GlobalConfigCacheService, TranslateLangIdCache) {
        var FIRST_NAME = ['firstname', 'name1'], LAST_NAME = ['lastname', 'name2'], THIRD_NAME = ['thirdname', 'name3'];
        var nameOrders = [[LAST_NAME, FIRST_NAME, THIRD_NAME], [FIRST_NAME, THIRD_NAME, LAST_NAME], [FIRST_NAME, THIRD_NAME, LAST_NAME]];


        this.getListItemTranslation = function (values) {
            var langId = this.getLanguageId();
            var systemLangId = this.getSystemLangId();
            if (values[langId]) {
                return values[langId];
            } else if (values[systemLangId]) {
                return values[systemLangId];
            } else {
                var result = '';
                for (var i = 0; i < values.length; i++) {
                    result = values[i];
                    if (result) {
                        return result;
                    }
                }
                return result;
            }
        };

        this.getSystemLangId = function () {
            var result = TranslateLangIdCache.getSystem();
            result = result ? result : 0;
            return result;
        };

        this.getLanguageId = function () {
            var result = TranslateLangIdCache.get();
            result = result ? result : 0;
            return result;
        };

        this.sortNameKeys = function (arr) {
            var langId = TranslateLangIdCache.get();
            langId = langId ? langId : 0;
            var nameOrder = nameOrders[langId];
            var sorted = [], indexes = [];
            for (var i = 0; i < nameOrder.length; i++) {
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j].toLowerCase().indexOf(nameOrder[i][0]) !== -1 || arr[j].toLowerCase().indexOf(nameOrder[i][1]) !== -1) {
                        sorted.push(arr[j]);
                        indexes.push(j);
                    }
                }
            }
            indexes.sort(function (a, b) {
                return a - b;
            });

            for (i = 0; i < indexes.length; i++) {
                arr[indexes[i]] = sorted[i];
            }
            return arr;
        };

        this.sortNamesInMappedColumns = function (mappedColumns) {
            var langId = TranslateLangIdCache.get();
            langId = langId ? langId : 0;
            var nameOrder = nameOrders[langId];
            var groupEnd = 0;
            var flattenedNames = [];
            nameOrder.forEach(function (item) {
                item.forEach(function (name) {
                    flattenedNames.push(name);
                });
            });

            var length;
            do {
                var result = makeGroup();
                length = result.data.length;
                if (length) {
                    sortNameGroup(result.data);
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        mappedColumns[result.startIndex + i] = item;

                    }
                }
            } while (length);

            function makeGroup() {
                var group = {data: [], startIndex: 0};
                var foundStart;
                for (var i = groupEnd; i < mappedColumns.length; i++) {
                    if (isNameColumn(mappedColumns[i])) {
                        if (!foundStart) {
                            group.startIndex = i;
                            foundStart = true;
                        }
                        if (i === mappedColumns.length - 1) {
                            groupEnd = mappedColumns.length;
                        }
                        group.data.push(mappedColumns[i]);
                    } else if (foundStart) {
                        groupEnd = i;
                        return group;
                    }
                }
                return group;
            }


            function isNameColumn(col) {
                var name = col.field;
                var isName = false;
                flattenedNames.forEach(function (item) {
                    if (name.toLowerCase().indexOf(item.toLowerCase()) !== -1) {
                        isName = true;
                    }
                });
                return isName;
            }


            function sortNameGroup(group) {
                var sorted = [], indexes = [];
                var currentItem, currentSearchTerm;
                for (var i = 0; i < nameOrder.length; i++) {
                    currentSearchTerm = nameOrder[i];
                    for (var j = 0; j < group.length; j++) {
                        currentItem = group[j];
                        if (currentItem.field.toLowerCase().indexOf(currentSearchTerm[0]) !== -1 || currentItem.field.toLowerCase().indexOf(currentSearchTerm[1]) !== -1) {
                            sorted.push(currentItem);
                            indexes.push(j);
                        }
                    }
                    indexes.sort(function (a, b) {
                        return a - b;
                    });
                }

                for (i = 0; i < sorted.length; i++) {
                    group[indexes[i]] = sorted[i];
                }
            }

            // sortNameGroup(mappedColumns);
        };

        this.sortNamesInFormStructure = function (structure) {
            var langId = TranslateLangIdCache.get();
            var nameOrder = nameOrders[langId];

            function processNode(node) {
                var nameBlocks = {};
                var nameBlockKey;
                var currentBlock;
                var currentValue, currentIndex;
                for (var i = 0; i < node.length; i++) {
                    if (node[i].subStructure) {
                        processNode(node[i].subStructure);
                    } else {
                        for (var j = 0; j < nameOrder.length; j++) {
                            if (compareWithSearchTerm(node[i], nameOrder[j])) {
                                nameBlockKey = node[i].id.toLowerCase().replace(nameOrder[j][0], '').replace(nameOrder[j][1], '');
                                if (!nameBlocks[nameBlockKey]) {
                                    nameBlocks[nameBlockKey] = {
                                        values: [],
                                        indexes: []
                                    };
                                }
                                currentBlock = nameBlocks[nameBlockKey];
                                currentBlock.values[j] = node[i];
                                currentBlock.indexes[j] = i;
                            }
                        }
                    }
                }
                for (var key in nameBlocks) {
                    currentBlock = nameBlocks[key];
                    currentBlock.values.sort(function () {
                        return 0;
                    });
                    currentBlock.indexes.sort(function (a, b) {
                        return a - b;
                    });
                    for (i = 0; i < currentBlock.values.length; i++) {
                        currentValue = currentBlock.values[i];
                        currentIndex = currentBlock.indexes[i];
                        if (currentValue) {
                            node[currentIndex] = currentValue;
                        }
                    }
                }
            }

            processNode(structure);

            function compareWithSearchTerm(value, termArray) {
                if (!value || !value.id) {
                    return false;
                }
                return value.id.toLowerCase().indexOf(termArray[0]) !== -1 || value.id.toLowerCase().indexOf(termArray[1]) !== -1;
            }
        };

    }])

    .filter('nameOrder', ['GlobalConstants', 'AuthService', 'TranslateLangIdCache', function (GlobalConstants, AuthService, TranslateLangIdCache) {
        var FIRST_NAME = ['firstname', 'name1'], LAST_NAME = ['lastname', 'name2'], THIRD_NAME = ['thirdname', 'name3'];
        var nameOrders = [[LAST_NAME, FIRST_NAME, THIRD_NAME], [FIRST_NAME, THIRD_NAME, LAST_NAME], [FIRST_NAME, THIRD_NAME, LAST_NAME]];
        return function (input, cfg) {
            var langId = TranslateLangIdCache.get();
            var nameOrder = nameOrders[langId];
            var items = [];
            if (!input || !cfg) {
                return input;
            }
            for (var i = 0; i < nameOrder.length; i++) {
                for (var j = 0; j < cfg.length; j++) {
                    if (cfg[j].toLowerCase().indexOf(nameOrder[i][0]) !== -1 || cfg[j].toLowerCase().indexOf(nameOrder[i][1]) !== -1) {
                        items[i] = input[cfg[j]];
                    }
                }
            }
            items.sort(function () {
                return 0;
            });
            while (items.length && items[items.length - 1] === undefined) {
                items.pop();
            }
            return items.join(' ');
        };
    }])

    .filter('listValueTranslate', ['TranslateService', function (TranslateService) {
        return function (input) {
            if (!input) {
                return input;
            }

            if (input.hasOwnProperty('values')) {
                input = input.values;
            }

            if (input.constructor !== Array) {
                return input;
            }

            var result;
            result = TranslateService.getListItemTranslation(input);
            if (!result) {
                result = input[0];
            }
            if (result === '-') {
                result = '';
            }
            return result;
        };
    }])


    .factory('MissingTranslationHandlerFactory', ['$rootScope', function ($rootScope) {
        return function (translationID) { //, uses
            if (translationID.substring(translationID.length - 1) === '.') {
                return;
            }
            if (!$rootScope.missingTranslations) {
                $rootScope.missingTranslations = [];
            }
            if ($rootScope.missingTranslations.indexOf(translationID) === -1) {
                $rootScope.missingTranslations.push(translationID);
            }
        };
    }]);
