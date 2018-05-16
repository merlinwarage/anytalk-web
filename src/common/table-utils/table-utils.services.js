/**
 * USAGE in Controller:
 *
 * var params = {
 *          query: '',
 *          sortingOrder: 'assignmentDate',
 *          selectedColumn: '',
 *          reverse: true,
 *          currentPage: 0,
 *          itemsPerPage: 10,
 *          filteredItems: [],
 *          groupedItems: [],
 *          pagedItems: [],
 *          pageItems: []
 *     };
 *
 *
 * TableUtilsService.initFunctions(scope, "tableName", params);
 * TableUtilsService.loadFunctions(scope);
 *
 * after load the data into the pageItems array:
 *
 * scope.tableUtils[scope.tableName].pageItems = dataItems;
 * scope.tableUtils.functions.search(scope.tableName);
 *
 */

angular.module('uiTableUtils').service('TableUtilsService', ['$filter', function ($filter) {

    this.createColumnList = function (colDefs) {
        var columnList = [];
        angular.forEach(colDefs.columns, function (item, key) {
            columnList.push(key);
        });

        return columnList;
    };

    this.createSearchFieldNames = function (colDefs) {
        var columnList = [], colName;
        angular.forEach(colDefs.columns, function (item, key) {
            colName = item.valueField ? key + '.' + item.valueField : key;
            columnList.push(colName);
        });

        return columnList;
    };

    this.initFunctions = function (scope, tableName, params) {
        var config = {};
        var defaultConfig = {
            //default config
            sortingOrder: 'id',
            reverse: true,
            itemsPerPage: 50,
            currentPage: 0,
            //init params
            query: '',
            selectedColumn: '',
            filteredItems: [],
            groupedItems: [],
            pagedItems: [],
            pageItems: []
        };

        if (!params) {
            config = defaultConfig;
        } else {
            config = angular.merge(defaultConfig, params);
        }

        if (!scope) {
            var tableUtils = {};
            return tableUtils[tableName] = angular.copy(config);
        } else {
            scope[tableName] = tableName;
            if (!scope.tableUtils) {
                scope.tableUtils = {};
            }
            scope.tableUtils[tableName] = angular.copy(config);
        }
    };

    this.loadFunctions = function (scope) {
        scope.tableUtils.functions = {
            searchMatch: function (haystack, needle) {
                if (!needle) {
                    return true;
                }
                return haystack ? haystack.toString().toLowerCase().indexOf(needle.toLowerCase()) !== -1 : false;
            },

            reloadData: function (tableName, tableData, columnList) {
                scope.tableUtils[tableName].pageItems = tableData;
                this.search(tableName, columnList);
            },

            search: function (tableName, searchIn) {
                scope.tableUtils[tableName].filteredItems = {};
                scope.tableUtils[tableName].filteredItems = $filter('filter')(scope.tableUtils[tableName].pageItems, function (item) {
                    for (var attr in item) {
                        if (!searchIn) {
                            if (!angular.isObject(item[attr]) && item[attr] && !!item[attr].toString().length) {
                                if (scope.tableUtils.functions.searchMatch(item[attr], scope.tableUtils[tableName].query)) {
                                    return true;
                                }
                            }
                        } else {
                            if (angular.isObject(item[attr])) {
                                var subProp;
                                for (var index in searchIn) {
                                    if (searchIn[index].indexOf('.') !== -1) {
                                        subProp = searchIn[index].split('.');
                                        if (scope.tableUtils.functions.searchMatch(item[subProp[0]][subProp[1]], scope.tableUtils[tableName].query)) {
                                            return true;
                                        }
                                    }
                                }
                            }

                            else {
                                if (!angular.isObject(item[attr]) && item[attr] && !!item[attr].toString().length && searchIn.indexOf(attr) !== -1) {
                                    if (scope.tableUtils.functions.searchMatch(item[attr], scope.tableUtils[tableName].query)) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                });

                // take care of the sorting order
                if (scope.tableUtils[tableName].sortingOrder !== '') {
                    scope.tableUtils[tableName].filteredItems = $filter('orderBy')(scope.tableUtils[tableName].filteredItems, scope.tableUtils[tableName].sortingOrder, scope.tableUtils[tableName].reverse);
                }
                scope.tableUtils[tableName].currentPage = 0;
                // now group by pages
                scope.tableUtils.functions.groupToPages(tableName);
            },

            // calculate page in place
            groupToPages: function (tableName) {
                scope.tableUtils[tableName].pagedItems = [];
                if (scope.tableUtils[tableName].filteredItems) {
                    for (var i = 0; i < scope.tableUtils[tableName].filteredItems.length; i++) {
                        if (i % scope.tableUtils[tableName].itemsPerPage === 0) {
                            scope.tableUtils[tableName].pagedItems[Math.floor(i / scope.tableUtils[tableName].itemsPerPage)] = [scope.tableUtils[tableName].filteredItems[i]];
                        } else {
                            scope.tableUtils[tableName].pagedItems[Math.floor(i / scope.tableUtils[tableName].itemsPerPage)].push(scope.tableUtils[tableName].filteredItems[i]);
                        }
                    }
                }
            },

            range: function (start, end) {
                var ret = [];
                if (!end) {
                    end = start;
                    start = 0;
                }
                for (var i = start; i < end; i++) {
                    ret.push(i);
                }
                return ret;
            },

            prevPage: function (tableName) {
                if (scope.tableUtils[tableName].currentPage > 0) {
                    scope.tableUtils[tableName].currentPage--;
                }
            },

            nextPage: function (tableName) {
                if (scope.tableUtils[tableName].currentPage < scope.tableUtils[tableName].pagedItems.length - 1) {
                    scope.tableUtils[tableName].currentPage++;
                }
            },

            setPage: function (tableName, n) {
                scope.tableUtils[tableName].currentPage = n;
            },

            // change sorting order
            sortBy: function (tableName, newSortingOrder) {
                if (scope.tableUtils[tableName].sortingOrder == newSortingOrder) {
                    scope.tableUtils[tableName].reverse = !scope.tableUtils[tableName].reverse;
                }
                scope.tableUtils[tableName].sortingOrder = newSortingOrder;
            }
        };
    };

    this.setNameOrder = function (mappedColumns) {
        var tmpArray = [];
        for (var key in mappedColumns) {
            tmpArray.push({field: key, obj: mappedColumns[key]});
        }
        // TranslateService.sortNamesInMappedColumns(tmpArray);
        mappedColumns = {};
        for (var i = 0; i < tmpArray.length; i++) {
            var obj = tmpArray[i];
            mappedColumns[obj.field] = obj.obj;
        }
        return mappedColumns;
    };
}
]);
