var he = require('he');

var utils = {
	urlize: function(string) {
		string = utils.unaccent(string).replace(/([^a-z0-9\.]+)/gi, '-');
		return utils.trim(string, '-').toLowerCase();
	},
	trim: function(string, exp) {
		exp = exp ? '[' + exp + ']' : '\\s';
		return string.replace(new RegExp('^' + exp + '+|' + exp + '+$', 'g'), '');
	},
	unaccent: function(string) {
		string = he.encode(string);
		// Convert to html entities, replace them by the normal unnaccented chars and convert back
		string = string.replace(/&(.)(?:uml);/gi, '$1e'); // replace ö with oe, ä with ae, etc.
		string = string.replace(/&(.)(?:acute|grave|cedil|circ|ring|tilde);/gi, '$1'); // replace é with e, à with a, etc.
		return he.decode(string);
	}
};

module.exports = utils;