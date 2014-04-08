/* jshint node:true */
/* global describe */

var h = require('./h');

describe('Level 4', function () {
    var data = {
        "var": "value",
        "hello": "Hello World!",
        "path": "/foo/bar",
        "list": ["red", "green", "blue"],
        "keys": {
            "semi": ";",
            "dot": ".",
            "comma": ","
        }
    };

    describe('String expansion with value modifiers', function () {

        h.addTest('{var:3}', 'val', data);
        h.addTest('{var:30}', 'value', data);
        h.addTest('{list}', 'red,green,blue', data);
        h.addTest('{list*}', 'red,green,blue', data);
        h.addTest('{keys}', 'semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{keys*}', 'semi=%3B,dot=.,comma=%2C', data);

    });

    describe('Reserved expansion with value modifiers', function () {

        h.addTest('{+path:6}/here', '/foo/b/here', data);
        h.addTest('{+list}', 'red,green,blue', data);
        h.addTest('{+list*}', 'red,green,blue', data);
        h.addTest('{+keys}', 'semi,;,dot,.,comma,,', data);
        h.addTest('{+keys*}', 'semi=;,dot=.,comma=,', data);

    });

    describe('Fragment expansion with value modifiers', function () {

        h.addTest('{#path:6}/here', '#/foo/b/here', data);
        h.addTest('{#list}', '#red,green,blue', data);
        h.addTest('{#list*}', '#red,green,blue', data);
        h.addTest('{#keys}', '#semi,;,dot,.,comma,,', data);
        h.addTest('{#keys*}', '#semi=;,dot=.,comma=,', data);

    });

    describe('Label expansion, dot-prefixed', function () {

        h.addTest('X{.var:3}', 'X.val', data);
        h.addTest('X{.list}', 'X.red,green,blue', data);
        h.addTest('X{.list*}', 'X.red.green.blue', data);
        h.addTest('X{.keys}', 'X.semi,%3B,dot,.,comma,%2C', data);
        h.addTest('X{.keys*}', 'X.semi=%3B.dot=..comma=%2C', data);

    });

    describe('Path segments, slash-prefixed', function () {

        h.addTest('{/var:1,var}', '/v/value', data);
        h.addTest('{/list}', '/red,green,blue', data);
        h.addTest('{/list*}', '/red/green/blue', data);
        h.addTest('{/list*,path:4}', '/red/green/blue/%2Ffoo', data);
        h.addTest('{/keys}', '/semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{/keys*}', '/semi=%3B/dot=./comma=%2C', data);

    });

    describe('Path-style parameters, semicolon-prefixed', function () {

        h.addTest('{;hello:5}', ';hello=Hello', data);
        h.addTest('{;list}', ';list=red,green,blue', data);
        h.addTest('{;list*}', ';list=red;list=green;list=blue', data);
        h.addTest('{;keys}', ';keys=semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{;keys*}', ';semi=%3B;dot=.;comma=%2C', data);

    });

    describe('Form-style query, ampersand-separated', function () {

        h.addTest('{?var:3}', '?var=val', data);
        h.addTest('{?list}', '?list=red,green,blue', data);
        h.addTest('{?list*}', '?list=red&list=green&list=blue', data);
        h.addTest('{?keys}', '?keys=semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{?keys*}', '?semi=%3B&dot=.&comma=%2C', data);

    });

    describe('Form-style query continuation', function () {

        h.addTest('{&var:3}', '&var=val', data);
        h.addTest('{&list}', '&list=red,green,blue', data);
        h.addTest('{&list*}', '&list=red&list=green&list=blue', data);
        h.addTest('{&keys}', '&keys=semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{&keys*}', '&semi=%3B&dot=.&comma=%2C', data);

    });

});