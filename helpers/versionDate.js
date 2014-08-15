var sh = require('execSync');

module.exports = {
	versionDate: function(version, file) {
		if (/^v/.test(version)) {
			return new Date(sh.exec('cd paper.js\n\
				git log -1 --format=%ai ' + version).stdout);
		} else {
			return file.created;
		}
	}
};
