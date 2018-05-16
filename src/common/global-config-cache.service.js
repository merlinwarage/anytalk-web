angular.module('GlobalConfigModule').factory('GlobalConfigCacheService', [
    'GlobalConstants', 'XHR', '$q',
    function (GlobalConstants, XHR, $q) {

        var configCache = [];

        var newConfigObject = function (key) {
            return configCache[key] ? false : true;
        };

        return {
            putConfigObject: function (key, configObject, forceRefresh) {
                if (newConfigObject(key) || forceRefresh) {
                    configCache[key] = configObject;
                }
            },
            getConfigObject: function (key) {
                return configCache[key];
            },
            deleteConfigObject: function (key) {
                delete configCache[key];
            },
            updateConfigObject: function (key, configObject) {
                configCache[key] = configObject;
                return configCache[key];
            },
            /**
             * xhr loads, then puts cfg object, then returns it
             * @param key
             * @param url
             * @param params
             * @param forceReload
             */
            xhrLoadConfigObject: function (key, url, params, forceReload) {
                var vm = this;
                if (newConfigObject(key) || forceReload) {
                    return XHR.httpGET(url, GlobalConstants.entity_type.CONFIG_OBJECT, params).then(
                        function (data) {
                            vm.putConfigObject(key, data, forceReload);
                            return vm.getConfigObject(key);
                        }
                    );
                }
                var deferred = $q.defer();
                deferred.resolve(vm.getConfigObject(key));
                return deferred.promise;
            }
        };
    }
]);
