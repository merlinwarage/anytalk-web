angular.module('appModule').controller('defaultModalDialogController', [
    '$rootScope', '$scope', '$uibModalInstance', 'GlobalConstants', 'dialogParam', 'args',
    function ($rootScope, $scope, $uibModalInstance, GlobalConstants, dialogParam, args) {

        $scope.note = GlobalConstants.common.EMPTY_STRING;

        if (dialogParam) {
            $scope.dialogParam = dialogParam;
        }

        if (args && args.note) {
            $scope.showNote = args.note;
        }

        $scope.confirmOK = function () {
            var data = {};
            if (args && args.note) {
                data = {id: args.id, data: $scope.note};
                $rootScope.$broadcast(GlobalConstants.event.broadcast.DEFAULT_MODAL_DIALOG_CONTROLLER_NOTE, data);
            }
            $uibModalInstance.close({dialogResponse: data});
        };

        $scope.confirmCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

angular.module('appModule').controller('treeModalDialogController', [
    '$rootScope', '$scope', '$uibModalInstance', 'dialogParam',
    function ($rootScope, $scope, $uibModalInstance, dialogParam) {
        if (dialogParam) {
            $scope.dialogParam = dialogParam;
        }

        $scope.nodeEvent = false;

        $scope.$on('nodeEvent', function (event, value) {
            $scope.dialogParam.content.treeData.currentNode = value.currentNode;
            $scope.nodeEvent = !!value.state;
        });

        var deselectNode = function (selectedNode) {
            if (selectedNode) {
                selectedNode.selected = undefined;
            }
        };

        $scope.confirmOK = function () {
            $rootScope.$broadcast('onTreeSelectionSubmit', {
                selectedNode: $scope.dialogParam.content.treeData.currentNode
            });
            deselectNode($scope.dialogParam.content.treeData.currentNode);
            $uibModalInstance.close();
        };

        $scope.confirmCancel = function () {
            deselectNode($scope.dialogParam.content.treeData.currentNode);
            $uibModalInstance.dismiss('cancel');
        };

    }]);

angular.module('appModule').controller('ModalInstanceCtrl', [
    '$rootScope', '$scope', '$uibModalInstance', 'dialogParam',
    function ($rootScope, $scope, $uibModalInstance, dialogParam) {
        if (dialogParam) {
            $scope.dialogParam = dialogParam;
        }

        if (typeof  dialogParam === 'object' && dialogParam.length) {
            angular.forEach(dialogParam, function (value) {
                $scope[value.name] = value.value;
            });
            $scope.selectorGridName = dialogParam[0].name;
            $scope.targetGridName = dialogParam[2].value;
        }

        $scope.addButton = function (gridName) {
            $rootScope.$broadcast('onSelectionSubmit', {
                targetGridName: $scope.targetGridName,
                selectedRows: $scope[gridName].controlFunctions.selectedRows
            });
            $scope[gridName].controlFunctions.selectedRows = [];
            $uibModalInstance.close();
        };

        $scope.confirmOK = function () {
            $uibModalInstance.close();
        };

        $scope.confirmCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

angular.module('appModule').controller('BasicSelectorModalController', [
    '$rootScope', '$scope', '$uibModalInstance', 'dialogParam', 'UiGridSelectorService',
    function ($rootScope, $scope, $uibModalInstance, dialogParam, UiGridSelectorService) {
        if (dialogParam) {
            $scope.dialogParam = dialogParam;
            $scope.selectorGridCfg = $scope.dialogParam.selectorGridCfg;
        }

        $scope.selectorGridName = $scope.selectorGridCfg.selectorGridName;
        $scope.targetGridName = $scope.selectorGridCfg.targetGridName;
        UiGridSelectorService.initSelectorGid($scope, $scope.selectorGridCfg.selectorGridName, $scope.selectorGridCfg.targetGridName,
            $scope.selectorGridCfg.selectionDataSourceName, $scope.selectorGridCfg.selectorSubmitFn, $scope.selectorGridCfg.mode,
            $scope.selectorGridCfg.extraButtons, $scope.selectorGridCfg.urlParams, $scope.selectorGridCfg.customParams);

        $scope.addButton = function (gridName) {
            var selectedRows = $scope[gridName].controlFunctions.selectedRows;

            $rootScope.$broadcast('onSelectionSubmit', {
                targetGridName: $scope.targetGridName,
                selectedRows: selectedRows
            });
            $scope[gridName].controlFunctions.selectedRows = [];
            $uibModalInstance.close();
        };

        $scope.confirmOK = function () {
            $uibModalInstance.close();
        };

        $scope.confirmCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

angular.module('appModule').controller('BasicSimpleSelectorModalController', [
    '$rootScope', '$scope', '$uibModalInstance', 'dialogParam', 'UiGridSelectorService',
    function ($rootScope, $scope, $uibModalInstance, dialogParam, UiGridSelectorService) {
        if (dialogParam) {
            $scope.dialogParam = dialogParam;
            $scope.selectorGridCfg = $scope.dialogParam.selectorGridCfg;
        }

        $scope.selectorGridName = $scope.selectorGridCfg.selectorGridName;
        $scope.targetGridName = $scope.selectorGridCfg.targetGridName;

        UiGridSelectorService.initSimpleSelectorGid($scope, $scope.selectorGridCfg.selectorGridName, $scope.selectorGridCfg.targetGridName,
            $scope.selectorGridCfg.selectionDataSourceName, $scope.selectorGridCfg.selectorSubmitFn, $scope.selectorGridCfg.mode,
            $scope.selectorGridCfg.extraButtons, $scope.selectorGridCfg.urlParams, $scope.selectorGridCfg.customParams);

        $scope.addButton = function (gridName) {
            var selectedRows = $scope[gridName].controlFunctions.selectedRows;

            $rootScope.$broadcast('onSelectionSubmit', {
                targetGridName: $scope.targetGridName,
                selectedRows: selectedRows
            });
            $scope[gridName].controlFunctions.selectedRows = [];
            $uibModalInstance.close();
        };

        $scope.confirmOK = function () {
            $uibModalInstance.close();
        };

        $scope.confirmCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

angular.module('appModule').controller('SuperiorSelectorGridModalInstanceCtrl', [
    '$rootScope', '$scope', '$uibModalInstance', 'dialogParam', 'UiGridSelectorService', '$timeout',
    'GlobalConfigCacheService', 'GlobalConstants', 'XHR', 'UiGridService',
    function ($rootScope, $scope, $uibModalInstance, dialogParam, UiGridSelectorService, $timeout,
              GlobalConfigCacheService, GlobalConstants, XHR, UiGridService) {

        $scope.template = {url: 'src/app/employee/employee-superior-modal.tpl.html'};
        $scope.superiorRole = {id: {}};

        if (dialogParam) {
            $scope.dialogParam = dialogParam;
            $scope.selectorGridCfg = $scope.dialogParam.selectorGridCfg;
            $scope.selectorGridCfg.onlyCurrentlyWorking = true;
            var url = GlobalConfigCacheService.getConfigObject(GlobalConstants.system.GLOBAL_CONFIG_KEY).SERVER_URL + GlobalConstants.states.employee.API_GET_PERSONAL_DATA_URL;
            //url, params, entityType
            XHR.get(url, {
                id: dialogParam.selectorGridCfg.urlParams.id,
                mode: 'ro'
            }, GlobalConstants.entity_type.NO_MESSAGE).then(function (result) {
                $scope.titleData = result.data;
            });
        }

        $scope.selectorGridName = $scope.selectorGridCfg.selectorGridName;
        $scope.roleTranslation = $scope.selectorGridName === 'subordinates_grid_advanced' ?
            $scope.roleTranslation = 'myRole' : $scope.roleTranslation = 'role';

        $scope.targetGridName = $scope.selectorGridCfg.targetGridName;
        UiGridSelectorService.initSelectorGid($scope, $scope.selectorGridCfg.selectorGridName, $scope.selectorGridCfg.targetGridName,
            $scope.selectorGridCfg.selectionDataSourceName, $scope.selectorGridCfg.selectorSubmitFn, $scope.selectorGridCfg.mode,
            $scope.selectorGridCfg.extraButtons, $scope.selectorGridCfg.urlParams, $scope.selectorGridCfg.customParams);
        var watcher = $scope.$watch($scope.selectorGridCfg.selectorGridName + '.isLoading', function (newVal) {
            if (newVal !== undefined && newVal === false) {
                $scope[$scope.selectorGridCfg.selectorGridName].paginationPageSize = 5; //hack to make modal advanced grids smaller
                watcher();
                $scope.$watch('superiorRole.id.id', function (newVal) {
                    if (newVal) {
                        $scope[$scope.selectorGridCfg.selectorGridName].apiCfg.urlParams.role = $scope.superiorRole.id.value;
                        UiGridService.refreshGridFromServer($scope[$scope.selectorGridCfg.selectorGridName]);
                    }
                });
            }
        });
        $scope.addButton = function (gridName) {
            var selectedEmployees = [];
            var selectedRows = $scope[gridName].controlFunctions.selectedRows;

            angular.forEach(selectedRows, function (row) {
                if (gridName === "subordinates_grid_advanced") {
                    selectedEmployees.push({
                        employee: row,
                        role: $scope.superiorRole.id
                    });
                }
                else if (gridName === "superiors_grid_advanced") {
                    selectedEmployees.push({
                        employee: row,
                        role: $scope.superiorRole.id
                    });
                }
            });

            $rootScope.$broadcast('onSelectionSubmit', {
                targetGridName: $scope.targetGridName,
                selectedRows: selectedEmployees
            });
            $scope[gridName].controlFunctions.selectedRows = [];
            $uibModalInstance.close();
        };

        $scope.confirmOK = function () {
            $uibModalInstance.close();
        };

        $scope.confirmCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

angular.module('appModule').controller('InfoModalInstanceCtrl', [
    '$rootScope', '$scope', '$uibModalInstance', 'dialogParam', 'GlobalFunctionsString',
    function ($rootScope, $scope, $uibModalInstance, dialogParam, GlobalFunctionsString) {
        $scope.entity = dialogParam;
        $scope.constantFormat = GlobalFunctionsString.constantFormat;

        $scope.confirmCancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.print = function () {
            var newWin;
            var divToPrint = document.getElementById("reportTable");
            newWin = window.open("");
            var html = divToPrint.outerHTML;
            var style = "<style>" +

                ".report-table th{border-bottom:1px dotted #AAA} .report-table td {border:1px dotted #DDD}.report-table {border-collapse:collapse;width:29cm;table-layout: fixed; font-size:8px;font-family:sans-serif;} .report-table th{text-overflow: ellipsis;  white-space: nowrap;  overflow: hidden;  }" +

                "</style>";
            newWin.document.write(style + html);
            newWin.print();
        };

    }]);

angular.module('appModule').controller('EmployeeInactivationResponseModalDialogController', [
    '$rootScope', '$scope', '$uibModalInstance', 'GlobalConstants', 'CommonFormService', 'XHR', 'data', 'empId', 'superiors', 'deleteUrl',
    function ($rootScope, $scope, $uibModalInstance, GlobalConstants, CommonFormService, XHR, data, empId, superiors, deleteUrl) {
        $scope.superiors = [];
        $scope.superiors = CommonFormService.convertArrayToComboCustomList(superiors.items, $scope.superiors, 'id', 'firstName, lastName', 'firstName, lastName', true);
        $scope.filterTables = function (item) {
            return !!item.entities.length;
        };

        $scope.data = data.data;
        $scope.assetDependency = "asset";
        $scope.leaveDependency = "leaveRequest";
        $scope.subordinateDependency = "subordinate";
        $scope.newSuperior = {};

        $scope.confirmOK = function () {
            var params = {id: empId};
            if ($scope.newSuperior.id) {
                params.newSuperiorId = $scope.newSuperior.id;
            }
            XHR.delete(deleteUrl, params, GlobalConstants.entity_type.EMPLOYEE).then(
                function () {
                    $uibModalInstance.close();
                }
            );
        };

        $scope.closeBtn = function () {
            $uibModalInstance.dismiss();
        };
    }]);

angular.module('appModule').controller('AssetInactivationResponseModalDialogController', [
    '$scope', '$uibModalInstance', 'GlobalConstants', 'XHR', 'data', 'assetId', 'deleteUrl',
    function ($scope, $uibModalInstance, GlobalConstants, XHR, data, assetId, deleteUrl) {

        $scope.data = data;
        $scope.confirmOK = function () {
            var params = {id: assetId};
            XHR.delete(deleteUrl, params, GlobalConstants.entity_type.ASSET).then(
                function () {
                    $uibModalInstance.close();
                }
            );
        };

        $scope.closeBtn = function () {
            $uibModalInstance.dismiss();
        };
    }]);