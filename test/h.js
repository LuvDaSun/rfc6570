/* jshint node:true */
/* global it */

var assert = require('assert');
var UriTemplate = require('../src/UriTemplate');

module.exports.addTest = function (template, str, data, testParse) {
    var uriTemplate = new UriTemplate(template);

    it("stringify '" + template + "' to '" + str + "'", function () {
        assert.equal(uriTemplate.stringify(data), str);
    });

    testParse && it("parse '" + str + "' from '" + template + "'", function () {
        var actual = uriTemplate.parse(str);
        deepContain(actual, data);
        assert.equal(uriTemplate.stringify(actual), str);
    });

}; //addTest


function deepContain(actual, expected) {

    if (typeof actual === 'object' && typeof expected === 'object') {
        Object
            .keys(actual)
            .forEach(function (key) {
                assert.ok(key in expected);
                deepContain(actual[key], expected[key]);
            });
    } else {
        assert.equal(actual, expected);
    }

} //deepContain