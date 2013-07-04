module.exports = UriTemplate;


var operatorOptions = {
	"": {
		"prefix": ""
		, "seperator": ","
		, "assignment": false
		, "encode": escape
	}
	, "+": {
		"prefix": ""
		, "seperator": ","
		, "assignment": false
		, "encode": encodeURI
	}
	, "#": {
		"prefix": "#"
		, "seperator": ","
		, "assignment": false
		, "encode": encodeURI
	}
	, ".": {
		"prefix": "."
		, "seperator": "."
		, "keyValue": false
		, "encode": escape
	}
	, "/": {
		"prefix": "/"
		, "seperator": "/"
		, "assignment": false
		, "encode": encodeURIComponent
	}
	, ";": {
		"prefix": ";"
		, "seperator": ";"
		, "assignment": true
		, "encode": encodeURIComponent
	}
	, "?": {
		"prefix": "?"
		, "seperator": "&"
		, "assignment": true
		, "encode": encodeURIComponent
	}
	, "&": {
		"prefix": "&"
		, "seperator": "&"
		, "assignment": true
		, "encode": encodeURIComponent
	}
};//operatorOptions


function isDefined(value){
	return !isUndefined(value);
}//isDefined
function isUndefined(value){
	/*
	http://tools.ietf.org/html/rfc6570#section-2.3
	*/
	if(value === null) return true;
	if(value === undefined) return true;
	if(Array.isArray(value)) {
		if(value.length === 0) return true;
	}

	return false;
}//isUndefined


function UriTemplate(template){
	/*
	http://tools.ietf.org/html/rfc6570#section-2.2

	expression    =  "{" [ operator ] variable-list "}"
	operator      =  op-level2 / op-level3 / op-reserve
	op-level2     =  "+" / "#"
	op-level3     =  "." / "/" / ";" / "?" / "&"
	op-reserve    =  "=" / "," / "!" / "@" / "|"
	*/
	var reTemplate = /\{([\+#\.\/;\?&=\,!@\|]?)([A-Za-z0-9_\,\.\:\*]+?)\}/g;
	var reVariable = /^([\$_a-z][\$_a-z0-9]*)((?:\:[1-9][0-9]?[0-9]?[0-9]?)?)(\*?)$/i;
	var match;
	var pieces = [];
	var glues = [];
	var offset = 0;
	var pieceCount = 0;

	while(match = reTemplate.exec(template)){
		glues.push(template.substring(offset, match.index));
		/*
		The operator characters equals ("="), comma (","), exclamation ("!"),
		at sign ("@"), and pipe ("|") are reserved for future extensions.
		*/
		if(match[1] && ~'=,!@|'.indexOf(match[1])){
			throw "operator '" + match[1] + "' is reserved for future extensions";
		}

		offset = match.index;
		pieces.push({
			operator: match[1]
			, variables: match[2].split(',').map(function(variable){
				var match = reVariable.exec(variable)
				return {
					name: match[1]
					, maxLength: match[2] && parseInt(match[2].substring(1), 10)
					, composite: !!match[3]
				};
			})
		});
		offset += match[0].length;
		pieceCount++;
	}
	glues.push(template.substring(offset));

	this.parse = function (str){
		var data = {};

		return data;
	}//parse

	this.stringify = function (data){
		var str = '';
		
		str += glues[0];
		if(!pieces.every(function (piece, pieceIndex) {

			var options = operatorOptions[piece.operator];

			str += options.prefix;
			str += piece.variables.map(function(variable){
				var value = data[variable.name];

				if(!Array.isArray(value)) value = [value];

				value = value.filter(isDefined);

				if(isUndefined(value)) return null;

				return (
					variable.composite
					
					? value.map(function(value){
					
						if(typeof value === 'object') {
							return Object.keys(value).map(function(key){
								var keyValue = value[key];
								if(variable.maxLength) keyValue = keyValue.substring(0, variable.maxLength);
								
								return key + '=' + options.encode(keyValue);
							}).join(',')
						}
						else {
							if(variable.maxLength) value = value.substring(0, variable.maxLength);
							
							return (options.assignment ? variable.name + '=' : '') + options.encode(value);
						}

					}).join(options.seperator)

					: (options.assignment ? variable.name + '=' : '') + value.map(function(value){
						if(typeof value === 'object') {
							return Object.keys(value).map(function(key){
								var keyValue = value[key];
								if(variable.maxLength) keyValue = keyValue.substring(0, variable.maxLength);
								return key + ',' + options.encode(keyValue);
							}).join(',')
						}
						else {
							if(variable.maxLength) value = value.substring(0, variable.maxLength);
							
							return options.encode(value);
						}

					}).join(',')
				);
			}).filter(isDefined).join(options.seperator);

			str += glues[pieceIndex + 1];
			return true;
		})) return false;

		return str;
	}//stringify

}//UriTemplate


