var markus = require('./lib/markus'),
	Html = require('./lib/Html.js'),
	cheerio = require('cheerio');


var tags = ['node', 'block', 'image', 'note', 'code', 'url', 'title', 'column', 'template', 'paperscript', 'nop'];

tags.forEach(function(tag) {
	markus.register(require('./tags/' + tag));
});

module.exports = {
	markus: function(content, param) {
		if (!content)
			return '';

		// Because Markus is getting stuck on parsing the script tags,
		// use cheerio to take out the contents of the scripts and put
		// them back in after parsing is finished.
		content = content.replace(/<paperscript/g, '<script type="paperscript"');
		content = content.replace(/\/paperscript>/g, '/script>');
		var $ = cheerio.load(content);

		// Find all the script tags and save the source code
		// in an array, replacing it with 'temp'
		var scripts = $('script');
		var sources = [];
		scripts.each(function(index, script) {
			var cScript = cheerio(script);
			sources.push(cScript.html());
		});
		scripts.html('temp');

		// Render the content with markus
		content = markus.parse($.html()).render(param);

		// Put the script sources back again:
		$ = cheerio.load(content);
		var count = 0;
		scripts = $('script');
		for (var i = 0, l = scripts.length; i < l; i++) {
			var script = $(scripts[i]);
			var scriptHtml = script.toString().replace('temp', sources[count++]);
			script.replaceWith(scriptHtml);
		}
		return $.html();
	}
};