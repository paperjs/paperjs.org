var paragraphs = require('paragraphs');

var defaultTitles = {
	note: 'Please note:',
	warning: 'Warning:',
	tip: 'Did you know?'
};

module.exports = {
	'note,warning,tip': {
		attribute: 'title',

		render: function(content, param, encode) {
			var title = this.attributes.title || defaultTitles[this.name];
			return '<div class="note"><h4>' + encode(title) + '</h4>'
					+ paragraphs(content)
					+ '<div class="text-end"></div></div>';
		}
	}
};
