/* jshint node:true */
/* global describe */

var h = require('./h');

describe('Examples from 2.4. Value Modifiers', function () {

    describe('2.4.1. Prefix Values', function () {
        var data = {
            "var": "value",
            "semi": ";"
        };

        h.addTest('{var}', 'value', data, true);
        h.addTest('{var:20}', 'value', data);
        h.addTest('{var:3}', 'val', data);
        h.addTest('{semi}', '%3B', data, true);
        h.addTest('{semi:2}', '%3B', data);

    });

    describe('2.4.2. Composite Values', function () {
        var data = {
            "year": ["1965", "2000", "2012"],
            "dom": ["example", "com"]
        };

        h.addTest('find{?year*}', 'find?year=1965&year=2000&year=2012', data);
        h.addTest('www{.dom*}', 'www.example.com', data);

    });

});