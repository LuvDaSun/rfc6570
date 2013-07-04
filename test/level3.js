var h = require('./h');

describe('Level 3', function(){
	var data = {
		"var": "value"
		, "hello": "Hello World!"
		, "empty": ""
		, "path": "/foo/bar"
		, "x": "1024"
		, "y": "768"
	}
	
	describe('String expansion with multiple variables', function(){
		
		h.addTest('map?{x,y}', 'map?1024,768', data);
		h.addTest('{x,hello,y}', '1024,Hello%20World%21,768', data);

	});

	describe('Reserved expansion with multiple variables', function(){

		h.addTest('{+x,hello,y}', '1024,Hello%20World!,768', data);
		h.addTest('{+path,x}/here', '/foo/bar,1024/here', data);
		
	});

	describe('Fragment expansion with multiple variables', function(){

		h.addTest('{#x,hello,y}', '#1024,Hello%20World!,768', data);
		h.addTest('{#path,x}/here', '#/foo/bar,1024/here', data);
		
	});

	describe('Label expansion, dot-prefixed', function(){

		h.addTest('X{.var}', 'X.value', data);
		h.addTest('X{.x,y}', 'X.1024.768', data);
		
	});

	describe('Path segments, slash-prefixed', function(){

		h.addTest('{/var}', '/value', data);
		h.addTest('{/var,x}/here', '/value/1024/here', data);
		
	});

	describe('Path-style parameters, semicolon-prefixed', function(){

		h.addTest('{;x,y}', ';x=1024;y=768', data);
		h.addTest('{;x,y,empty}', ';x=1024;y=768;empty', data, true);
	
	});

	describe('Form-style query, ampersand-separated', function(){

		h.addTest('{?x,y}', '?x=1024&y=768', data);
		h.addTest('{?x,y,empty}', '?x=1024&y=768&empty=', data);
		
	});

	describe('Form-style query continuation', function(){

		h.addTest('?fixed=yes{&x}', '?fixed=yes&x=1024', data);
		h.addTest('{&x,y,empty}', '&x=1024&y=768&empty=', data);
		
	});

});



