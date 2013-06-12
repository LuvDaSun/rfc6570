module.exports = UriTemplate;

function UriTemplate(template){
	var re = /\{([\+#\.\/;\?&]?)([\$_a-z][\$_a-z0-9]*(?:\,[\$_a-z][\$_a-z0-9]*)*)\}/gi;
	var match;
	var parts = [];
	var seperators = [];
	var offset = 0;
	var partCount = 0;

	while(match = re.exec(template)){
		switch(match[1]) {
			case '#':
			case '.':
			case '/':
			case ';':
			case '?':
			case '&':
			seperators.push(template.substring(offset, match.index) + match[1]);
			break;

			default:
			seperators.push(template.substring(offset, match.index));
		}
		offset = match.index;
		parts.push({
			names: match[2].split(',')
			, prefix: match[1]
		});
		offset += match[0].length;
		partCount++;
	}
	seperators.push(template.substring(offset));

	this.parse = function (str){
		var data = {};
		var offset = 0;
		var offsets = [];


		if(!seperators.every(function (seperator, seperatorIndex) {
			var index = str.indexOf(seperator, offset);
			offset = index + seperator.length;
			if(!seperator && seperatorIndex === seperators.length - 1){
				offset = str.length + 1;
			}
			offsets.push(offset);
			return ~index;
		})) return false;


		if(!parts.every(function (part, partIndex) {
			switch(part[prefix]) {
				case '+':
				str
				.substring(offsets[partIndex], offsets[partIndex + 1] - 1)
				.split(',')
				.forEach(function(value, valueIndex){
					if(valueIndex >= part.names.length) return false;					
					var name = part.names[valueIndex];
					data[name] = decodeURIComponent(value);
				});
				break;
				
				default:
				str
				.substring(offsets[partIndex], offsets[partIndex + 1] - 1)
				.split(',')
				.forEach(function(value, valueIndex){
					if(valueIndex >= part.names.length) return false;					
					var name = part.names[valueIndex];
					data[name] = unescape(value);
				})
			}
			return true;

		})) return false;

		return data;
	}//parse

	this.stringify = function (data){
		var str = '';
		
		str += seperators[0];
		if(!parts.every(function (part, partIndex) {
			if(!part[2] in data) return false;

			switch(part.prefix) {
				case '+':
				str += part.names.map(function(name){
					return encodeURI(data[name]);
				}).join(',');
				str += seperators[partIndex + 1];
				break;

				case '#':
				str += part.names.map(function(name){
					return encodeURI(data[name]);
				}).join(',');
				str += seperators[partIndex + 1];
				break;
				
				case '.':
				str += part.names.map(function(name){
					return encodeURI(data[name]);
				}).join('.');
				str += seperators[partIndex + 1];
				break;

				case '/':
				str += part.names.map(function(name){
					return encodeURI(data[name]);
				}).join('/');
				str += seperators[partIndex + 1];
				break;

				case ';':
				str += part.names.map(function(name){
					if(data[name]) return name + '=' + encodeURI(data[name]);
					else return name;
				}).join(';');
				str += seperators[partIndex + 1];
				break;

				case '?':
				case '&':
				str += part.names.map(function(name){
					return name + '=' + encodeURI(data[name]);
				}).join('&');
				str += seperators[partIndex + 1];
				break;

				default:
				str += part.names.map(function(name){
					return escape(data[name]);
				}).join(',');
				str += seperators[partIndex + 1];
			}

			return true;
		})) return false;

		return str;
	}//stringify

}//UriTemplate


