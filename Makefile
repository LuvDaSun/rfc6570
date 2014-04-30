all: rfc6570.js

clean:
	rm rfc6570.js

rfc6570.js: src/main.js src/*.js
	node_modules/.bin/browserify --entry=$< --standalone=rfc6570 --outfile=$@
