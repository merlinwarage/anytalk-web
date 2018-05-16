describe('Client information', function () {

    beforeEach(function () {
        module("appModule");
    });

    it('getInfo: expects getInfo not null', inject(function (ClientInfoService) {
        var info = ClientInfoService.getInfo();
        expect(typeof info).toEqual('object');
    }));

});