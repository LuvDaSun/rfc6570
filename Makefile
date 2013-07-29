rfc6570.js: lib/*.js *.js
	node_modules/.bin/browserify --entry=index.js --standalone=rfc6570 > $@


