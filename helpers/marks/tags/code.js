module.exports = {
	code: {
		nesting: false,

		render: function(content, param, encode, before, after) {
			var code = content || this.values[0];
			if (!code) return;
			// Nesting things in <code> seems to cause conflicts with Helma's
			// encodeParagraphs that is somehow too smart about it, so use <pre>
			// for blocks of code and <tt> for inlined code.
			if ((before !== undefined || after !== undefined 
					// Handle nested tags differently, e.g. <b><code /></b>
					// will not have before / after but should not be rendered
					// as <pre>:
					|| this.parent.definition == 'root')
					&& (typeof before != 'string' || /[\n\r]$|^$/.test(before))
					&& (typeof after != 'string' || /^[\n\r]|^$/.test(after))) {
				// Pass on all attributes to the pre tag.
				var attributes = this.renderAttributes();
				return '<pre class="code"'
						+ (attributes ? ' ' + attributes + '>' : '>')
						+ code + '</pre>';
			} else {
				return '<tt>' + code + '</tt>';
			}
		}
	}
};