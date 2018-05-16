angular.module('appModule.user').constant('UserConstants', {
        dialogParams: {
            delete: {
                label: "common.label.delete",
                text: "message.common.confirm_delete",
                buttonOk: "common.button.ok",
                buttonCancel: "common.button.cancel",
                controller: "defaultModalDialogController"
            },
            undelete: {
                label: "common.label.undelete",
                text: "message.common.confirm_undelete",
                buttonOk: "common.button.ok",
                buttonCancel: "common.button.cancel",
                controller: "defaultModalDialogController"
            }
        },
        tableConfig: {
            name: "userTable",
            params: {
                sortingOrder: 'name',
                selectedColumn: 'name',
                reverse: false,
                search: true,
                pagination: true,
                columnSelect: true,
                rowDblclickEvent: true
            },
            structure: {
                columns: {
                    name: {
                        displayName: "entities.user.label.userName",
                        hidden: false
                    },
                    mail: {
                        displayName: "entities.user.label.email",
                        hidden: true
                    },
                    permission: {
                        displayName: "entities.user.label.permissions",
                        hidden: true
                    }
                }
            },
            buttons: {
                edit: {
                    icon: "fa fa-pencil",
                    class: "btn btn-xs btn-warning",
                    tooltip: "button.common.edit",
                    tooltipPlacement: "left",
                    width: "32px"
                },
                delete: {
                    icon: {"delete": "fa fa-trash", "undelete": "fa fa-undo"},
                    class: "btn btn-xs btn-danger",
                    tooltip: "button.common.delete",
                    tooltipPlacement: "left",
                    width: "32px"
                }
            },
            data: []
        }
    }
);