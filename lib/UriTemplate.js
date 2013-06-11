module.exports = UriTemplate;

function UriTemplate(template){
	var re = /\{([\$_a-z][\$_a-z0-9]*)\}/gi;
	var match;
	var parts = [];
	var seperators = [];
	var offset = 0;
	var partCount = 0;

	while(match = re.exec(template)){
		seperators.push(template.substring(offset, match.index));
		offset = match.index;
		parts.push(match);
		offset += match[0].length;
		partCount++;
	}
	seperators.push(template.substring(offset));

	this.parse = function (str){
		var data = {};
		var offset = 0;
		var offsets = [];

		if(!seperators.every(function (seperator) {
			var index = str.indexOf(seperator, offset);
			offset = index + seperator.length;
			offsets.push(offset);
			return ~index;
		})) return false;

		
		if(!parts.every(function (part, partIndex) {
			data[part[1]] = str.substring(offsets[partIndex], offsets[partIndex + 1] - 1);
			return true;
		})) return false;

		return data;
	}//parse

	this.stringify = function (data){
		var str = '';
		
		str += seperators[0];
		if(!parts.every(function (part, partIndex) {
			if(!part[1] in data) return false;
			str += data[part[1]];
			str += seperators[partIndex + 1];
			return true;
		})) return false;

		return str;
	}//stringify

}//UriTemplate


