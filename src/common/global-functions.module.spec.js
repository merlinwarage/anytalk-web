describe('Global Functions', function () {

    var variables = {};
    var dependencies = {};

    beforeEach(function () {
        module("appModule", 'GlobalFunctionsModule');
        dependencies.GlobalFunctionsDate = "GlobalFunctionsDate";
        dependencies.GlobalFunctionsObject = "GlobalFunctionsObject";
        dependencies.GlobalFunctionsString = "GlobalFunctionsString";
        dependencies.GlobalFunctionsDialog = "GlobalFunctionsDialog";
        dependencies.GlobalFunctionsTemplateLoader = "GlobalFunctionsTemplateLoader";
        dependencies.$uibModal = "$uibModal";
        
        TestHelper.injectVariables(variables);
        TestHelper.injectDependencies(dependencies);
    });


    ///GlobalFunctionsDate


    it('Function: GlobalFunctionsDate.getDate', function () {
        var simple = true;
        var date = new Date();
        date.setDate(date.getDate());
        date.setUTCSeconds(0, 0);
        var testDate = GlobalFunctionsDate.getDate();
        testDate.setUTCSeconds(0, 0);
        expect(testDate).toEqual(date);
    });

    it('GlobalFunctionsDate.getDiffInHours', function () {
        var beginDate = new Date(7200000);
        var endDate = new Date(3600000);
        expect(GlobalFunctionsDate.getDiffInHours(beginDate, endDate)).toEqual(1);
        endDate = new Date(5500000);
        expect(GlobalFunctionsDate.getDiffInHours(beginDate, endDate)).toEqual(0);
    });

    it('GlobalFunctionsDate.rangeOverLimit', function () {
        spyOn(GlobalFunctionsDate, 'getDiffInHours').and.callFake(function () {
            return 3;
        });
        expect(GlobalFunctionsDate.rangeOverLimit(0, 0, 3)).toBeTruthy();
        expect(GlobalFunctionsDate.rangeOverLimit(0, 0, 4)).toBeFalsy();
    });

    it('GlobalFunctionsDate.getTime', function () {
        var numbers = GlobalFunctionsDate.getTime().split('-');
        expect(parseInt(numbers[0])).not.toEqual(NaN);
        expect(parseInt(numbers[1])).not.toEqual(NaN);
    });

    it('GlobalFunctionsDate.getEPOCHTime', function () {
        var result = new Date(GlobalFunctionsDate.getEPOCHTime());
        expect(result.getDay()).not.toEqual(NaN);
    });

    it('GlobalFunctionsDate.getISODate', function () {
        var result = GlobalFunctionsDate.getISODate();
        expect(result.match(/.*00:00.000Z/)).not.toEqual(null);
    });


    //GlobalFunctionsObject

    it('GlobalFunctionsObject.getKeyByValue', function () {
        var object = {a: 1, b: [], c: 'a'};
        expect(GlobalFunctionsObject.getKeyByValue(object, 1)).toEqual('a');
        expect(GlobalFunctionsObject.getKeyByValue(object, [])).toEqual(undefined);
        expect(GlobalFunctionsObject.getKeyByValue(object, 'a')).toEqual('c');
        expect(GlobalFunctionsObject.getKeyByValue(object, 200)).toEqual(undefined);
    });

    it('GlobalFunctionsObject.searchProperty', function () {
        var object = {aaa: 2, a: 1, b: {aa: {aaa: 1, bbb: 5}}, c: 'a'};
        expect(GlobalFunctionsObject.searchProperty(object, 'aaa')).toEqual(2);
        expect(GlobalFunctionsObject.searchProperty(object, 'bbb')).toEqual(5);
    });

    it('GlobalFunctionsObject.isDuplicatedByValue', function () {
        var arr = [{a: 2}, {a: 2}, {a: 2}, {b: 2}, {b: 2}, {c: 1}];
        expect(GlobalFunctionsObject.isDuplicatedByValue(arr, 'a', 2, 2)).toBeTruthy();
        expect(GlobalFunctionsObject.isDuplicatedByValue(arr, 'a', 2, 3)).toBeFalsy();
        expect(GlobalFunctionsObject.isDuplicatedByValue(arr, 'b', 2, 1)).toBeTruthy();
        expect(GlobalFunctionsObject.isDuplicatedByValue(arr, 'c', 1, 1)).toBeFalsy();
        expect(GlobalFunctionsObject.isDuplicatedByValue()).toBeFalsy();
    });

    it('GlobalFunctionsObject.clearObject', function () {
        var obj = {
            a: {a1: 1, a2: 2, a3: 3},
            b: {b1: 1, a2: 2, a3: 3},
            c: {c1: 1, a2: 2, a3: 3},
            d: {d1: 1, d2: 2}
        };
        expect(GlobalFunctionsObject.clearObject(obj).a.a1).not.toBeDefined();
        var result = GlobalFunctionsObject.clearObject(obj, {b1: 10});
        expect(result.a.a1).not.toBeDefined();
        expect(result.b.b1).toEqual(10);
        result = GlobalFunctionsObject.clearObject(obj, {b1: 10}, true, {asd: 'asdov'});
        expect(result.a.asd).toEqual('asdov');
        expect(result.b.b1).toEqual(undefined);
        expect(result.b.asd).toEqual('asdov');

    });

    it('GlobalFunctionsObject.deleteObjectByProperty', function () {
        var arr = [
            {a1: 1, a2: 2, a3: 3},
            {b1: 1, a2: 2, a3: 2},
            {c1: 1, a2: 2, a3: 1},
            {d1: 1, d2: 2}
        ];

        GlobalFunctionsObject.deleteObjectByProperty(arr, 'a3', 2);
        expect(arr.length).toEqual(3);
        GlobalFunctionsObject.deleteObjectByProperty(arr, 'a3', 3);
        expect(arr.length).toEqual(2);
    });

    it('GlobalFunctionsObject.getValueIdHashMapOfList', function () {
        var arr = [
            {listCode: 100, listStores: [{id: 10, value: 'aa'}]},
            {listCode: 120, listStores: [{id: 11, value: 'bb'}]}
        ];

        spyOn(GlobalConfigCacheService, 'getConfigObject').and.callFake(function () {
            return arr;
        });

        var result = GlobalFunctionsObject.getValueIdHashMapOfList(120);
        expect(result.bb).toEqual(11);
        expect(function () {
            GlobalFunctionsObject.getValueIdHashMapOfList(120000000000323);
        }).toThrowError();
    });


    it('GlobalFunctionsObject.getValuePropertyHashMapOfList', function () {
        var arr = [
            {listCode: 100, listStores: [{id: 10, value: 'aa'}]},
            {listCode: 120, listStores: [{id: 11, value: 'bb'}]}
        ];

        spyOn(GlobalConfigCacheService, 'getConfigObject').and.callFake(function () {
            return arr;
        });

        var result = GlobalFunctionsObject.getValuePropertyHashMapOfList(120);
        expect(result['11']).toEqual('bb');
        expect(function () {
            GlobalFunctionsObject.getValuePropertyHashMapOfList(120000000000323);
        }).toThrowError();
    });


    it('GlobalFunctionsObject.getObjectElementByValue', function () {
        var arr = [
            {listCode: 100, value: 10},
            {listCode: 120, value: 20}
        ];

        var result = GlobalFunctionsObject.getObjectElementByValue(arr, 20, 'value', 'listCode');
        expect(result).toEqual(120);
    });


    it('GlobalFunctionsObject.setObjectValueByPath', function () {
        var obj = {};
        GlobalFunctionsObject.setObjectValueByPath(obj, 10, 'a.b.c');
        expect(obj.a.b.c).toEqual(10);
        obj.a.d = {};
        GlobalFunctionsObject.setObjectValueByPath(obj, 11, 'a.b.d.e');
        expect(obj.a.b.d.e).toEqual(11);
    });


    it('GlobalFunctionsObject.changeObjectProperyValue', function () {

        var obj = {
            $angularBuiltIn: {a: ''},
            a: '',
            b: 'zz',
            sub: {
                a: '',
                b: 'aa'
            }
        };

        GlobalFunctionsObject.changeObjectProperyValue(obj, '', '-');
        expect(obj.$angularBuiltIn.a).toEqual('');
        expect(obj.a).toEqual('-');
        expect(obj.b).toEqual('zz');
        expect(obj.sub.a).toEqual('-');
        expect(obj.sub.b).toEqual('aa');
    });


    it('GlobalFunctionsObject.filterObject', function () {

        var arr = [
            {a: 1, b: 2, id: 10},
            {a: 3, b: 4, c: 5, id: 11}
        ];

        var result = GlobalFunctionsObject.filterObject(arr, ['b', 'c'], 'id');
        expect(arr[0].a).toBeDefined();
        expect(result[0].a).not.toBeDefined();
        expect(result[1].a).not.toBeDefined();
        expect(result[1].c).toBeDefined();
        expect(result[1].id).toEqual(11);
    });


    it('GlobalFunctionsObject.getSubObjectByProperty', function () {

        var obj = {
            a: '10',
            b: {a: 10, b: 20},
            c: {a: 30, b: 40},
            d: undefined
        };

        var result = GlobalFunctionsObject.getSubObjectByProperty(obj, 'b', 40);
        expect(result.a).toEqual(30);

        result = GlobalFunctionsObject.getSubObjectByProperty(obj, 'c', 10);
        expect(result).not.toBeDefined();
    });


    it('GlobalFunctionsObject.getMaxPropertyValueInObject', function () {

        var arr = [
            {a: 20},
            {b: 10},
            {a: 100},
            {a: '1000asd'},
            {}
        ];

        var result = GlobalFunctionsObject.getMaxPropertyValueInObject(arr, 'a', 20);
        expect(result).toEqual(100);
        result = GlobalFunctionsObject.getMaxPropertyValueInObject(arr, 'a', 101);
        expect(result).toEqual(101);
    });


    it('GlobalFunctionsObject.deepDiffMapper', function () {

        var DELETED = 'deleted', CREATED = 'created', UPDATED = 'updated', UNCHANGED = 'unchanged';
        var mapper = GlobalFunctionsObject.deepDiffMapper();

        var f = function () {
        };
        var obj1 = {
            a: 1,
            b: {c: 1, d: 2},
            c: 3,
            d: 4,
            e: [1, 2, 3],
            f: f
        };

        var obj2 = {
            b: {c: 2, d: 2, x: 10},
            c: 3,
            d: 5,
            f: f,
            e: [4, 2, 6]
        };

        var result = mapper.map(obj1, obj2);
        expect(result.a.type).toEqual(DELETED);
        expect(result.b.c.type).toEqual(UPDATED);
        expect(result.b.d.type).toEqual(UNCHANGED);
        expect(result.b.x.type).toEqual(CREATED);
        expect(result.d.data).toEqual(4);
        expect(result.e['0'].type).toEqual(UPDATED);
        expect(result.e['1'].type).toEqual(UNCHANGED);
    });

    //GlobalFunctionsString

    it('GlobalFunctionsString.addDotSyntaxNode', function () {

        var obj = {
            path: 'a'
        };

        GlobalFunctionsString.addDotSyntaxNode(obj, 'path', ['b', 'c']);
        expect(obj.path).toEqual('a.b.c');
        GlobalFunctionsString.addDotSyntaxNode(obj, 'path2', ['b', 'c']);
        expect(obj.path2).toEqual('b.c');
    });


    it('GlobalFunctionsString.htmlToPlaintext', function () {

        var html = "<div><h1>A HEADER</h1><p>Paragraph of text</p><ul><li>li1</li><li>li2</li></ul><ol><li>li3</li><li>li4</li></ol><small>Small text</small><div>Inner div</div><code>Some code</code><br></div>";
        var result = GlobalFunctionsString.htmlToPlaintext(html);
        var expectedText = "A HEADER" +
            "Paragraph of text" +
            "li1" +
            "li2" +
            "li3" +
            "li4Small text" +
            "Inner divSome code";
        result = result.replace(/\r?\n|\r/g, '');
        expect(result).toEqual(expectedText);
    });

    it('GlobalFunctionsString.replaceAt', function () {
        expect(GlobalFunctionsString.replaceAt('asd', 1, 'x')).toEqual('axd');
    });

    it('GlobalFunctionsString.constantFormat', function () {
        function runExpects(obj) {
            expect(obj.camelLower).toEqual('testName');
            expect(obj.camelUpper).toEqual('TestName');
            expect(obj.underUpper).toEqual('TEST_NAME');
            expect(obj.underLower).toEqual('test_name');
            expect(obj.dashUpper).toEqual('TEST-NAME');
            expect(obj.dashLower).toEqual('test-name');
        }

        var result = GlobalFunctionsString.constantFormat('testName');
        runExpects(result);
        result = GlobalFunctionsString.constantFormat('test_name');
        runExpects(result);
    });


    //GlobalFunctionsDialog

    it('GlobalFunctionsDialog.showConfirmDialog with default params', function () {
        TestHelper.expectHttpCall('GET', 'assets/messagedialog/templates/default.tpl.html', "<div></div>");
        var spy = spyOn($uibModal, 'open').and.callFake(function (data) {
            expect(data.templateUrl).toContain('default');
            expect(data.controller).toContain('ModalInstanceCtrl');
            return {
                result: 10
            };
        });
        GlobalFunctionsDialog.showConfirmDialog();
        expect(spy).toHaveBeenCalled();
    });

    it('GlobalFunctionsDialog.showConfirmDialog with not default params', function () {
        TestHelper.expectHttpCall('GET', 'assets/messagedialog/templates/test.tpl.html', "<div></div>");
        var spy = spyOn($uibModal, 'open').and.callFake(function (data) {
            expect(data.templateUrl).toContain('test');
            expect(data.controller).toContain('test');
            return {
                result: 10
            };
        });
        GlobalFunctionsDialog.showConfirmDialog({
            template: 'assets/messagedialog/templates/test.tpl.html',
            controller: 'testCtrl'
        });
        expect(spy).toHaveBeenCalled();
    });

});