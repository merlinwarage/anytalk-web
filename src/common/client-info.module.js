angular.module('ClientInfoModule', []).factory('ClientInfoService', [function () {
    return {
        getInfo: function () {
            var parser = new UAParser(); //UAParser -> /vendor/ua-parser
            return parser.getResult();
        }
    };
}]);