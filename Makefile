rfc6570.js: index.js lib/*.js
	node_modules/.bin/browserify --entry=index.js --standalone=rfc6570 > $@


