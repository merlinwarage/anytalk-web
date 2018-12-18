angular.module("GlobalConstantsModule", []).constant("GlobalConstants", {
        "system": {
            "GLOBAL_SETTINGS_KEY": "globalSettings",
            "GLOBAL_CONFIG_KEY": "globalConfig",
            "CONFIG_URL": "assets/json/config/global-config.json",
            "SETTINGS_URL": "api/sys/cfg/current",
            "LIST_SCHEMA_KEY": "listConfig",
            "LIST_SCHEMA_URL": "assets/json/lists/list-config.json",
            "LOGIN_RESPONSE_KEY": "loginData",
            "EVENT_LOG_KEY": "eventLogKey",
            "AUTH_TOKEN_KEY": "authTokenKey",
            "PERMISSIONS": "permissions",
            "AUTH_TOKEN_API": "api/sys/security/permissions/:id",
            "SETTINGS": "settings",
            "REFER": "refer"
        },

        "regex": {
            "urlRegex": /((https?|ftps?):\/\/[^"<\s]+)(?![^<>]*>|[^"]*?<\/a)/ig,
            "youtubeRegex": /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/,
            "imageRegex": /\.(jpeg|jpg|gif|png)$/,
            "videoRegex": /\.(mp4|ogv|webm|gifv)$/,
            "codeTag": /\[\/?code\]/g,
            "getYear": /yyyy.|.yyyy/gi
        },

        "settings": {
            "REGION": "region",
            "LANGUAGE": "language",
            "DATEFORMAT": "dateformat",
            "HOUR_AND_MIN": " HH:mm"
        },

        "permissionCodes": {
            "user": 1,
            "admin": 10
        },

        "languages": {
            "hu": "hu_HU",
            "en": "en_US"
        },

        "common": {
            "ZERO": 0,
            "NEGATIVE_ONE_INDEX": -1,
            "UNDEFINED": undefined,
            "EMPTY_STRING": "",
            "DOT_SYNTAX": ".",
            "NOT_AVAILABLE": "N/A",
            "DEFAULT_LIST_VALUE": 1,
            "LIST_DEFAULT_KEY_COLUMN": "id",
            "LIST_ITEM_STRUCTURE": {
                "id": "",
                "values": []
            },
            "tags": {
                "ENTITIES": "entities"
            },
            "KEYWORDS": "keywords",
            "ERROR_LOG_URL": "api/sys/error/log"
        },

        "statePermissionRequirements": {
            "main": "none",
            "main.home": "none",
            "main.messenger": "none"
        },

        "page": {
            "TITLE": " | MWO"
        },

        "errorMessage": {
            "E11000_MAIL": "common.error.duplicatedMail",
            "E11000_NAME": "common.error.duplicatedName",
            "E11000": "common.error.duplicatedItem"
        },

        "error": {
            "200": "OK",
            "201": "Created",
            "202": "Accepted",
            "203": "Non-Authoritative Information",
            "204": "No Content",
            "205": "Reset Content",
            "206": "Partial Content",
            "207": "Multi-Status",
            "208": "Already Reported",
            "226": "IM Used",
            "300": "Multiple Choices",
            "301": "Moved Permanently",
            "302": "Found",
            "303": "See Other",
            "304": "Not Modified",
            "305": "Use Proxy",
            "306": "Switch Proxy",
            "307": "Temporary Redirect",
            "308": "Permanent Redirect",
            "400": "Bad Request",
            "401": "Unauthorized",
            "402": "wage Required",
            "403": "Forbidden",
            "404": "Not Found",
            "405": "Method Not Allowed",
            "406": "Not Acceptable",
            "407": "Proxy Authentication Required",
            "408": "Request Timeout",
            "409": "Conflict",
            "410": "Gone",
            "411": "Length Required",
            "412": "Precondition Failed",
            "413": "Request Entity Too Large",
            "414": "Request-URI Too Long",
            "415": "Unsupported Media Type",
            "416": "Requested Range Not Satisfiable",
            "417": "Expectation Failed",
            "418": "I`m a teapot",
            "419": "Authentication Timeout",
            "420": "Method Failure",
            "422": "Unprocessable Entity",
            "423": "Locked",
            "424": "Failed Dependency",
            "426": "Upgrade Required",
            "428": "Precondition Required",
            "429": "Too Many Requests",
            "431": "Request Header Fields Too Large",
            "440": "Login Timeout",
            "444": "No Response",
            "449": "Retry With",
            "450": "Blocked by Windows Parental Controls",
            "451": "Redirect",
            "494": "Request Header Too Large",
            "495": "Cert Error",
            "496": "No Cert",
            "497": "HTTP to HTTPS",
            "498": "Token expired/invalid",
            "499": "Client Closed Request",
            "500": "Internal Server Error",
            "501": "Not Implemented",
            "502": "Bad Gateway",
            "503": "Service Unavailable",
            "504": "Gateway Timeout",
            "505": "HTTP Version Not Supported",
            "506": "Variant Also Negotiates",
            "507": "Insufficient Storage",
            "508": "Loop Detected",
            "509": "Bandwidth Limit Exceeded",
            "510": "Not Extended",
            "511": "Network Authentication Required",
            "598": "Network read timeout error",
            "599": "Network connect timeout error",
            "NO_COOKIE": "No cookie support",
            "UNKNOWN": "Server error"
        },
        "http_response": {
            "OK": 200,
            "UNAUTHORIZED": 401,
            "NOT_FOUND": 404,
            "SERVER_ERROR": 500,
            "UNKNOWN": 5000
        },
        "smtpAuthTypes": ["NONE", "SSL", "TLS", "STARTTLS"],
        "event": {
            "emit": {
                "SHOW_ROOM_BUTTON": "showRoomBtn",
                "SHOW_ADD_ROOM_BUTTON": "showAddRoomBtn",
                "SELECTED_CATEGORY": "selectedCategory",
                "HEADER_MESSAGE": "headerMessageEventEmit",
                "DATA_EVENT": "dataEvent"
            },
            "broadcast": {
                "NEW_ITEM_REQUEST": "newItemRequestBroadcast",
                "EDIT_ITEM_REQUEST": "editItemRequestBroadcast",
                "DELETE_ITEM_REQUEST": "deleteItemRequestBroadcast",
                "EDIT_ITEM_CANCEL": "editItemCancelBroadcast",
                "SUBVIEW_FORM_SUBMIT_SUCCESS": "subviewFormSubmitSuccessBroadcast",
                "HEADER_MESSAGE": "headerMessageEventBroadcast",
                "UPDATE_FORM_ERRORS": "updateFormErrorsBroadcast",
                "DEFAULT_MODAL_DIALOG_CONTROLLER_NOTE": "defaultModalDialogControllerNote",
                "ADD_ROOM": "addRoom"
            },
            "flag": {
                "CLEAR_FORM_ERRORS": "clearFormErrorsBroadcast"
            }
        },
        "dialog_content": {
            "NO_MESSAGE": ""
        },
        "dialog_type": {
            "SUCCESS": "success",
            "WARNING": "warning",
            "ERROR": "error",
            "INVALID_PERMISSION": "invalidPermission",
            "READ_ONLY": "readOnly",
            "INVALID_DATE_RANGE": "invalidDateRange",
            "RANGE_OVER_PROJECT_TIME": "rangeOverProjectTime",
            "LIMIT_REACHED": "limitReached",
            "DUPLICATED_ENTRY": "duplicatedEntry",
            "INTERVALS_OVERLAP": "intervalsOverlap"
        },
        "dialog_type_class": {
            "SUCCESS": "alert alert-success",
            "WARNING": "alert alert-warning",
            "ERROR": "alert alert-danger"
        },
        "timer": {
            "STATUSDIALOG_HIDE": {"delay": 1500, "name": "statusDialogHide"},
            "FORMLOCK": {"delay": 600000, "name": "formLock"},
            "AFTER_STATE_CHANGE": {"delay": 800, "name": "afterStateChange"}
        },
        "templateURL": {
            "DOCUMENT_MANAGER": "assets/document-manager/document-manager-form.tpl.html"
        },
        "listener": {
            "DASHBOARD_SEARCH_DATA": "dashboardSearchData"
        },
        "states": {
            "header": {
                "TPL": "src/app/header/header.tpl.html",
                "header_message": {
                    "TPL": "assets/header-message/templates/header-message.tpl.html"
                },
                "header_notification": {
                    "TPL": "src/app/header/header-notification.tpl.html"
                }
            },

            "main": {
                "NAME": "main",
                "TPL": {
                    "main": {template: "<ui-view='main'></ui-view>"},
                    "secondary": {template: "<ui-view='secondary'></ui-view>"}
                }
            },

            "home": {
                "NAME": "main.home",
                "URL": "/r",
                "TPL": "src/app/home/home.tpl.html",
                "TITLE": "Home",
                "API": {}
            },

            "room": {
                "NAME": "main.room",
                "URL": "/r/:id",
                "TPL": 'src/app/room/room.tpl.html',
                "TPL_CATEGORY": 'src/app/room/room-category.tpl.html',
                "TITLE": "pageTitles.Messenger",
                "API": {
                    "getPrivates": 'api/v1/room/private',
                    "getHot": 'api/v1/room/hot',
                    "getNew": 'api/v1/room/new',
                    "getFeatured": 'api/v1/room/featured',
                    "getFavorites": 'api/v1/room/favorite',
                    "getByPages": "api/v1/room/paginate", //post
                    "getOneByUser": "api/v1/room/users/:id",
                    "getOneById": "api/v1/room/:id",
                    "getOneByTitle": "api/v1/room/title/:title",
                    "add": "api/v1/room",
                    "update": "api/v1/room/:id",
                    "delete": "api/v1/room/:id",
                    "addMember": "api/v1/room/members",
                    "getNews": "api/v1/news"
                },
                "TYPE": {
                    "article": "article",
                    "forum": "forum",
                    "link": "link",
                    "qna": "qna"
                },
                "CATEGORY": {
                    "business": "business",
                    "gaming": "gaming",
                    "entertainment": "entertainment",
                    "general": "general",
                    "music": "music",
                    "sport": "sport",
                    "technology": "technology",
                    "science": "science",
                    "social": "social"
                },
                "ICON": ""
            },

            "messenger": {
                "NAME": "main.messenger",
                "URL": "/m/:title/:msg",
                "TPL": 'src/app/messenger/messenger.tpl.html',
                "TITLE": "pageTitles.Messenger",
                "API": {
                    "getAll": "api/v1/message",
                    "getByPages": "api/v1/message/paginate", //post
                    "getOneByUser": "api/v1/message/users/:id",
                    "getOneById": "api/v1/message/:room/:id",
                    "delete": "api/v1/message/:room/:id",
                    "add": "api/v1/message",
                    "update": "api/v1/message",
                    "vote": "api/v1/message/vote"
                },
                "ICON": ""
            },

            "user": {
                "NAME": "main.user",
                "URL": "/u",
                "TPL": 'src/app/user/user.tpl.html',
                "TITLE": "pageTitles.User",
                "API": {
                    "getOne": "api/v1/user/:id",
                    "getAll": "api/v1/user",
                    "add": "api/v1/user",
                    "delete": "api/v1/user/:id",
                    "login": "api/v1/user/login/:id",
                    "getActivities": "api/v1/user/info/activities",
                    "updateFavorites": "api/v1/user/favorites",
                    "validateToken": "api/v1/user/validate/:token"
                },
                "ICON": ""
            }

        },
        "entity_type": {
            "BUSINESS_ENTITY": "businessEntity",
            "MESSENGER_ENTITY": "messengerEntity"
        },
        "operation": {
            "LOAD": "load",
            "SAVE": "save",
            "DELETE": "delete",
            "UPDATE": "update",
            "TIMEOUT": "timeout",
            "BLOCK": "block",
            "ADD": "add",
            "DUPLICATE": "duplicate"
        }
    }
);
