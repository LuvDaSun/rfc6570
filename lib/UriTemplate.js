module.exports = UriTemplate;


var operatorOptions = {
	"": {
		"prefix": ""
		, "seperator": ","
		, "assignment": false
		, "assignEmpty": false
		, "encode": percentEncode
	}
	, "+": {
		"prefix": ""
		, "seperator": ","
		, "assignment": false
		, "assignEmpty": false
		, "encode": encodeURI
	}
	, "#": {
		"prefix": "#"
		, "seperator": ","
		, "assignment": false
		, "assignEmpty": false
		, "encode": encodeURI
	}
	, ".": {
		"prefix": "."
		, "seperator": "."
		, "assignment": false
		, "assignEmpty": false
		, "encode": percentEncode
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
		, "assignEmpty": false
		, "encode": encodeURIComponent
	}
	, "?": {
		"prefix": "?"
		, "seperator": "&"
		, "assignment": true
		, "assignEmpty": true
		, "encode": encodeURIComponent
	}
	, "&": {
		"prefix": "&"
		, "seperator": "&"
		, "assignment": true
		, "assignEmpty": true
		, "encode": encodeURIComponent
	}
};//operatorOptions

function percentEncode(value){
	/*
	http://tools.ietf.org/html/rfc3986#section-2.3
	*/
	var unreserved = "-._~";

	if(isUndefined(value)) return '';

	value = value.toString();

	return Array.prototype.map.call(value, function(ch) {
		var charCode = ch.charCodeAt(0);

		if(charCode >= 0x30 && charCode <= 0x39) return ch
		if(charCode >= 0x41 && charCode <= 0x5a) return ch
		if(charCode >= 0x61 && charCode <= 0x7a) return ch

		if(~unreserved.indexOf(ch)) return ch;

		return '%' + charCode.toString(16).toUpperCase();
	}).join('');

}//percentEncode

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
		var offset = 0;
		var offsets = [];

		if(!glues.every(function (glue, glueIndex) {
			var index = str.indexOf(glue, offset);
			offset = index + glue.length;
			if(!glue && glueIndex === glue.length - 1){
				offset = str.length + 1;
			}
			offsets.push(offset);
			return ~index;
		})) return false;

		if(!pieces.every(function (piece, pieceIndex) {
			var options = operatorOptions[piece.operator];

			var offsetBegin = offsets[pieceIndex];
			var offsetEnd = offsets[pieceIndex + 1];
			if(offsetBegin === offsetEnd) offsetEnd = str.length;
			else offsetEnd = offsetEnd - 1;

			var value = str.substring(offsetBegin, offsetEnd);
			value = decodeURIComponent(value);
			value = value.split(options.seperator);
			if(value.length != piece.variables.length) return false;

			value.forEach(function(value, valueIndex){
				var variable = piece.variables[valueIndex];
				var name = variable.name;
				data[name] = decodeURIComponent(value);
			})

			return true;

		})) return false;

		return data;
	}//parse

	this.stringify = function (data){
		var str = '';
		
		str += glues[0];
		if(!pieces.every(function (piece, pieceIndex) {

			var options = operatorOptions[piece.operator];
			var parts;

			parts = piece.variables.map(function(variable){
				var value = data[variable.name];

				if(!Array.isArray(value)) value = [value];

				value = value.filter(isDefined);

				if(isUndefined(value)) return null;

				if(variable.composite){
					value = value.map(function(value){
					
						if(typeof value === 'object') {
							
							value = Object.keys(value).map(function(key){
								var keyValue = value[key];
								if(variable.maxLength) keyValue = keyValue.substring(0, variable.maxLength);
								
								keyValue = options.encode(keyValue);

								if(keyValue) keyValue = key + '=' + keyValue;
								else {
									keyValue = key;
									if(options.assignEmpty) {
										keyValue += '=';
									}
								}

								return keyValue;
							}).join(options.seperator)

						}
						else {
							if(variable.maxLength) value = value.substring(0, variable.maxLength);
							
							value = options.encode(value);

							if(options.assignment) {
								if(value) value = variable.name + '=' + value;
								else {
									value = variable.name;
									if(options.assignEmpty) {
										value += '=';
									}
								}
							}
						}

						return value;
					});
					
					value = value.join(options.seperator);
				}
				else {
					value = value.map(function(value){
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

					})
					value = value.join(',');
					
					if(options.assignment) {
						if(value) value = variable.name + '=' + value;
						else {
							value = variable.name;
							if(options.assignEmpty) {
								value += '=';
							}
						}
					}

				}					

				return value;
			});

			parts = parts.filter(isDefined);
			if(isDefined(parts)) {
				str += options.prefix;
				str += parts.join(options.seperator);
			}

			str += glues[pieceIndex + 1];
			return true;
		})) return false;

		return str;
	}//stringify

}//UriTemplate


