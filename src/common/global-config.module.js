angular.module('GlobalConfigModule').constant('GlobalConfig', {
        'log_console': {
            'enabled': true,
            'log_level': 3 // 5: (ALL) TRACE, 4: INFO, 3: DEBUG, 2: WARN, 1: ERROR, 0: SILENT
        },
        'log_storage': {
            'enabled': true,
            'trace': false,
            'info': false,
            'debug': false,
            'warn': true,
            'error': true,
            'max_count': '200', //count of entries
            'lifetime': '5' //days
        },
        'supported_browsers': {
            'Chrome': 44,
            'Chrome_URL': 'https://www.google.com/intl/hu/chrome/browser/desktop/',
            'Firefox': 38,
            'Firefox_URL': 'https://www.mozilla.org/hu/firefox/new/',
            'IE': 10,
            'IE_URL': 'http://windows.microsoft.com/hu-hu/internet-explorer/download-ie'

        }
    }
);
