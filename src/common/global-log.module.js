angular.module('GlobalLogModule', [
    'GlobalConfigModule', 'GlobalFunctionsModule', 'LocalStorageModule', 'GlobalConstantsModule', 'GlobalXHRModule',
    'ClientInfoModule'
]);

angular.module('GlobalLogModule').config(['localStorageServiceProvider', 'GlobalConfig',
    function (localStorageServiceProvider, GlobalConfig) {
        localStorageServiceProvider
            .setPrefix("appModule")
            .setStorageCookie(GlobalConfig.log_storage.lifetime, '/')
            .setNotify(true, true);
    }]);

angular.module('GlobalLogModule').run(['$log', 'GlobalFunctionsDate', function ($log, GlobalFunctionsDate) {
    $log.getInstance = function () {
        return {
            log: enhanceLogging($log.log, 'TRACE'),
            info: enhanceLogging($log.info, 'INFO'),
            warn: enhanceLogging($log.warn, 'WARN'),
            debug: enhanceLogging($log.debug, 'DEBUG'),
            error: enhanceLogging($log.error, 'ERROR')
        };
    };

    function enhanceLogging(loggingFunc, context) {
        return function () {
            var modifiedArguments = [].slice.call(arguments);
            modifiedArguments[0] = [GlobalFunctionsDate.getDate(0, true) + '::[' + context + ']> '] + modifiedArguments[0];
            loggingFunc.apply(null, modifiedArguments);
        };
    }
}]);

angular.module('GlobalLogModule').factory('LogService', ['$log', 'GlobalFunctionsDate', 'GlobalConfig', 'localStorageService', 'GlobalConstants',
    function ($log, GlobalFunctionsDate, GlobalConfig, localStorageService, GlobalConstants) {
        var logger = $log.getInstance();
        var log_console = GlobalConfig.log_console.enabled;
        var log_storage = GlobalConfig.log_storage.enabled;
        var log_level = GlobalConfig.log_console.log_level;

        return {
            'trace': function (msg) {
                if (log_console && log_level > 4) { //loglevel 5
                    logger.log(msg);
                }
                if (log_storage && GlobalConfig.log_storage.trace) {
                    localStorageService.set(GlobalConstants.system.EVENT_LOG_KEY, this._addmessage('TRACE', msg));
                }
                return log_level;
            },

            'info': function (msg) {
                if (log_console && log_level > 3) { //loglevel 4
                    logger.info(msg);
                }
                if (log_storage && GlobalConfig.log_storage.info) {
                    localStorageService.set(GlobalConstants.system.EVENT_LOG_KEY, this._addmessage('INFO', msg));
                }
                return log_level;
            },

            'debug': function (msg) {
                if (log_console && log_level > 2) { //loglevel 3
                    logger.debug(msg);
                }
                if (log_storage && GlobalConfig.log_storage.debug) {
                    localStorageService.set(GlobalConstants.system.EVENT_LOG_KEY, this._addmessage('DEBUG', msg));
                }
                return log_level;
            },

            'warn': function (msg) {
                if (log_console && log_level > 1) { //loglevel 2
                    logger.warn(msg);
                }
                if (log_storage && GlobalConfig.log_storage.warn) {
                    localStorageService.set(GlobalConstants.system.EVENT_LOG_KEY, this._addmessage('WARN', msg));
                }
                return log_level;
            },

            'error': function (msg) {

                if (log_console && log_level > 0) { //loglevel 1
                    logger.error(msg);
                }
                if (log_storage && GlobalConfig.log_storage.error) {
                    localStorageService.set(GlobalConstants.system.EVENT_LOG_KEY, this._addmessage('ERROR', msg));
                }
                return log_level;
            },

            'store': function (key, msg) {
                localStorageService.set(key, msg);
            },

            'get': function (key) {
                return localStorageService.get(key);
            },

            '_addmessage': function (type, msg) {
                if (localStorageService.cookie.isSupported) {
                    var messages = localStorageService.get(GlobalConstants.system.EVENT_LOG_KEY);
                    if (Object.prototype.toString.call(messages) === '[object Array]') {
                        if (messages.length >= GlobalConfig.log_storage.max_count) {
                            messages.splice(0, 1);
                        }
                        messages.push({'type': type, 'message': msg});
                    } else {
                        messages = [{'type': type, 'message': msg}];
                    }
                    return messages;
                } else {
                    logger.error(GlobalConstants.error['NO_COOKIE']);
                }
            }

        };
    }]);

angular.module('GlobalLogModule').factory('$exceptionHandler', ['$injector', 'GlobalConstants',
    function ($injector, GlobalConstants) { //todo turn back on when ready
        return function (exception) {
            console.error(exception);

            var rScope = $injector.get('$rootScope');
            var state = $injector.get('$state');
            var XHR = $injector.get('XHR');
            var GlobalConfigCacheService = $injector.get('GlobalConfigCacheService');
            var ClientInfoService = $injector.get('ClientInfoService');

            var appData = {
                error: {
                    message: exception.message,
                    stack: exception.stack
                },
                state: {
                    name: state.current.name,
                    url: state.current.url,
                    params: JSON.stringify(state.params)
                },
                system: ClientInfoService.getInfo(),
                time: new Date().toISOString()
            };

            console.info(appData);

            if (rScope) {
                rScope.$broadcast(GlobalConstants.event.broadcast.HEADER_MESSAGE, {
                    message: 'message.common.exception',
                    result: GlobalConstants.dialog_type.ERROR,
                    details: exception.message + '\n' + exception.stack,
                    type: GlobalConstants.dialog_type_class.ERROR
                });
            }
        };
    }]);
