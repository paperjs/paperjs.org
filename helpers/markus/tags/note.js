var Html = require('../lib/Html')
var defaultTitles = {
	note: 'Please note:',
	warning: 'Warning:',
	tip: 'Did you know?'
};
var tags = {};
var parser = function(content, param, encoder) {
	var title = this.attributes.title || defaultTitles[this.name];
	return '<div class="note"><b>' + encoder(title) + '</b>' + Html.formatParagraphs(content) + '<div class="text-end"></div></div>';
};
for (var key in defaultTitles) {
	tags[key] = parser;
}

module.exports = tags;