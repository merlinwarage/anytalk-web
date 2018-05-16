'use strict';
var isTesting = true;
var TestConstants = {
    'http_response': {
        'OK': 200,
        'UNAUTHORIZED': 401,
        'NOT_FOUND': 404,
        'SERVER_ERROR': 500,
        'UNKNOWN': 5000
    }
};

var defaultDependencies = {
    "$httpBackend": "$httpBackend",
    "$rootScope": "$rootScope",
    "$timeout": "$timeout",
    "$interval": "$interval",
    "$injector": "$injector",
    "$q": "$q",
    "$http": "$http",
    "$compile": "$compile",
    "$controller": "$controller",
    "$state": "$state",
    "$templateCache": "$templateCache",
    "GlobalConstants": "GlobalConstants",
    "GlobalConfigCacheService": "GlobalConfigCacheService",
    "localStorageService": "localStorageService"
};

var defaultVariables = {
    "scope": {},
    "state": {},
    "globalConfig": {"SERVER_URL": "http://testServerPath/"}
};

var TestHelper = {

    injectVariables: function (variables) {
        angular.forEach(defaultVariables, function (variableValue, variableName) {
            window[variableName] = variableValue;
        });

        if (variables) {
            angular.forEach(variables, function (variableValue, variableName) {
                window[variableName] = variableValue;
            });
        }
    },

    injectDependencies: function (dependencies) {
        return inject(function ($injector) {
            /*jslint evil: true */
            angular.forEach(defaultDependencies, function (dependencyValue, dependencyName) {
                window[dependencyName] = eval($injector.get(dependencyValue));
            });

            if (dependencies) {
                angular.forEach(dependencies, function (dependencyValue, dependencyName) {
                    window[dependencyName] = eval($injector.get(dependencyValue));
                });
            }
            GlobalConfigCacheService.putConfigObject(GlobalConstants.system.GLOBAL_CONFIG_KEY, {SERVER_URL: "http://testServerPath/"});
        });
    },

    expectHttpCall: function (method, mockUrl, httpResponseMock, dataPromise) {
        var functionResult;
        $httpBackend.expect(method, mockUrl).respond({data: httpResponseMock});
        if (dataPromise && angular.isFunction(dataPromise.then)) {
            dataPromise.then(function (response) {
                functionResult = response.data;
            });
            $httpBackend.flush();
        } else {
            functionResult = dataPromise;
        }
        return functionResult;
    },

    expectTemplateLoad: function (mockUrl, html) {
        var functionResult;
        $httpBackend.expect('GET', mockUrl).respond(html);
    },

    expectHttpOK: function (result) {
        expect(result).toEqual(TestConstants.http_response.OK);
    },

    expectHttpFail: function (result) {
        expect(result).not.toEqual(TestConstants.http_response.OK);
    },

    // doInject: function (dependencies, variables) {
    //     this.injectDependencies(dependencies);
    //     this.injectVariables(variables);
    // },
    
    digestDirective: function(html){
        var element = $compile(angular.element(html))($rootScope);
        $rootScope.$digest();
        return element;
    }

};

function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, values[i]);
        jasmine.getEnv().description += ' (with "' + name + '" using ' + values[i].join(', ') + ')';
    }
}

angular.module('stateMock', []);
angular.module('stateMock').service("$state", function ($q) {
    this.expectedTransitions = [];
    this.transitionTo = function (stateName, params) {
        if (this.expectedTransitions.length > 0) {
            var expectedState = this.expectedTransitions.shift();
            if (expectedState.stateName !== stateName) {
                throw Error('Expected transition to state: ' + expectedState.stateName + ' but transitioned to ' + stateName);
            }
            if (!angular.equals(expectedState.params, params)) {
                throw Error('Expected params to be ' + JSON.stringify(expectedState.params) + ' but received ' + JSON.stringify(params));
            }
        } else {
            throw Error("No more transitions were expected! Tried to transition to " + stateName);
        }
        console.log("Mock transition to: " + stateName);
        return $q.when();
    };
    this.go = this.transitionTo;
    this.expectTransitionTo = function (stateName, params) {
        this.expectedTransitions.push({stateName: stateName, params: params});
    };

    this.ensureAllTransitionsHappened = function () {
        if (this.expectedTransitions.length > 0) {
            throw Error("Not all transitions happened!");
        }
    };
});