var expect = require('expect.js');
var type = require('@jsmini/type').type;
var isEqual = require('../dist/index.js').isEqual;
var isEqualJSON = require('../dist/index.js').isEqualJSON;

// item.r is return for isEqual
// item.rj is for isEqualJSON
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
    { a: +0, b: -0, r: false, rj: true },
    { a: /^jsmini$/, b: /^jsmini$/, r: true },
    { a: /^jsmini$/g, b: /^jsmini$/, r: false, rj: true },
    { a: /^jsmini$/, b: /^jsmini/, r: false, rj: true },
];

var pkgList = [
    { a: new Boolean(true), b: new Boolean(true), r: true },
    { a: new Boolean(true), b: new Boolean(false), r: false },
    { a: new Number(1), b: new Number(1), r: true },
    { a: new Number(1), b: new Number(2), r: false },
    { a: new String('1'), b: new String('1'), r: true },
    { a: new String('1'), b: new String('2'), r: false },
    { a: new RegExp('^jsmini$'), b: new RegExp('^jsmini$'), r: true },
    { a: new RegExp('^jsmini$', 'g'), b: new RegExp('^jsmini'), r: false, rj: true },
    { a: new RegExp('^jsmini$'), b: new RegExp('^jsmini'), r: false, rj: true },
    { a: new Date(), b: new Date(), r: true },
];


if (typeof Set === 'function') {
    var setList = [
        { a: new Set([1, 2]), b: new Set([1, 2]), r: true },
        { a: new Set([1, 2]), b: new Set([1, 3]), r: false, rj: true },
    ];
}

if (typeof Map === 'function') {
    var mapList = [
        { a: new Map([['a', '1'], ['b', '2']]), b: new Map([['a', '1'], ['b', '2']]), r: true },
        { a: new Map([['a', '1'], ['b', '2']]), b: new Map([['a', '1'], ['b', '3']]), r: false, rj: true },
    ];
}


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

            if (typeof Set === 'function') {
                setList.forEach(function (item) {
                    expect(isEqual(item.a, item.b)).to.equal(item.r);
                })
            }

            if (typeof Map === 'function') {
                mapList.forEach(function (item) {
                    expect(isEqual(item.a, item.b)).to.equal(item.r);
                })
            }
        });

        it('middleware', function() {
            var a = function a() { console.log() }
            var b = function a() { console.log() }

            var middleware = function (next) {
                return (v, o) => {
                    if (typeof o === 'function' && typeof v === 'function') {
                        return o.toString() === v.toString();
                    }

                    return next(v, o, next);
                }
            }

            expect(isEqual(a, b)).to.equal(false);
            expect(isEqual(a, b, middleware)).to.equal(true);
        })

        it('multi middleware', function() {
            var a = new Set('1')
            var b = ['1', '2'];

            var middleware1 = function (next) {
                return (v, o) => {
                    if (type(v) === 'set') {
                        var newV = Array.from(v);
                        return next(newV, o, next);
                    }

                    return next(v, o, next);
                }
            }

            var middleware2 = function (next) {
                return (v, o) => {
                    if (type(o) === 'array') {
                        var newO = o.slice(0, 1);
                        return next(v, newO, next);
                    }

                    return next(v, o, next);
                }
            }

            expect(isEqual(a, b)).to.equal(false);
            expect(isEqual(a, b, [middleware1, middleware2])).to.equal(true);
        })
    });

    describe('isEqualJSON', function() {
        it('normal', function() {
            basicList.forEach(function (item) {
                expect(isEqualJSON(item.a, item.b)).to.equal(item.rj || item.r);
            })

            pkgList.forEach(function (item) {
                expect(isEqualJSON(item.a, item.b)).to.equal(item.rj || item.r);
            })

            complexList.forEach(function (item) {
                expect(isEqualJSON(item.a, item.b)).to.equal(item.rj || item.r);
            })

            if (typeof Set === 'function') {
                setList.forEach(function (item) {
                    expect(isEqualJSON(item.a, item.b)).to.equal(item.rj || item.r);
                })
            }

            if (typeof Map === 'function') {
                mapList.forEach(function (item) {
                    expect(isEqualJSON(item.a, item.b)).to.equal(item.rj || item.r);
                })
            }
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
