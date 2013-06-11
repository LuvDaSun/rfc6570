var assert = require('assert');
var UriTemplate = require('../lib/UriTemplate');

describe('Level 1', function(){
	
	describe('Simple string expansion', function(){
		var uriTemplate = new UriTemplate('/{one}/{two}/');

		it('stringify', function(){
			assert.deepEqual(uriTemplate.stringify({
				one: 'aap'
				, two: 'noot'
			}), '/aap/noot/')

		});

		it('parse', function(){

			assert.deepEqual(uriTemplate.parse('/aap/noot/'), {
				one: 'aap'
				, two: 'noot'
			});

		});


	});


});

