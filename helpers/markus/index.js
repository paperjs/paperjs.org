var path = require('path'),
	fs = require('fs'),
	ent = require('ent');

var markus = require('./lib/markus');

markus.encode({
    entities: ent.encode
});

// Register all tags contained in tags folder:
fs.readdirSync(path.join(__dirname, 'tags'))
	.filter(function(file) {
		return !(/^\./).test(file);
	})
	.forEach(function(file) {
		markus.register(require('./tags/' + file));
	});

module.exports = {
	markus: function(content, param) {
		if (!content) return '';
		if (!param) param = {};
		param.encoding = 'entities';
		return markus.parse(content).render(param);
	}
};