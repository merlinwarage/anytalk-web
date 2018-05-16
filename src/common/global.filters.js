angular.module("appModule").filter('htmlToPlaintext', function () {
    return function (text) {
        var plainText = text;
        var regex = [/<br[^>]*>/gi, /<p[^>]*>/gi, /<li[^>]*>/gi, /<ul[^>]*>/gi, /<ol[^>]*>/gi];
        regex.forEach(function (value) {
            plainText = plainText.replace(value, "\n");
        });
        return plainText.replace(/<[^>]+>/gm, '');
    };
});

angular.module("appModule").filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});

angular.module("appModule").filter('ellipsis', ['$filter', function ($filter) {
    return function (value, maxLength) {
        if (value) {
            value = value.toString();
            return (value.length > maxLength) ? $filter('limitTo')(value, maxLength).trim() + '...' : value;
        } else {
            return '';
        }
    };
}]);

angular.module("appModule").filter('orderObjectBy', function () {
    return function (items, orderByField, subProperty, reverse) {
        var filtered = [],
            orderHelper = '_orderHelper';

        angular.forEach(items, function (item) {
            item[orderHelper] = subProperty ? item[subProperty][orderByField] : item[orderByField];
            filtered.push(item);
        });

        filtered.sort(function (a, b) {
            return (a[orderHelper] > b[orderHelper] ? 1 : -1);
        });

        if (reverse) {
            filtered.reverse();
        }
        return filtered;
    };
});

angular.module("appModule").filter('orderObjectByProperty', function () {
    return function (input, attribute) {
        if (!angular.isObject(input)) {
            return input;
        }

        var array = [];
        for (var objectKey in input) {
            if (input.hasOwnProperty(objectKey)) {
                array.push(input[objectKey]);
            }
        }

        array.sort(function (a, b) {
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    };
});

angular.module("appModule").filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    };
});