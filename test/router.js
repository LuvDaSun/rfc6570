/* jshint node:true */
/* global describe, it */

var assert = require('assert');
var h = require('./h');
var Router = require('../src/Router');

describe('Router', function () {
    var router = new Router();
    var lastRouteData;

    function setLastRouteData(routeData) {
        lastRouteData = routeData;
    } //setLastRouteData

    router.add('/a/b/{c}/{d}', setLastRouteData);
    router.add('/a/b/{c}', setLastRouteData);
    router.add('/a/b{?c,d}', setLastRouteData);

    it('test 1', function () {
        router.handle('/a/b/1');
        assert.deepEqual(lastRouteData, {
            c: '1'
        });
    });

    it('test 2', function () {
        router.handle('/a/b/2/3');
        assert.deepEqual(lastRouteData, {
            c: '2',
            d: '3'
        });
    });

    it('test 3', function () {
        router.handle('/a/b?c=4&d=5');
        assert.deepEqual(lastRouteData, {
            c: '4',
            d: '5'
        });
    });

});