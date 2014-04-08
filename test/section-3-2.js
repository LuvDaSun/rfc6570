/* jshint node:true */
/* global describe */

var h = require('./h');

describe('Examples from 3.2. Expression Expansion', function () {
    var data = {
        "count": ["one", "two", "three"],
        "dom": ["example", "com"],
        "dub": "me/too",
        "hello": "Hello World!",
        "half": "50%",
        "var": "value",
        "who": "fred",
        "base": "http://example.com/home/",
        "path": "/foo/bar",
        "list": ["red", "green", "blue"],
        "keys": [{
            "semi": ";"
        }, {
            "dot": "."
        }, {
            "comma": ","
        }],
        "v": "6",
        "x": "1024",
        "y": "768",
        "empty": "",
        "empty_keys": [],
        "undef": null
    };

    describe('3.2.1. Variable Expansion', function () {
        h.addTest('{count}', 'one,two,three', data);
        h.addTest('{count*}', 'one,two,three', data);
        h.addTest('{/count}', '/one,two,three', data);
        h.addTest('{/count*}', '/one/two/three', data);
        h.addTest('{;count}', ';count=one,two,three', data);
        h.addTest('{;count*}', ';count=one;count=two;count=three', data);
        h.addTest('{?count}', '?count=one,two,three', data);
        h.addTest('{?count*}', '?count=one&count=two&count=three', data);
        h.addTest('{&count*}', '&count=one&count=two&count=three', data);
    });

    describe('3.2.2. Simple String Expansion: {var}', function () {
        h.addTest('{var}', 'value', data, true);
        h.addTest('{hello}', 'Hello%20World%21', data, true);
        h.addTest('{half}', '50%25', data, true);
        h.addTest('O{empty}X', 'OX', data, true);
        h.addTest('O{undef}X', 'OX', data);
        h.addTest('{x,y}', '1024,768', data, true);
        h.addTest('{x,hello,y}', '1024,Hello%20World%21,768', data, true);
        h.addTest('?{x,empty}', '?1024,', data, true);
        h.addTest('?{x,undef}', '?1024', data);
        h.addTest('?{undef,y}', '?768', data);
        h.addTest('{var:3}', 'val', data);
        h.addTest('{var:30}', 'value', data);
        h.addTest('{list}', 'red,green,blue', data);
        h.addTest('{list*}', 'red,green,blue', data);
        h.addTest('{keys}', 'semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{keys*}', 'semi=%3B,dot=.,comma=%2C', data);
    });

    describe('3.2.3. Reserved Expansion: {+var}', function () {
        h.addTest('{+var}', 'value', data, true);
        h.addTest('{+hello}', 'Hello%20World!', data, true);
        h.addTest('{+half}', '50%25', data, true);
        h.addTest('{base}index', 'http%3A%2F%2Fexample.com%2Fhome%2Findex', data, true);
        h.addTest('{+base}index', 'http://example.com/home/index', data, true);
        h.addTest('O{+empty}X', 'OX', data, true);
        h.addTest('O{+undef}X', 'OX', data);
        h.addTest('{+path}/here', '/foo/bar/here', data, true);
        h.addTest('here?ref={+path}', 'here?ref=/foo/bar', data, true);
        h.addTest('up{+path}{var}/here', 'up/foo/barvalue/here', data);
        h.addTest('{+x,hello,y}', '1024,Hello%20World!,768', data, true);
        h.addTest('{+path,x}/here', '/foo/bar,1024/here', data, true);
        h.addTest('{+path:6}/here', '/foo/b/here', data);
        h.addTest('{+list}', 'red,green,blue', data);
        h.addTest('{+list*}', 'red,green,blue', data);
        h.addTest('{+keys}', 'semi,;,dot,.,comma,,', data);
        h.addTest('{+keys*}', 'semi=;,dot=.,comma=,', data);
    });

    describe('3.2.4. Fragment Expansion: {#var}', function () {
        h.addTest('{#var}', '#value', data, true);
        h.addTest('{#hello}', '#Hello%20World!', data, true);
        h.addTest('{#half}', '#50%25', data, true);
        h.addTest('foo{#empty}', 'foo#', data, true);
        h.addTest('foo{#undef}', 'foo', data);
        h.addTest('{#x,hello,y}', '#1024,Hello%20World!,768', data, true);
        h.addTest('{#path,x}/here', '#/foo/bar,1024/here', data, true);
        h.addTest('{#path:6}/here', '#/foo/b/here', data);
        h.addTest('{#list}', '#red,green,blue', data);
        h.addTest('{#list*}', '#red,green,blue', data);
        h.addTest('{#keys}', '#semi,;,dot,.,comma,,', data);
        h.addTest('{#keys*}', '#semi=;,dot=.,comma=,', data);
    });

    describe('3.2.5. Label Expansion with Dot-Prefix: {.var}', function () {
        h.addTest('{.who}', '.fred', data, true);
        h.addTest('{.who,who}', '.fred.fred', data, true);
        h.addTest('{.half,who}', '.50%25.fred', data, true);
        h.addTest('www{.dom*}', 'www.example.com', data);
        h.addTest('X{.var}', 'X.value', data, true);
        h.addTest('X{.empty}', 'X.', data, true);
        h.addTest('X{.undef}', 'X', data);
        h.addTest('X{.var:3}', 'X.val', data);
        h.addTest('X{.list}', 'X.red,green,blue', data);
        h.addTest('X{.list*}', 'X.red.green.blue', data);
        h.addTest('X{.keys}', 'X.semi,%3B,dot,.,comma,%2C', data);
        h.addTest('X{.keys*}', 'X.semi=%3B.dot=..comma=%2C', data);
        h.addTest('X{.empty_keys}', 'X', data);
        h.addTest('X{.empty_keys*}', 'X', data);
    });

    describe('3.2.6. Path Segment Expansion: {/var}', function () {
        h.addTest('{/who}', '/fred', data, true);
        h.addTest('{/who,who}', '/fred/fred', data, true);
        h.addTest('{/half,who}', '/50%25/fred', data, true);
        h.addTest('{/who,dub}', '/fred/me%2Ftoo', data, true);
        h.addTest('{/var}', '/value', data, true);
        h.addTest('{/var,empty}', '/value/', data, true);
        h.addTest('{/var,undef}', '/value', data);
        h.addTest('{/var,x}/here', '/value/1024/here', data, true);
        h.addTest('{/var:1,var}', '/v/value', data);
        h.addTest('{/list}', '/red,green,blue', data);
        h.addTest('{/list*}', '/red/green/blue', data);
        h.addTest('{/list*,path:4}', '/red/green/blue/%2Ffoo', data);
        h.addTest('{/keys}', '/semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{/keys*}', '/semi=%3B/dot=./comma=%2C', data);
    });

    describe('3.2.7. Path-Style Parameter Expansion: {;var}', function () {
        h.addTest('{;who}', ';who=fred', data, true);
        h.addTest('{;half}', ';half=50%25', data, true);
        h.addTest('{;empty}', ';empty', data, true);
        h.addTest('{;v,empty,who}', ';v=6;empty;who=fred', data, true);
        h.addTest('{;v,bar,who}', ';v=6;who=fred', data);
        h.addTest('{;x,y}', ';x=1024;y=768', data, true);
        h.addTest('{;x,y,empty}', ';x=1024;y=768;empty', data, true);
        h.addTest('{;x,y,undef}', ';x=1024;y=768', data);
        h.addTest('{;hello:5}', ';hello=Hello', data);
        h.addTest('{;list}', ';list=red,green,blue', data);
        h.addTest('{;list*}', ';list=red;list=green;list=blue', data);
        h.addTest('{;keys}', ';keys=semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{;keys*}', ';semi=%3B;dot=.;comma=%2C', data);
    });

    describe('3.2.8. Form-Style Query Expansion: {?var}', function () {
        h.addTest('{?who}', '?who=fred', data, true);
        h.addTest('{?half}', '?half=50%25', data, true);
        h.addTest('{?x,y}', '?x=1024&y=768', data, true);
        h.addTest('{?x,y,empty}', '?x=1024&y=768&empty=', data, true);
        h.addTest('{?x,y,undef}', '?x=1024&y=768', data);
        h.addTest('{?var:3}', '?var=val', data);
        h.addTest('{?list}', '?list=red,green,blue', data);
        h.addTest('{?list*}', '?list=red&list=green&list=blue', data);
        h.addTest('{?keys}', '?keys=semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{?keys*}', '?semi=%3B&dot=.&comma=%2C', data);
    });

    describe('3.2.9. Form-Style Query Continuation: {&var}', function () {
        h.addTest('{&who}', '&who=fred', data, true);
        h.addTest('{&half}', '&half=50%25', data, true);
        h.addTest('?fixed=yes{&x}', '?fixed=yes&x=1024', data, true);
        h.addTest('{&x,y,empty}', '&x=1024&y=768&empty=', data, true);
        h.addTest('{&x,y,undef}', '&x=1024&y=768', data);
        h.addTest('{&var:3}', '&var=val', data);
        h.addTest('{&list}', '&list=red,green,blue', data);
        h.addTest('{&list*}', '&list=red&list=green&list=blue', data);
        h.addTest('{&keys}', '&keys=semi,%3B,dot,.,comma,%2C', data);
        h.addTest('{&keys*}', '&semi=%3B&dot=.&comma=%2C', data);
    });

});