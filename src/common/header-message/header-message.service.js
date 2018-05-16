angular.module('GlobalXHRModule').service('HeaderMessageManager', ['$rootScope', '$http', '$q', '$resource', '$timeout', 'LogService', 'GlobalConstants',
    function ($rootScope, $http, $q, $resource, $timeout, LogService, GlobalConstants) {

        var typeClassMap = {};
        typeClassMap[GlobalConstants.dialog_type.SUCCESS] = GlobalConstants.dialog_type_class.SUCCESS;
        typeClassMap[GlobalConstants.dialog_type.WARNING] = GlobalConstants.dialog_type_class.WARNING;
        typeClassMap[GlobalConstants.dialog_type.ERROR] = GlobalConstants.dialog_type_class.ERROR;
        typeClassMap[GlobalConstants.dialog_type.INVALID_PERMISSION] = GlobalConstants.dialog_type_class.WARNING;
        typeClassMap[GlobalConstants.dialog_type.READ_ONLY] = GlobalConstants.dialog_type_class.WARNING;
        typeClassMap[GlobalConstants.dialog_type.INVALID_DATE_RANGE] = GlobalConstants.dialog_type_class.WARNING;
        typeClassMap[GlobalConstants.dialog_type.RANGE_OVER_PROJECT_TIME] = GlobalConstants.dialog_type_class.WARNING;
        typeClassMap[GlobalConstants.dialog_type.LIMIT_REACHED] = GlobalConstants.dialog_type_class.ERROR;
        typeClassMap[GlobalConstants.dialog_type.DUPLICATED_ENTRY] = GlobalConstants.dialog_type_class.ERROR;
        typeClassMap[GlobalConstants.dialog_type.INTERVALS_OVERLAP] = GlobalConstants.dialog_type_class.ERROR;


        this.broadcastMessage = function (result /*SUCCESS, WARNING, ERROR*/,
                                          entityType /* uj konstansok: pl. EMPLOYEE, LOCK, XXX*/,
                                          operation /*  uj konstansok: pl. LOAD, SAVE, DELETE, NONE*/,
                                          parameters /*OPT*/,
                                          details /*OPT*/) {

            $rootScope.$broadcast(GlobalConstants.event.broadcast.HEADER_MESSAGE, {
                result: result,
                entityType: entityType,
                operation: operation,
                parameters: parameters,
                details: details,
                type: typeClassMap[result]
            });
        };

        this.broadcastCustomMessage = function (message,
                                                result /*SUCCESS, WARNING, ERROR*/,
                                                entityType,
                                                parameters /*OPT*/,
                                                details /*OPT*/) {

            $rootScope.$broadcast(GlobalConstants.event.broadcast.HEADER_MESSAGE, {
                message: message,
                result: result,
                entityType: entityType,
                parameters: parameters,
                details: details,
                type: typeClassMap[result]
            });
        };

    }]);