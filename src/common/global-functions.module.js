angular.module('GlobalFunctionsModule', []);

//**
// DATE FUNCTIONS
//

angular.module('GlobalFunctionsModule').service('GlobalFunctionsDate', [function () {

    this.toISOString = function (date) {
        var now = new Date(date),
            pad = function (num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
        return now.getFullYear() +
            '-' + pad(now.getMonth() + 1) +
            '-' + pad(now.getDate()) +
            'T' + pad(now.getHours()) +
            ':' + pad(now.getMinutes()) +
            ':' + pad(now.getSeconds()) +
            '.' + now.getMilliseconds() +
            'Z';
    };

    /**
     *
     * @param addDays
     * @param simple
     * @returns {*}
     */
    this.getDate = function (addDays, simple) {
        addDays = addDays ? addDays : 0;
        simple = simple ? true : false;

        var date = new Date();
        date.setDate(date.getDate() + addDays);

        if (simple) {
            var dd = ("0" + date.getDate()).slice(-2);
            var mm = ("0" + (date.getMonth() + 1)).slice(-2);
            var yyyy = date.getFullYear();
            return (yyyy + '-' + mm + '-' + dd);
        } else {
            return date;
        }
    };

    /**
     *
     * @param begin
     * @param end
     * @returns {number}
     */
    this.getDiffInHours = function (begin, end, noRound) {
        var DIVIDED_BY_MILISECS = 1000;
        var DIVIDED_BY_SECONDS = 60;
        var DIVIDED_BY_MINUTES = 60;
        var diff = Math.abs((end.getTime() - begin.getTime()) / (DIVIDED_BY_MILISECS * DIVIDED_BY_SECONDS * DIVIDED_BY_MINUTES));
        if (noRound) {
            return diff;
        }
        return Math.round(diff);
    };

    /**
     *
     * @param begin
     * @param end
     * @param limit
     * @returns {boolean}
     */
    this.rangeOverLimit = function (begin, end, limit) {
        return this.getDiffInHours(begin, end) >= limit;
    };

    /**
     *
     * @returns {Date}
     */
    this.getTime = function () {
        var result = new Date();
        result = String(result.getHours()) + '-' + String(result.getMinutes());
        return result;
    };

    /**
     *
     * @returns {number}
     */
    this.getEPOCHTime = function () {
        var date = new Date();
        return date.getTime();
    };

    /**
     *
     * @returns {string}
     */
    this.getISODate = function () {
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.toISOString();
    };

}]);

//**
// OBJECT FUNCTIONS
//
angular.module('GlobalFunctionsModule').service('GlobalFunctionsObject', [
    '$filter', 'GlobalConfigCacheService',
    function ($filter, GlobalConfigCacheService) {

        var vm = this;

        /**
         *
         * @param obj
         * @param orderByField
         * @param subPropery
         * @param reverse
         * @returns {*}
         */
        this.sortObject = function (obj, orderByField, subPropery, reverse) {
            return $filter('orderObjectBy')(obj, orderByField, subPropery, reverse);
        };

        /**
         *
         * @param object
         * @param value
         * @returns {string}
         */
        this.getKeyByValue = function (object, value) {
            for (var prop in object) {
                if (object.hasOwnProperty(prop) && object[prop] === value) {
                    return prop;
                }
            }
        };

        this.objectHasData = function (obj) {
            if (!obj) {
                return false;
            }
            var result = false;
            for (var key in obj) {
                if (obj[key] || obj[key] === 0) {
                    result = true;
                }
            }
            return result;
        };

        /**
         *
         * @param object
         * @param property
         * @returns {boolean}
         */
        this.searchProperty = function (object, property) {
            var found = false;

            function eachRecursive(object, property) {
                for (var key in object) {
                    if (key !== property) {
                        if (typeof object[key] == "object" && object[key] !== null && !found) {
                            eachRecursive(object[key], property);
                        }
                    } else {
                        found = object[key];
                        break;
                    }
                }
            }

            eachRecursive(object, property);
            return found;
        };

        /**
         *
         * @param obj
         * @param prop
         * @param value
         * @param minCount
         * @returns {boolean}
         */
        this.isDuplicatedByValue = function (obj, prop, value, minCount) {
            var count = 0;
            var expCount = minCount ? minCount : 0;
            if (value) {
                angular.forEach(obj, function (item) {
                    if (item.hasOwnProperty(prop)) {
                        if (item[prop] == value) {
                            count++;
                        }
                    }
                });
            }

            return count > expCount;
        };

        /**
         *
         * @param obj
         * @param excludeProperties array
         * @param noDelete boolean
         * @param newContent str
         * @returns {*}
         */
        this.clearObject = function (obj, excludeProperties, noDelete, newContent) {
            var cleanObj = angular.copy(obj);
            angular.forEach(obj, function (value, key) {
                if (noDelete) {
                    cleanObj[key] = angular.copy(newContent);
                } else {
                    for (var property in obj[key]) {
                        if (obj[key].hasOwnProperty(property)) {
                            if (excludeProperties && excludeProperties[property]) {
                                cleanObj[key][property] = excludeProperties[property];
                            }
                            else {
                                delete cleanObj[key][property];
                            }
                        }
                    }
                }
            });
            return cleanObj;
        };

        /**
         *
         * @param obj
         * @param prop
         * @param val
         * @returns {*}
         */
        this.deleteObjectByProperty = function (obj, prop, val) {
            var resultObject = obj;
            angular.forEach(obj, function (item, key) {
                if (item.hasOwnProperty(prop) && item[prop] === val) {
                    resultObject.splice(key, 1);
                }
            });

            return resultObject;
        };

        /**
         *
         * @param listCode
         * @returns {{}}
         */
        this.getValueIdHashMapOfList = function (listCode) {
            var i, currentItem, list, result = {};
            var listDirectories = GlobalConfigCacheService.getConfigObject("globalLists");
            for (i = 0; i < listDirectories.length; i++) {
                currentItem = listDirectories[i];
                if (currentItem.listCode === listCode) {
                    list = currentItem.listStores;
                    i = listDirectories.length;
                }
            }
            if (!list) {
                throw new Error('[getValueIdHashMapOfList] no such listCode found ' + listCode);
            }

            for (i = 0; i < list.length; i++) {
                currentItem = list[i];
                result[currentItem.value] = currentItem.id;
            }
            return result;
        };

        /**
         *
         * @param listCode
         * @returns {{}}
         */
        this.getValuePropertyHashMapOfList = function (listCode) {
            var i, currentItem, list, result = {};
            var listDirectories = GlobalConfigCacheService.getConfigObject("globalLists");
            for (i = 0; i < listDirectories.length; i++) {
                currentItem = listDirectories[i];
                if (currentItem.listCode === listCode) {
                    list = currentItem.listStores;
                    i = listDirectories.length;
                }
            }
            if (!list) {
                throw new Error('[getValueIdHashMapOfList] no such listCode found ' + listCode);
            }

            for (i = 0; i < list.length; i++) {
                currentItem = list[i];
                result[currentItem.id] = currentItem.value;
            }
            return result;
        };

        /**
         *
         * @param object
         * @param value
         * @param find
         * @param request
         * @returns {*}
         */
        this.getObjectElementByValue = function (object, value, find, request) {
            for (var i = 0; i < object.length; i++) {
                if (object[i][find] === value) {
                    return object[i][request];
                }
            }
        };

        /**
         *
         * @param object
         * @param stringPath
         * @returns {*}
         */
        this.getObjectValueByPath = function (object, stringPath) {
            stringPath = stringPath.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            stringPath = stringPath.replace(/^\./, '');           // strip a leading dot
            var a = stringPath.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (object[k] !== undefined) {
                    object = object[k];
                } else {
                    return;
                }
            }
            return object;
        };

        /**
         *
         * @param obj
         * @param value
         * @param path
         */
        this.setObjectValueByPath = function (obj, value, path) {
            path = path.replace(/\[(\w+)\]/g, '.$1');
            path = path.replace(/^\./, '');
            path = path.split('.');
            var currentNode = obj;
            for (var i = 0; i < path.length - 1; i++) {
                if (!currentNode[path[i]]) {
                    currentNode[path[i]] = {};
                }
                currentNode = currentNode[path[i]];
            }
            currentNode[path[path.length - 1]] = value;
        };

        /**
         *
         * @param object
         * @param oldValue
         * @param newValue
         * @returns {*}
         */
        this.changeObjectProperyValue = function (object, oldValue, newValue) {
            var replace = function (obj, oldValue, newValue) {
                angular.forEach(obj, function (prop, key) {
                    if (angular.isObject(prop) && key[0] != '$') {
                        obj[key] = replace(prop, oldValue, newValue);
                    } else {
                        if (prop === oldValue) {
                            obj[key] = newValue;
                        }
                    }
                });
                return obj;
            };

            return replace(object, oldValue, newValue);
        };

        /**
         *
         * @param obj
         * @param array
         * @param id
         * @returns {*}
         */
        this.filterObject = function (obj, array, id) {
            var object = angular.copy(obj);
            angular.forEach(obj, function (item, key) {
                for (var prop in item) {
                    if (array.indexOf(prop) === -1) {
                        if (prop !== id) {
                            delete object[key][prop];
                        }
                    }
                }
            });
            return object;
        };

        /**
         *
         * @param obj
         * @param prop
         * @param value
         * @returns {*}
         */
        this.getSubObjectByProperty = function (obj, prop, value) {
            for (var item in obj) {
                if (obj.hasOwnProperty(item) && typeof obj[item] === 'object' && obj[item].hasOwnProperty(prop) && obj[item][prop] === value) {
                    return obj[item];
                }
            }
        };

        /**
         *
         * @param obj
         * @param prop
         * @param minValue
         * @returns {*}
         */
        this.getMaxPropertyValueInObject = function (obj, prop, minValue) {
            var maxValue = minValue;
            angular.forEach(obj, function (item) {
                if (item.hasOwnProperty(prop) && item[prop] >= maxValue) {
                    maxValue = item[prop];
                }
            });

            return maxValue;
        };

        /**
         *
         * @returns {{VALUE_CREATED: string, VALUE_UPDATED: string, VALUE_DELETED: string, VALUE_UNCHANGED: string, map: GlobalFunctionsObject.map, compareValues: GlobalFunctionsObject.compareValues, isFunction: GlobalFunctionsObject.isFunction, isArray: GlobalFunctionsObject.isArray, isObject: GlobalFunctionsObject.isObject, isValue: GlobalFunctionsObject.isValue}}
         */
        this.deepDiffMapper = function () {
            return {
                VALUE_CREATED: 'created',
                VALUE_UPDATED: 'updated',
                VALUE_DELETED: 'deleted',
                VALUE_UNCHANGED: 'unchanged',
                map: function (obj1, obj2) {
                    if (this.isFunction(obj1) || this.isFunction(obj2)) {
                        throw 'Invalid argument. Function given, object expected.';
                    }
                    if (this.isValue(obj1) || this.isValue(obj2)) {
                        return {type: this.compareValues(obj1, obj2), data: obj1 || obj2};
                    }

                    var diff = {};
                    for (var key in obj1) {
                        if (this.isFunction(obj1[key])) {
                            continue;
                        }

                        var value2 = undefined;
                        if ('undefined' != typeof(obj2[key])) {
                            value2 = obj2[key];
                        }

                        diff[key] = this.map(obj1[key], value2);
                    }

                    for (var key2 in obj2) {
                        if (this.isFunction(obj2[key2]) || ('undefined' != typeof(diff[key2]))) {
                            continue;
                        }

                        diff[key2] = this.map(undefined, obj2[key2]);
                    }

                    return diff;

                },
                compareValues: function (value1, value2) {
                    if (value1 === value2) {
                        return this.VALUE_UNCHANGED;
                    }
                    if ('undefined' == typeof(value1)) {
                        return this.VALUE_CREATED;
                    }
                    if ('undefined' == typeof(value2)) {
                        return this.VALUE_DELETED;
                    }

                    return this.VALUE_UPDATED;
                },
                isFunction: function (obj) {
                    return {}.toString.apply(obj) === '[object Function]';
                },
                isArray: function (obj) {
                    return {}.toString.apply(obj) === '[object Array]';
                },
                isObject: function (obj) {
                    return {}.toString.apply(obj) === '[object Object]';
                },
                isValue: function (obj) {
                    return !this.isObject(obj) && !this.isArray(obj);
                }
            };
        };

        this.guarantyPromise = function (promise) {
            if (promise) {
                var tmp = promise;
                promise = false;
                return tmp;
            } else {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };

        this.removeElementFromArrayByValue = function (array) {
            var arrayValue,
                args = arguments,
                length = args.length,
                index;
            while (length > 1 && array.length) {
                arrayValue = args[--length];
                while ((index = array.indexOf(arrayValue)) !== -1) {
                    array.splice(index, 1);
                }
            }
            return array;
        };

        this.getObjectDifference = function (refObj, newObj, refProp) {
            for (var nKey in newObj) {
                var found = false;
                for (var rKey in refObj) {
                    if (refObj[rKey].hasOwnProperty(refProp) && newObj[nKey].hasOwnProperty(refProp)) {
                        if (refObj[rKey][refProp] === newObj[nKey][refProp]) {
                            found = true;
                        }
                    }
                }

                if (!found) {
                    refObj.unshift(newObj[nKey]);
                }
            }
            return refObj;
        };

        this.makeArrayFromNumber = function (number) {
            var numArr = [];
            for (var i = 0; i < number; i++) {
                numArr.push(i);
            }
            return numArr;
        };

        //makes array from mixed string-array object.
        this.normalizeArray = function (data, delim) {
            var splitted = [];
            angular.forEach(data, function (val, key) {
                val = val.replace(/\r?\n|\r/g, '');
                if (angular.isString(val)) {
                    splitted = val.split(delim);
                    if (splitted.length > 0) {
                        data.splice(key, 1);
                        angular.forEach(splitted, function (val) {
                            if (val) {
                                if (val.indexOf(delim) === -1) {
                                    val = delim + val;
                                }
                                data.push(val);
                            }
                        });
                    }
                }
            });
            return data;
        };

    }
]);


//**
// STRING FUNCTIONS
//
angular.module('GlobalFunctionsModule').factory('GlobalFunctionsString', ['GlobalConstants', function (GlobalConstants) {
    return {
        /**
         *
         * @param referenceObj
         * @param referenceName
         * @param values
         */
        addDotSyntaxNode: function (referenceObj, referenceName, values) {
            if (!referenceObj[referenceName]) {
                referenceObj[referenceName] = values.shift();
            }
            for (var i = 0; i < values.length; i++) {
                referenceObj[referenceName] += '.' + values[i];
            }
        },

        /**
         *
         * @param text
         * @returns {*}
         */
        htmlToPlaintext: function (text) {
            var plainText = text;
            var regex = [/<br[^>]*>/gi, /<p[^>]*>/gi, /<li[^>]*>/gi, /<ul[^>]*>/gi, /<ol[^>]*>/gi, /<div[^>]*>/gi];
            regex.forEach(function (value) {
                plainText = plainText.replace(value, "\n");
            });
            return plainText.replace(/<[^>]+>/gm, '');
        },

        /**
         *
         * @param str
         * @param index
         * @param character
         * @returns {string}
         */
        replaceAt: function (str, index, character) {
            return str.substr(0, index) + character + str.substr(index + character.length);
        },

        html5Entities: function (value) {
            return value.replace(/[\u00A0-\u9999<>\&\'\"]/gim, function (i) {
                return '&#' + i.charCodeAt(0) + ';';
            });
        },

        /**
         *
         * @param str
         * @returns {{camelLower: string, camelUpper: string, underUpper: string, underLower: string, dashUpper: string, dashLower: string}}
         */
        constantFormat: function (str) {
            var under, camel, dash;
            if (str.indexOf('_') !== -1) {
                str = str.toLowerCase();
                under = str;
                camel = str.replace(/(\_[a-z])/g, function ($1) {
                    return $1.toUpperCase().replace('_', '');
                });
            } else {
                under = str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1_$2');
                camel = str;
            }
            dash = under.replace('_', '-');
            return {
                "camelLower": camel.substr(0, 1).toLowerCase() + camel.substr(1),
                "camelUpper": camel.substr(0, 1).toUpperCase() + camel.substr(1),
                "underUpper": under.toUpperCase(),
                "underLower": under.toLowerCase(),
                "dashUpper": dash.toUpperCase(),
                "dashLower": dash.toLowerCase()
            };
        },

        stringToRGB: function (str) {
            function hashCode(str) {
                var hash = 0;
                for (var i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                }
                return hash;
            }

            function intToRGB(i) {
                var c = (i & 0x00FFFFFF)
                    .toString(16)
                    .toUpperCase();

                return "00000".substring(0, 6 - c.length) + c;
            }

            return intToRGB(hashCode(str));
        },

        getFileName: function (url) {
            var filename = url.match(/([^\/]+)(?=\.\w+$)/);
            filename = filename ? filename[0] : filename; // if it has extension or not
            return filename;
        },

        removeDiacritics: function (str) {
            var diacriticsMap = {
                A: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
                AA: /[\uA732]/g,
                AE: /[\u00C6\u01FC\u01E2]/g,
                AO: /[\uA734]/g,
                AU: /[\uA736]/g,
                AV: /[\uA738\uA73A]/g,
                AY: /[\uA73C]/g,
                B: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
                C: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
                D: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
                DZ: /[\u01F1\u01C4]/g,
                Dz: /[\u01F2\u01C5]/g,
                E: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
                F: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,
                G: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
                H: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
                I: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
                J: /[\u004A\u24BF\uFF2A\u0134\u0248]/g,
                K: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
                L: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
                LJ: /[\u01C7]/g,
                Lj: /[\u01C8]/g,
                M: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
                N: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
                NJ: /[\u01CA]/g,
                Nj: /[\u01CB]/g,
                O: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
                OI: /[\u01A2]/g,
                OO: /[\uA74E]/g,
                OU: /[\u0222]/g,
                P: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
                Q: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,
                R: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
                S: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
                T: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
                TZ: /[\uA728]/g,
                U: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
                V: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
                VY: /[\uA760]/g,
                W: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
                X: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,
                Y: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
                Z: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
                a: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
                aa: /[\uA733]/g,
                ae: /[\u00E6\u01FD\u01E3]/g,
                ao: /[\uA735]/g,
                au: /[\uA737]/g,
                av: /[\uA739\uA73B]/g,
                ay: /[\uA73D]/g,
                b: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
                c: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
                d: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
                dz: /[\u01F3\u01C6]/g,
                e: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
                f: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,
                g: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
                h: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
                hv: /[\u0195]/g,
                i: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
                j: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,
                k: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
                l: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
                lj: /[\u01C9]/g,
                m: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
                n: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
                nj: /[\u01CC]/g,
                o: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
                oi: /[\u01A3]/g,
                ou: /[\u0223]/g,
                oo: /[\uA74F]/g,
                p: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
                q: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,
                r: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
                s: /[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
                ss: /[\u00DF]/g,
                t: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
                tz: /[\uA729]/g,
                u: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
                v: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
                vy: /[\uA761]/g,
                w: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
                x: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,
                y: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
                z: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g,
                '': /,|\.|!|<|>|\?|\*|@|#|\$|%|\^|&|\(|\)|\+|-|_|;|:|\\|\/|\||"|'/g
            };
            for (var x in diacriticsMap) {
                str = str.replace(diacriticsMap[x], x);
            }
            // console.log(str.split(' ').join('-').toLowerCase());
            return str.split(' ').join('-').toLowerCase();
        },

        errorParse: function (errorMsg) {
            if (errorMsg.indexOf('E11000') !== GlobalConstants.common.NEGATIVE_ONE_INDEX) {
                return GlobalConstants.errorMessage.E11000;
            }
        }

    };
}]);

//**
// TIMER FUNCTIONS
//
angular.module('GlobalFunctionsModule').service('GlobalFunctionsTimer', [
    '$interval',
    function ($interval) {
        var timers = {};

        /**
         *
         * @param name
         * @param callbackFn
         * @param delay
         * @param repeatCount
         */
        this.addTimer = function (name, callbackFn, delay, repeatCount) {
            if (timers[name]) {
                $interval.cancel(timers[name]);
            }
            if (repeatCount === undefined) {
                repeatCount = 1;
            }
            timers[name] = $interval(callbackFn, delay, repeatCount);
        };

        /**
         *
         * @param name
         */
        this.cancelTimer = function (name) {
            var timer = timers[name];
            if (timer) {
                $interval.cancel(timers[name]);
                delete timers[name];
            }
        };

        /**
         *
         */
        this.cancelAll = function () {
            for (var timer in timers) {
                this.cancelTimer(timer);
            }
        };

        /**
         *
         * @param name
         * @returns {boolean}
         */
        this.checkTimerExists = function (name) {
            return timers[name] ? true : false;
        };
    }
]);

//**
// DIALOG FUNCTIONS
//
angular.module('GlobalFunctionsModule').service('GlobalFunctionsDialog', [
    '$uibModal',
    function ($uibModal) {
        var confirmDialog = function (params, size, args) {
            params = !params ? {} : params;
            var controller = !params.hasOwnProperty('controller') ? 'ModalInstanceCtrl' : params.controller;
            var template = !params.hasOwnProperty('template') ? 'assets/messagedialog/templates/default.tpl.html' : params.template;
            var modalInstance = $uibModal.open({
                backdrop: !params.hasOwnProperty('backdrop') ? 'static' : params.backdrop,
                animation: true,
                templateUrl: template,
                controller: controller,
                size: size,
                resolve: {
                    'dialogParam': function () {
                        return params;
                    },
                    'args': function () {
                        return args;
                    }
                }
            });
            return modalInstance.result;
        };

        /**
         *
         * @param param
         * @param size
         * @param args
         */
        this.showConfirmDialog = function (param, size, args) {
            return confirmDialog(param, size, args);
        };

        /**
         *
         * @param template
         * @param params
         * @param size
         * @param ctrl
         * @param args
         * @returns {*}
         */
        var modalDialog = function (template, params, size, ctrl, args) {
            var modalInstance = $uibModal.open({
                backdrop: !params.hasOwnProperty('backdrop') ? 'static' : params.backdrop,
                animation: true,
                templateUrl: template,
                controller: ctrl,
                size: angular.isNumber(size) ? size : false,
                windowClass: !params.windowClass && !angular.isNumber(size) ? 'modal-dialog-fullscreen' : params.windowClass,
                resolve: {
                    'dialogParam': function () {
                        return params;
                    },
                    'args': function () {
                        return args;
                    }
                }
            });
            return modalInstance.result;
        };

        /**
         *
         * @param template
         * @param params
         * @param size
         * @param ctrl
         * @param args
         * @returns {*}
         */
        this.showModalDialog = function (template, params, size, ctrl, args) {
            if (!ctrl) {
                ctrl = "ModalInstanceCtrl";
            }
            return modalDialog(template, params, size, ctrl, args);
        };

        this.showImageModal = function (imageUrl, imageDescription, imageHeaderText) {
            $uibModal.open({
                windowClass: "modal-dialog-image",
                templateUrl: "assets/messagedialog/templates/image.tpl.html",
                resolve: {
                    imageSrc: function () {
                        return imageUrl;
                    },
                    imageDescription: function () {
                        return imageDescription;
                    },
                    imageHeaderText: function () {
                        return imageHeaderText;
                    }
                },
                controller: [
                    "$scope", "imageSrc", "imageDescription",
                    function ($scope, imageSrc, imageDescription, imageHeaderText) {
                        $scope.imageHeaderText = imageHeaderText;
                        $scope.imageSrc = imageSrc;
                        $scope.imageDescription = imageDescription;
                    }
                ]
            });
        };

    }]);

angular.module('GlobalFunctionsModule').factory('GlobalFunctionsTemplateLoader', [
    '$q', '$http', '$templateCache', 'GlobalConstants', 'XHR',
    function ($q, $http, $templateCache, GlobalConstants, XHR) {
        return {
            /**
             *
             * @returns {*}
             */
            loadDefaultTemplates: function () {
                var promises = [];
                //GRID templates
                if (!$templateCache.get('selectorMode')) {
                    promises.push({
                        name: 'selectorMode',
                        data: XHR.httpGET('assets/ui-grid/templates/ui-grid-selector.advanced.tpl.html', GlobalConstants.entity_type)
                    });
                }

                if (!$templateCache.get('generalMode')) {
                    promises.push({
                        name: 'generalMode',
                        data: XHR.httpGET('assets/ui-grid/templates/ui-grid-general.advanced.tpl.html', GlobalConstants.entity_type)
                    });
                }

                return ($q.all(promises).then(function (dataCollection) {
                    angular.forEach(dataCollection, function (value) {
                        value.data.then(function (template) {
                            $templateCache.put(value['name'], template);
                        });
                    });
                }));
            }
        };
    }]);

angular.module('GlobalFunctionsModule').factory('GlobalFunctionsJQ', [
    '$document', 'GlobalConstants', '$timeout', 'AuthService', '$translate',
    function ($document, GlobalConstants, $timeout, AuthService, $translate) {
        return {
            /**
             *
             * @param id
             */
            focusFirstInputInMyPanel: function (id) {
                var inputs = $("div[class*='ui-select-container'][id*='" + id + "'] , .panel-body :input[id*='" + id + "']");
                if (inputs.length) {
                    inputs.first().attr("tabindex", 0).focus();
                }
            },

            /**
             *
             */
            addTranslateBreaker: function () {
                var T_KEY = 84;
                var NON_EXISTENT_LANGUAGE = 'NON_NON';
                var broken = false;
                $(window).bind('keydown', function (event) {
                    if (event.keyCode === T_KEY && event.ctrlKey && event.altKey) {
                        if (!broken) {
                            $translate.use(NON_EXISTENT_LANGUAGE);
                            $timeout(function () {
                                $translate.refresh();
                            }, 500);
                            broken = true;
                        } else {
                            var language = AuthService.get(GlobalConstants.settings.LANGUAGE).settingValue1;
                            $translate.use(language);
                            $timeout(function () {
                                $translate.refresh();
                            }, 500);
                            broken = false;
                        }
                    }
                });
            },

            /**
             *
             * @param scope
             */
            setScrollToFirstInputError: function (scope) {
                scope.$on(GlobalConstants.event.broadcast.UPDATE_FORM_ERRORS, function () {
                    $timeout(function () {
                        var label = $('.error-label:visible').first();
                        if (label.length) {
                            $document.duScrollTopAnimated(label.offset().top - 80);
                        }
                    });
                });
                $document.duScrollTopAnimated(0);
            },

            /**
             *
             */
            addHotkeys: function () {
                $(window).bind('keydown', function (event) {
                    var commandName = '';
                    var fnToRun;
                    var keycodes = {
                        '13': 'ENTER',
                        '27': 'ESC',
                        '65': 'A'
                    };

                    function clickFirst(buttonIds) {
                        var collection, currentId, firstElement;
                        for (var i = 0; i < buttonIds.length; i++) {
                            currentId = buttonIds[i];
                            collection = $('#' + currentId + ':visible');
                            if (collection.length) {
                                i = buttonIds.length;
                                firstElement = collection.first();
                                firstElement.click();
                            }
                        }
                    }


                    var callbacks = {
                        'CTRL+ENTER': function () {
                            var buttonIds = ['saveToggleBtn', 'submit'];
                            clickFirst(buttonIds);
                        },
                        'ESC': function () {
                            var buttonIds = ['closeToggleBtn', 'cancel'];
                            clickFirst(buttonIds);
                        },
                        'CTRL+SHIFT+A': function () {
                            var buttonIds = ['selectorAddItemBtn', 'admin-list-add-button', 'btn_add'];
                            clickFirst(buttonIds);
                        },
                        'CTRL+SHIFT+ENTER': function () {
                            var buttonIds = ['submitAndNext'];
                            clickFirst(buttonIds);
                        }
                    };

                    if (event.ctrlKey || event.metaKey) {
                        commandName += 'CTRL+';
                    }

                    if (event.shiftKey) {
                        commandName += 'SHIFT+';
                    }

                    commandName += keycodes[event.keyCode];
                    fnToRun = callbacks[commandName];
                    if (!fnToRun) {
                        return;
                    }
                    fnToRun();

                });
            },

            /**
             *
             */
            footerHandler: function () {
                var didScroll;
                var lastScrollTop = 0;
                var delta = 5;

                $(window).scroll(function () {
                    didScroll = true;
                });

                setInterval(function () {
                    if (didScroll) {
                        hasScrolled();
                        didScroll = false;
                    }
                }, 250);

                function hasScrolled() {
                    var st = $(this).scrollTop();

                    if (Math.abs(lastScrollTop - st) <= delta) {
                        return;
                    }

                    if (st + $(window).height() >= $(document).height()) {
                        $('footer').removeClass('nav-down').addClass('nav-up');
                    } else {
                        if ($(window).height() < $(document).height()) {
                            $('footer').removeClass('nav-up').addClass('nav-down');
                        }
                    }

                    lastScrollTop = st;
                }
            },

            /**
             *
             * @param element
             */
            autoFocus: function (element) {
                $timeout(function () {
                    $(element).click();
                });

            }
        };
    }]);

angular.module('GlobalFunctionsModule').factory('GlobalFunctionsGrid', [function () {
    return {

        /**
         *
         * @param scope
         * @param collectionData
         * @param newData
         * @param customProperty
         * @param customKey
         * @param extraKey
         * @param extraValue
         * @returns {boolean}
         */
        checkDuplicates: function (scope, collectionData, newData, customProperty, customKey, extraKey, extraValue) {
            var duplicated = false;
            var key = customKey ? customKey : 'id';

            //superior first line manager hackfeature
            if (customProperty) {
                if (extraKey && newData.hasOwnProperty(extraKey) && scope.advancedGridName === "superiors_grid_advanced") {
                    angular.forEach(collectionData, function (collectionItem) {
                        if (newData[extraKey].value === extraValue && collectionItem[extraKey].value === extraValue ||
                            collectionItem[customProperty][key] === newData[customProperty][key]
                        ) {
                            duplicated = true;
                        }
                    });
                } else {
                    angular.forEach(collectionData, function (collectionItem) {
                        if (collectionItem[customProperty][key] === newData[customProperty][key]) {
                            duplicated = true;
                        }
                    });
                }
            } else {
                if (extraKey && newData[customProperty].hasOwnProperty(extraKey)) {
                    angular.forEach(collectionData, function (collectionItem) {
                        if (collectionItem[key] === newData[key] &&
                            collectionItem[extraKey] === newData[extraKey]) {
                            duplicated = true;
                        }
                    });
                } else {
                    angular.forEach(collectionData, function (collectionItem) {
                        if (collectionItem[key] === newData[key]) {
                            duplicated = true;
                        }
                    });
                }
            }
            return duplicated;
        }
    };
}]);