/* jshint node:true */
/* global describe */

var h = require('./h');

describe('Level 2', function () {
    var data = {
        "var": "value",
        "hello": "Hello World!",
        "path": "/foo/bar",
        "undef": undefined
    };

    describe('Reserved string expansion', function () {

        h.addTest('{+var}', 'value', data, true);
        h.addTest('{+hello}', 'Hello%20World!', data, true);
        h.addTest('{+path}/here', '/foo/bar/here', data, true);
        h.addTest('here?ref={+path}', 'here?ref=/foo/bar', data, true);
        h.addTest('{+undef}', '', data, true);
        h.addTest('x{+undef}', 'x', data, true);
        h.addTest('x{+undef}y', 'xy', data, true);
        h.addTest('{+undef}y', 'y', data, true);

    });

    describe('Fragment expansion, crosshatch-prefixed', function () {

        h.addTest('X{#var}', 'X#value', data, true);
        h.addTest('X{#hello}', 'X#Hello%20World!', data, true);
        h.addTest('{#undef}', '', data, true);
        h.addTest('x{#undef}', 'x', data, true);
        h.addTest('x{#undef}y', 'xy', data, true);
        h.addTest('{#undef}y', 'y', data, true);

    });

});