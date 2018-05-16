describe('Log module', function () {

    var GlobalConstants,
        GlobalConfig,
        httpBackend,
        LogService,
        log_console;

    beforeEach(function () {
        module('GlobalLogModule');
        inject(function ($httpBackend, _GlobalConstants_, _GlobalConfig_, _LogService_) {
            httpBackend = $httpBackend;
            GlobalConstants = _GlobalConstants_;
            GlobalConfig = _GlobalConfig_;
            LogService =_LogService_;
            log_console = GlobalConfig.log_console.enabled;
        });
    });

    it('should return to trace', function () {
        expect(log_console).toEqual(true);
        expect(LogService.trace() > 4);
        expect(!log_console).toEqual(LogService.trace() == null);
    });

    it('should spy on trace', function () {
        var spy = spyOn(LogService,'trace');
        LogService.trace();
        expect(spy).toHaveBeenCalled();
    });

    it('should return to info', function () {
        expect(log_console).toEqual(true);
        expect(LogService.info() > 3);
        expect(!log_console).toEqual(LogService.info() == null);
    });

    it('should spy on info', function () {
        var spy = spyOn(LogService,'info');
        LogService.info();
        expect(spy).toHaveBeenCalled();
    });

    it('should return to debug', function () {
        expect(log_console).toEqual(true);
        expect(LogService.debug() > 2);
        expect(!log_console).toEqual(LogService.debug() == null);
    });

    it('should spy on debug', function () {
        var spy = spyOn(LogService,'debug');
        LogService.debug();
        expect(spy).toHaveBeenCalled();
    });

    it('should return to warn', function () {
        expect(log_console).toEqual(true);
        expect(LogService.warn() > 1);
        expect(!log_console).toEqual(LogService.warn() == null);
    });

    it('should spy on warn', function () {
        var spy = spyOn(LogService,'warn');
        LogService.warn();
        expect(spy).toHaveBeenCalled();
    });

    it('should return to error', function () {
        expect(log_console).toEqual(true);
        expect(LogService.error() > 0);
        expect(!log_console).toEqual(LogService.error() == null);
    });

    it('should spy on error', function () {
        var spy = spyOn(LogService,'error');
        LogService.error();
        expect(spy).toHaveBeenCalled();
    });


});