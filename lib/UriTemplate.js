module.exports = UriTemplate;

function UriTemplate(template){
	var re = /\{([\+#]?)([\$_a-z][\$_a-z0-9]*)\}/gi;
	var match;
	var parts = [];
	var seperators = [];
	var offset = 0;
	var partCount = 0;

	while(match = re.exec(template)){
		switch(match[1]) {
			case '#':
			seperators.push(template.substring(offset, match.index) + match[1]);
			break;

			default:
			seperators.push(template.substring(offset, match.index));
		}
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
			switch(part[1]) {
				case '+':
				data[part[2]] = decodeURIComponent(str.substring(offsets[partIndex], offsets[partIndex + 1] - 1));
				break;
				
				default:
				data[part[2]] = unescape(str.substring(offsets[partIndex], offsets[partIndex + 1] - 1));
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

			switch(part[1]) {
				case '+':
				str += encodeURI(data[part[2]]);
				str += seperators[partIndex + 1];
				break;

				case '#':
				str += encodeURI(data[part[2]]);
				str += seperators[partIndex + 1];
				break;
				
				default:
				str += escape(data[part[2]]);
				str += seperators[partIndex + 1];
			}

			return true;
		})) return false;

		return str;
	}//stringify

}//UriTemplate


