var urlize = require('../lib/string.js').urlize;
var renderLink = require('../lib/renderLink');

var renderPageLink = function(param) {
	if (!param || typeof param == 'string')
		param = { content: param };
	// Default content = encoded display name
	if (!param.content && !param.text) {
		param.content = param.node.title;
		// Do not render items with no display name, such as root.downloads
		if (!param.content)
			return null;
	}
	// Make sure popup has a name to be used for th window.
	if (param.popup && !param.popup.name)
		param.popup.name = urlize(param.node.title);
	return renderLink(param);
};

module.exports = {
	node: function(content, param, encode) {
		var root = param.page.site.root;
		var href = this.values[0];
		if (!href) {
			href = content;
			content = null;
		}
		var node = root.get(href);
		if (!node) {
			console.log('Node not found: ', href);
			return (content || '') + encode(' [missing: ' + href + ']');
		}
		var linkParam = { content: content || node.title, href: node.url };
		for (var i in this.attributes) {
			if (i != 'href')
				linkParam[i] = this.attributes[i];				
		}
		return renderPageLink(linkParam, this.attributes);
	}
};
