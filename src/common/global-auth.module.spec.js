describe('Global Auth Module', function () {
    var variables = {};
    var dependencies = {};

    beforeEach(function () {
//MODULE INJECTION
        module("appModule", "GlobalAuthModule");
        defaultDependencies.$httpBackend = "$httpBackend";
        

//SERVICE INJECTION
        dependencies.AuthService = "AuthService";
        dependencies.localStorageService = "localStorageService";

//VARIABLE INJECTION

        TestHelper.injectVariables(variables);
        TestHelper.injectDependencies(dependencies);

    });

    afterEach(function () {
        if (defaultDependencies.$httpBackend) {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }
    });

    //*****************************************************************************


    it('AuthService.statePermissionCheck returns true for valid requirement sets', function () {
        var permissions = [1, 2, 3, 4, 5];
        var validStates = ['a', 'b', 'c', 'd','e'];
        var requirements = {
            'a':1,
            'b':"5",
            'c':[1,5],
            'd':[2,"8 ||  3"], //whitespace removal
            'e':'none'
        };
        var result;
        var currentState;
        for (var i = 0; i < validStates.length; i++) { //cant use 'using' function because of nested arrays
            currentState = validStates[i];
            result = AuthService.statePermissionCheck(currentState, permissions, requirements);
            expect(result).toBe(true);
        }
    });

    it('AuthService.statePermissionCheck returns false for invalid requirement sets', function () {
        var permissions = [1, 2, 3, 4, 5];
        var invalidStates = ['a', 'b', 'c', 'd'];
        var requirements = {
            'a':6,
            'b':"7",
            'c':[1,6],
            'd':[2,"8 ||  9"] //whitespace removal
        };
        var result;
        var currentState;
        for (var i = 0; i < invalidStates.length; i++) { //cant use 'using' function because of nested arrays
            currentState = invalidStates[i];
            result = AuthService.statePermissionCheck(currentState, permissions, requirements);
            expect(result).toBe(false);
        }
    });

    it('AuthService.requestPermission doesnt load permission array without token', function () {
        var localStorageSpy = spyOn(localStorageService, 'get').and.returnValue(null);
        var cacheSpy = spyOn(GlobalConfigCacheService, 'putConfigObject');
        AuthService.requestPermission(defaultVariables.globalConfig.SERVER_URL);
        expect(localStorageSpy).toHaveBeenCalled();
        expect(cacheSpy).not.toHaveBeenCalled();
    });


    it('AuthService.requestPermission successfully loads permission array and places it to cache', function () {
        var permissions = [1, 2];
        var successResponse = {
            permissions: permissions
        };
        var fullPath = defaultVariables.globalConfig.SERVER_URL + GlobalConstants.system.AUTH_TOKEN_API;
        fullPath = fullPath.replace(':id', '1');

        var localStorageSpy = spyOn(localStorageService, 'get').and.returnValue({loginDetails: {userId: 1}});
        var cacheSpy = spyOn(GlobalConfigCacheService, 'putConfigObject');

        $httpBackend.whenGET(fullPath)
            .respond(successResponse);
        AuthService.requestPermission(defaultVariables.globalConfig.SERVER_URL);
        $httpBackend.flush();
        expect(localStorageSpy).toHaveBeenCalled();
        expect(cacheSpy).toHaveBeenCalled();
    });

    it('AuthService.requestPermission http error on loading permissions', function () {
        var fullPath = defaultVariables.globalConfig.SERVER_URL + GlobalConstants.system.AUTH_TOKEN_API;
        fullPath = fullPath.replace(':id', '1');

        spyOn(localStorageService, 'get').and.returnValue({loginDetails: {userId: 1}});
        var cacheSpy = spyOn(GlobalConfigCacheService, 'putConfigObject');

        $httpBackend.whenGET(fullPath)
            .respond(TestConstants.http_response.UNAUTHORIZED, {data: {errorMessage: 'test error message'}});
        AuthService.requestPermission(defaultVariables.globalConfig.SERVER_URL);
        $httpBackend.flush();
        expect(cacheSpy).not.toHaveBeenCalled();
    });


    it('AuthService.permissionCheck returns true for valid permission codes', function () {
        var permissions = [200, 300, 400];
        var result;
        var cacheServiceSpy = spyOn(GlobalConfigCacheService, "getConfigObject").and.returnValue(permissions);
        result = AuthService.permissionCheck(200);
        expect(cacheServiceSpy).toHaveBeenCalled();
        expect(result).toBe(true);
        result = AuthService.permissionCheck(300);
        expect(result).toBe(true);
    });

    it('AuthService.permissionCheck returns false for invalid permission codes', function () {
        var permissions = [200, 300, 400];
        var result;
        spyOn(GlobalConfigCacheService, "getConfigObject").and.returnValue(permissions);
        result = AuthService.permissionCheck(1000);
        expect(result).toBe(false);
        result = AuthService.permissionCheck('NAN');
        expect(result).toBe(false);
        result = AuthService.permissionCheck('');
        expect(result).toBe(false);
    });
});