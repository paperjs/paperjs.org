module.exports = {
	lists: function(input) {
		// Converts dashed lists to real one with the class "list" applied.
		if (!input)
			return input;
		// Lists
		// -–—• = \x2d\u2013\u2014\u2022
		var hasLists = false;
		var str = input.replace(
			/^(\n*)(?:\s*)[\x2d\u2013\u2014\u2022](?:\s*)(.*)$/gm,
			function(all, pre, line) {
				hasLists = true;
				return pre + '<li>' + line.trim() + '</li>';
			}
		);
		if (hasLists) {
			str = str.replace(/(?:<li>(?:.*?)<\/li>\s*)+/gm, function(all) {
				var end = all.match(/<\/li>(.*)$/m)[1];
				return '<ul class="list">' + all.substring(0,
						all.length - end.length) + '</ul>\n' + end;
			});
		}
		return str;
	}
};