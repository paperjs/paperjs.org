var path = require('path'),
	fs = require('fs'),
	he = require('he'),
	marks = require('marks');

// Register all tags contained in tags folder:
fs.readdirSync(path.join(__dirname, 'tags'))
	.filter(function(file) {
		return !(/^\./).test(file);
	})
	.forEach(function(file) {
		marks.register(require('./tags/' + file));
	});

module.exports = {
	marks: function(content, param) {
		if (!content) return '';
		if (!param) param = {};
		param.encode = he.encode;
		return marks.parse(content).render(param);
	}
};