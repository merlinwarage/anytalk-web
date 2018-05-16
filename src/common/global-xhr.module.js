angular.module('GlobalXHRModule', ['ngResource', 'GlobalLogModule', 'GlobalConstantsModule']);

angular.module('GlobalXHRModule').factory('XHR', [
    '$http', '$q', '$resource', 'LogService', 'GlobalConstants', 'HeaderMessageManager', 'localStorageService', '$translate',
    function ($http, $q, $resource, LogService, GlobalConstants, HeaderMessageManager, localStorageService, $translate) {

        var errorFunction = function (url, data, response, operation) {

            data = data ? data : {errorMessage: GlobalConstants.common.NOT_AVAILABLE};
            response = response.data ? response : {data: {}};
            response.statusText = response.statusText ? response.statusText : GlobalConstants.common.NOT_AVAILABLE;
            response.status = response.status ? response.status : GlobalConstants.common.NOT_AVAILABLE;
            response.data = (response.data.errorMessage) ? response.data.errorMessage : {errorMessage: GlobalConstants.common.NOT_AVAILABLE};

            LogService.error(angular.uppercase(operation) + ": " + url +
                " | RESPONSE: " + response.data.errorMessage +
                " | STATUS: " + response.statusText +
                " | CODE: " + response.status);

            var msg = angular.copy(data);
            msg.errorMessage = GlobalConstants.error[response.status];
            HeaderMessageManager.broadcastMessage(GlobalConstants.dialog_type.ERROR,
                "", operation, msg, response);
        };

        var xhrInit = function () {
            var tokenObj = localStorageService.get(GlobalConstants.system.AUTH_TOKEN_KEY);
            var language = localStorageService.get(GlobalConstants.settings.LANGUAGE);
            if (tokenObj) {
                $http.defaults.headers.common['X-Auth-Token'] = tokenObj.token;
            }
            $http.defaults.headers.common['X-Language'] = language;
        };

        return {
            get: function (url, params, noMessage) {
                xhrInit();
                return $resource(url).get(params,
                    function onSuccess(response) {
                        LogService.info('[ok] get: ' + url + " | response: " + response._opts);
                    }, function onError(response) {
                        if (!noMessage) {
                            errorFunction(url, response.data, response, GlobalConstants.operation.LOAD);
                        }
                    }
                ).$promise;
            },

            query: function (url, params, noMessage) {
                xhrInit();
                return $resource(url, params, {'query': {method: 'GET', isArray: true}})
                    .query(function onSuccess(response) {
                            LogService.info('[ok] query: ' + url + " | response: " + response);
                        }, function onError(response) {
                            if (!noMessage) {
                                errorFunction(url, response.data, response, GlobalConstants.operation.LOAD);
                            }
                        }
                    ).$promise;
            },

            save: function (url, params, data, noMessage, noErrorMessage) {
                xhrInit();
                return $resource(url, params).save(data,
                    function onSuccess(response) {
                        LogService.info('[ok] save: ' + url + " | response: " + response);
                        if (!noMessage) {
                            HeaderMessageManager.broadcastMessage(GlobalConstants.dialog_type.SUCCESS, "", GlobalConstants.operation.SAVE, data);
                        }
                    }, function onError(response) {
                        if (!noErrorMessage) {
                            errorFunction(url, data, response, GlobalConstants.operation.SAVE);
                        }
                    }
                ).$promise;
            },

            update: function (url, params, data, noMessage) {
                xhrInit();
                return $resource(url, params, {'update': {method: 'PUT'}})
                    .update(data, function onSuccess(response) {
                            LogService.info('[ok] update: ' + url + " | response: " + response);
                            if (!noMessage) {
                                HeaderMessageManager.broadcastMessage(GlobalConstants.dialog_type.SUCCESS, "", GlobalConstants.operation.UPDATE, data);
                            }
                        }, function onError(response) {
                            errorFunction(url, data, response, GlobalConstants.operation.UPDATE);
                        }
                    ).$promise;
            },

            delete: function (url, params, data) {
                // remove is used for IE compatibility
                xhrInit();
                return $resource(url).remove(params,
                    function onSuccess(response) {
                        LogService.info('[ok] delete: ' + url + " | response: " + response);
                        HeaderMessageManager.broadcastMessage(GlobalConstants.dialog_type.SUCCESS, "", GlobalConstants.operation.DELETE, data);
                    }, function onError(response) {
                        errorFunction(url, data, response, GlobalConstants.operation.DELETE);
                    }
                ).$promise;
            },

            httpGET: function (url, params) {
                xhrInit();
                var deferred = $q.defer();
                if (!params) {
                    params = {};
                }
                $http({
                    url: url,
                    method: "GET",
                    params: params
                }).then(
                    function onSuccess(response) {
                        deferred.resolve(response.data);
                        LogService.info('[ok] httpGET: ' + url + " | response: " + response);
                        return response;
                    },
                    function onError(response) {
                        deferred.reject(response);
                        if (!response.status) {
                            response.status = GlobalConstants.error.UNKNOWN;
                        }
                        errorFunction(url, {}, response, GlobalConstants.operation.LOAD);
                        return response;
                    }
                );
                return deferred.promise;
            }
        };
    }]);
