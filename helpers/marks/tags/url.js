var Url = require('../lib/Url');
module.exports = {
	url: function(content, param) {
		var url = this.values[0] || content;
		var title = content || url;
		var str = '<a href="';
		// Allways write domain part of url for feed rendering
		var isRemote = Url.isRemote(url);
		// Make sure the non-local url has a protocol, http is default:
		if (isRemote)
			url = Url.addProtocol(url);
		str += url;
		// Links to remote pages need to open blank
		if (isRemote)
			str += '" target="_blank';
		str += '">' + title + '</a>';
		return str;
	}
};