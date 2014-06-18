/* jshint node:true */
/* global describe, it */

var assert = require('assert');
var UriTemplate = require('../src/UriTemplate');

describe('reserved operators', function () {
    /*
	The operator characters equals ("="), comma (","), exclamation ("!"),
	at sign ("@"), and pipe ("|") are reserved for future extensions.
	*/

    var reservedOperators = ["=", ",", "!", "@", "|"];
    reservedOperators.forEach(function (operator) {
        it('should throw an error when using ' + operator + ' as an operator', function () {
            assert.throws(function () {
                var uriTemplate = new UriTemplate('{' + operator + 'var}');
            }, Error);
        });
    });

});