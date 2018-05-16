angular.module("GlobalAuthModule", ["LocalStorageModule", "GlobalConstantsModule", "GlobalXHRModule"]);

angular.module("GlobalAuthModule").config(["localStorageServiceProvider",
    function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix("ngAppAuth")
            .setStorageType("sessionStorage")
            .setNotify(false, false);
    }]);

angular.module("GlobalAuthModule").service("AuthService", [
    "$cookies", "$window", "localStorageService", "GlobalConstants", "XHR", "GlobalConfigCacheService", "GlobalFunctionsObject",
    "GlobalConfigService",
    function ($cookies, $window, localStorageService, GlobalConstants, XHR, GlobalConfigCacheService, GlobalFunctionsObject,
              GlobalConfigService) {
        var vm = this;

        /**
         *
         * @param key
         * @param msg
         */
        this.store = function (key, msg) {
            localStorageService.set(key, msg);
        };

        /**
         *
         * @param key
         */
        this.get = function (key) {
            return localStorageService.get(key);
        };

        /**
         *
         * @param key
         */
        this.remove = function (key) {
            return localStorageService.remove(key);
        };

        /**
         *
         */
        this.clear = function () {
            return localStorageService.clearAll();
        };


        /**
         * Cookies
         * @param key
         * @param value
         */
        this.setCookie = function (key, value) {
            var now = new $window.Date(),
                // this will set the expiration to 6 months
                exp = new $window.Date(now.getFullYear(), now.getMonth() + 6, now.getDate());

            return $cookies.put(key, value, {
                expires: exp
            });
        };

        /**
         *
         * @param key
         */
        this.getCookie = function (key) {
            return $cookies.get(key);
        };

        /**
         *
         * @param key
         */
        this.removeCookie = function (key) {
            return $cookies.remove(key);
        };

        /**
         * Permissions
         * @param serverUrl
         * @returns {*}
         */
        this.requestPermission = function (serverUrl) {
            var tokenObj = localStorageService.get(GlobalConstants.system.AUTH_TOKEN_KEY),
                apiUrl = serverUrl + GlobalConstants.system.AUTH_TOKEN_API,
                entityType = GlobalConstants.entity_type.PERMISSION_LIST;

            if (!!tokenObj) {
                return XHR.get(apiUrl, {"id": tokenObj.loginDetails.userId}, entityType).then(
                    function (successData) {
                        GlobalConfigCacheService.putConfigObject(GlobalConstants.system.PERMISSIONS, successData.permissions);
                        return successData;
                    },
                    function (errorResponse) {
                        return errorResponse;
                    }
                );
            }
        };

        /**
         *
         * @param code
         * @returns {boolean}
         */
        this.permissionCheck = function (code) {
            if (code) {
                var permissions = GlobalConfigCacheService.getConfigObject(GlobalConstants.system.PERMISSIONS);
                if (!permissions) {
                    return false;
                }

                var orSeparator = " || ";
                var codes, currentCode, valid;
                codes = code.toString().split(orSeparator);
                for (var i = 0; i < codes.length; i++) {
                    currentCode = codes[i].trim();
                    currentCode = Number(currentCode);
                    if (permissions.indexOf(currentCode) !== GlobalConstants.common.NEGATIVE_ONE_INDEX || code === "none") {
                        valid = currentCode;
                    }
                }
                return !!valid;
            } else {
                return false;
            }
        };

        this.permissionCheckByPermissionCodesPath = function (path) {
            if (!path) {
                return true;
            } //todo hack: if path is not present allow it
            var code = GlobalFunctionsObject.getObjectValueByPath(GlobalConstants.permissionCodes, path);
            if (!code) {
                return false;
            }
            return this.permissionCheck(code);
        };

        this.checkSelfEditIntent = function (targetId) {
            return targetId ? parseInt(localStorageService.get(GlobalConstants.system.AUTH_TOKEN_KEY).loginDetails.empId) === parseInt(targetId) : false;
        };

        this.permissionCheckSelfEditByPath = function (path, targetId) {
            return this.permissionCheckSelfEdit(path, targetId, GlobalConstants.selfEditPermissions);
        };

        this.permissionCheckSelfEditByStateName = function (state, targetId) {
            return this.permissionCheckSelfEdit(state, targetId, GlobalConstants.selfEditStates);
        };

        this.permissionCheckSelfEdit = function (name, targetId, acceptedNames) {
            var selfEditPermission = this.permissionCheck(GlobalConstants.permissionCodes.employee.editSelf);
            var selfEditIntent = this.checkSelfEditIntent(targetId);
            if (!selfEditIntent || !selfEditPermission) {
                return false;
            }
            return acceptedNames.indexOf(name) !== -1;
        };

        this.validateToken = function (userToken) {
            return GlobalConfigService.getServerUrl().then(function (serverUrl) {
                return XHR.get(serverUrl + GlobalConstants.states.user.API.validateToken, {token: userToken}).then(function (result) {
                    return {
                        loginDetails: {
                            userId: result.data._id,
                            userMail: result.data.mail,
                            userName: result.data.name,
                            userPermission: result.data.permission
                        },
                        token: userToken
                    };
                });
            });

        };

        /**
         *
         * @param entityName
         * @returns {{}}
         */
        this.getEntityPermissions = function (entityName) {
            var permissionList = {};
            angular.forEach(GlobalConstants.permissionCodes[entityName], function (value, key) {
                permissionList[key] = vm.permissionCheck(value);
            });
            return permissionList;
        };

        /**
         *
         * @param stateName
         * @param permissions
         * @param permRequirements
         * @returns {boolean}
         */
        this.statePermissionCheck = function (stateName, permissions, permRequirements) {
            if (!permissions) {
                return false;
            }
            var permissionsCount, permissionsMetCount = 0, permReq, currentPermReq;
            permReq = permRequirements[stateName];
            function checkPermissionOfExpression(permReq) {
                var orSeparator = " || ";
                var codes, currentCode;
                codes = permReq.toString().split(orSeparator);
                for (var i = 0; i < codes.length; i++) {
                    currentCode = codes[i].trim();
                    currentCode = Number(currentCode);
                    if (permissions.indexOf(currentCode) !== GlobalConstants.common.NEGATIVE_ONE_INDEX) {
                        return true;
                    }
                }
                return false;
            }

            if (!permReq) {
                return false; //HACK
            }
            if (permReq === "none") {
                return true;
            }
            if (typeof permReq === "string" || typeof permReq === "number") {
                permReq = [permReq];
            }
            permissionsCount = permReq.length;
            for (var i = 0; i < permissionsCount; i++) {
                currentPermReq = permReq[i];
                if (checkPermissionOfExpression(currentPermReq)) {
                    permissionsMetCount++;
                }
            }

            return permissionsCount === permissionsMetCount;
        };

        /**
         * @statusList object {STATUSNAME: statuscode}
         * @availableStatuses array api/.../statuses -> response.data
         * @return object
         */
        this.listStatusCodesByName = function (statusList, availableStatuses) {
            var statuses = {};
            angular.forEach(statusList, function (value, key) {
                if (availableStatuses.indexOf(value) !== -1) {
                    statuses[key] = value;
                }
            });
            return statuses;
        };

        /**
         * @statusList object {STATUSNAME: statuscode}
         * @typeList object {TYPENAME: typecode}
         * @availableStatuses array api/.../statuses -> response.data
         * @return object
         */
        this.listTypeStatusCodesByName = function (statusList, typeList, availableStatuses) {
            var statuses = [], types = [];
            angular.forEach(availableStatuses, function (availItem) {
                angular.forEach(statusList, function (statusItem, statusKey) {
                    if (availItem.status === statusItem) {
                        statuses[statusKey] = availItem.status;
                    }
                });
                angular.forEach(typeList, function (typeItem, typeKey) {
                    if (availItem.type === typeItem) {
                        types[typeKey] = availItem.type;
                    }
                });
            });
            return {status: statuses, type: types};
        };

        /**
         *
         * @param stateName: the current state
         * @param scope: controller's scope
         * @param dataName: formData object of the source where we put back the data when we redirected there
         * @param defaultData: empty formData object for clean slate
         * @returns {*}
         * - object when the destination is the current state
         * - true when the source is the current state
         * - false when there is no referring to the current state
         */
        this.checkReferrer = function (stateName, scope, dataName, defaultData) {
            var storedReferData = vm.get(GlobalConstants.system.REFER);
            var result = false;

            angular.forEach(storedReferData, function (item, key) {
                if (item.destinationState === stateName && !item.backFrom) {
                    result = item;
                }
                else if (item.sourceState === stateName && item.backFrom === item.destinationState) {
                    if (Object.keys(item.data).length) {
                        scope[dataName] = angular.copy(item.data);
                    } else if (defaultData) {
                        scope[dataName] = angular.copy(defaultData);
                    }

                    delete storedReferData[key];
                    vm.store(GlobalConstants.system.REFER, storedReferData);
                    result = item.sourceStateControllerParams ? {sourceStateControllerParams: item.sourceStateControllerParams} : true;
                }
            });

            if (!result) {
                vm.remove(GlobalConstants.system.REFER);
            }

            return result;
        };

    }]);