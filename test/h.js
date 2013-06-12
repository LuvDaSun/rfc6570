var assert = require('assert');
var UriTemplate = require('../lib/UriTemplate');

module.exports.addTest = function (template, str, data) {
	var uriTemplate = new UriTemplate(template);

	it("stringify '" + template + "' to '" + str + "'", function(){
		assert.equal(uriTemplate.stringify(data), str);

	});

	xit("parse '" + str + "' from '" + template + "'", function(){
		deepContain(uriTemplate.parse(str), data);
	});

}//addTest


function deepContain(actual, expected) {

	if(typeof actual === 'object' && typeof expected === 'object') {
		Object
		.keys(actual)
		.forEach(function(key){
			assert.ok(key in expected);
			deepContain(actual[key], expected[key]);
		});
	}
	else {
		assert.equal(actual, expected);
	}

}//deepContain