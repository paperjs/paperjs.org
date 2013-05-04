var stringUtil = require('../lib/string.js');

module.exports = {
	title: function(content, param, encoder, before, after) {
		var title = this.attributes['short'] || content;
		var anchor =  stringUtil.urlize(title);

		if (!param.titles)
			param.titles = [];
		param.titles.push({
			title: title,
			anchor: anchor,
			isFirst: !before
		});
		// Wrap anchor in a <div> so it does not get placed inside a <p>
		var html = '<div id="' + anchor + '" class="section"><a name="' + anchor
				+ '" class="anchor"></a></div>';
		html += !before
			? '<h1>' + content + '</h1>'
			: '<h2>' + content + '</h2>';
		return html;
	}
};