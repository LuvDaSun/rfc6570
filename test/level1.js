/* jshint node:true */
/* global describe */

var h = require('./h');

describe('Level 1', function () {
    var data = {
        "var": "value",
        "hello": "Hello World!",
        "undef": undefined
    };

    describe('Simple string expansion', function () {

        h.addTest('{var}', 'value', data, true);
        h.addTest('{hello}', 'Hello%20World%21', data, true);
        h.addTest('{undef}', '', data, true);
        h.addTest('x{undef}', 'x', data, true);
        h.addTest('x{undef}y', 'xy', data, true);
        h.addTest('{undef}y', 'y', data, true);

        h.addTest('{var}-{hello}', 'value-Hello%20World%21', data, true);

    });

});