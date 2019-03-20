var expect = require('expect.js');

var isEqual = require('../dist/index.js').isEqual;
var isEqualJSON = require('../dist/index.js').isEqualJSON;

var basicList = [
    { a: undefined, b: undefined, r: true },
    { a: null, b: null, r: true },
    { a: undefined, b: null, r: false },
    { a: 1, b: 1, r: true },
    { a: 1, b: 2, r: false },
    { a: 'aaa', b: 'aaa', r: true },
    { a: 'aaa', b: 'bbb', r: false },
    { a: true, b: true, r: true },
    { a: true, b: false, r: false },
];

var pkgList = [
    { a: new Boolean(true), b: new Boolean(true), r: true },
    { a: new Boolean(true), b: new Boolean(false), r: false },
    { a: new Number(1), b: new Number(1), r: true },
    { a: new Number(1), b: new Number(2), r: false },
    { a: new String('1'), b: new String('1'), r: true },
    { a: new String('1'), b: new String('2'), r: false },
];

var complexList = [
    { a: [1, 2, 3], b: [1, 2, 3], r: true },
    { a: [1, 2, 3], b: [1, 2, 1], r: false },
    { a: [1, [2, [3]]], b: [1, [2, [3]]], r: true },
    { a: {a: 1, b: 2}, b: {a: 1, b: 2}, r: true },
    { a: {a: 1, b: 2}, b: {a: 1, b: 1}, r: false },
    { a: {a: {b: {c: 1}}}, b: {a: {b: {c: 1}}}, r: true },
];

describe('单元测试', function() {
    this.timeout(1000);

    describe('isEqual', function() {
        it('normal', function() {
            basicList.forEach(function (item) {
                expect(isEqual(item.a, item.b)).to.equal(item.r);
            })

            pkgList.forEach(function (item) {
                expect(isEqual(item.a, item.b)).to.equal(item.r);
            })

            complexList.forEach(function (item) {
                expect(isEqual(item.a, item.b)).to.equal(item.r);
            })
        });

        it('compare', function() {
            var a = {
                a: function a() { console.log() }
            };
            var b = {
                a: function a() { console.log() }
            };

            expect(isEqual(a, b)).to.equal(false);
            expect(isEqual(a, b, function (o, v, next) {
                if (typeof o === 'function' && typeof v === 'function') {
                    return o.toString() === v.toString();
                }

                return next();
            })).to.equal(true);
        })
    });

    describe('isEqualJSON', function() {
        it('normal', function() {
            basicList.forEach(function (item) {
                expect(isEqualJSON(item.a, item.b)).to.equal(item.r);
            })

            pkgList.forEach(function (item) {
                expect(isEqualJSON(item.a, item.b)).to.equal(item.r);
            })

            complexList.forEach(function (item) {
                expect(isEqualJSON(item.a, item.b)).to.equal(item.r);
            })
        });

        it('replacer', function() {
            var a = {
                a: function a() { console.log() }
            };
            var b = {
                a: function b() { console.log() }
            };

            expect(isEqualJSON(a, b)).to.equal(true);
            expect(isEqualJSON(a, b, function (k, v) {
                if (typeof v === 'function') {
                    return v.toString();
                }

                return v;
            })).to.equal(false);
        })
    });
});
