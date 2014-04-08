/* jshint node:true */
/* global describe */

var h = require('./h');

describe('Level 3', function () {
    var data = {
        "var": "value",
        "hello": "Hello World!",
        "empty": "",
        "path": "/foo/bar",
        "x": "1024",
        "y": "768",
        "undef": undefined
    };

    describe('String expansion with multiple variables', function () {

        h.addTest('map?{x,y}', 'map?1024,768', data, true);
        h.addTest('{x,hello,y}', '1024,Hello%20World%21,768', data, true);
        h.addTest('v?{undef}', 'v?', data, true);
        h.addTest('v?{x,undef}', 'v?1024', data, true);

    });

    describe('Reserved expansion with multiple variables', function () {

        h.addTest('{+x,hello,y}', '1024,Hello%20World!,768', data, true);
        h.addTest('{+path,x}/here', '/foo/bar,1024/here', data, true);
        h.addTest('{+path,undef}/here', '/foo/bar/here', data, true);

    });

    describe('Fragment expansion with multiple variables', function () {

        h.addTest('{#x,hello,y}', '#1024,Hello%20World!,768', data, true);
        h.addTest('{#path,x}/here', '#/foo/bar,1024/here', data, true);
        h.addTest('{#path,undef}/here', '#/foo/bar/here', data, true);

    });

    describe('Label expansion, dot-prefixed', function () {

        h.addTest('X{.var}', 'X.value', data, true);
        h.addTest('X{.x,y}', 'X.1024.768', data, true);
        h.addTest('X{.x,undef}', 'X.1024', data, true);

    });

    describe('Path segments, slash-prefixed', function () {

        h.addTest('{/var}', '/value', data, true);
        h.addTest('{/var,x}/here', '/value/1024/here', data, true);
        h.addTest('{/var,undef}/here', '/value/here', data, true);

    });

    describe('Path-style parameters, semicolon-prefixed', function () {

        h.addTest('{;x,y}', ';x=1024;y=768', data, true);
        h.addTest('{;x,y,empty}', ';x=1024;y=768;empty', data, true);
        h.addTest('{;x,y,undef}', ';x=1024;y=768', data, true);

    });

    describe('Form-style query, ampersand-separated', function () {

        h.addTest('{?x,y}', '?x=1024&y=768', data, true);
        h.addTest('{?x,y,empty}', '?x=1024&y=768&empty=', data, true);
        h.addTest('{?x,y,undef}', '?x=1024&y=768', data, true);

    });

    describe('Form-style query continuation', function () {

        h.addTest('?fixed=yes{&x}', '?fixed=yes&x=1024', data, true);
        h.addTest('{&x,y,empty}', '&x=1024&y=768&empty=', data, true);
        h.addTest('{&x,y,undef}', '&x=1024&y=768', data, true);

    });

});