angular.module("GlobalConfigModule").factory("GlobalConfigService", ["GlobalConstants", "XHR", "GlobalConfigCacheService",
    function (GlobalConstants, XHR, GlobalConfigCacheService) {

        var globalLists = {};

        return {
            loadData: function (url) {
                return GlobalConfigCacheService.xhrLoadConfigObject("globalLists", url, {}, true).then(function (globalLists) {
                    return globalLists;
                });
            },

            getServerUrl: function () {
                return GlobalConfigCacheService.xhrLoadConfigObject(GlobalConstants.system.GLOBAL_CONFIG_KEY, GlobalConstants.system.CONFIG_URL).then(function (globalConfig) {
                    return globalConfig.SERVER_URL;
                });
            },

            getContentType: function () {
                return GlobalConfigCacheService.xhrLoadConfigObject(GlobalConstants.system.GLOBAL_CONFIG_KEY, GlobalConstants.system.CONFIG_URL).then(function (globalConfig) {
                    return globalConfig.contentType;
                });
            }


        };
    }
]);