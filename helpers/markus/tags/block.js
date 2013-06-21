module.exports = {
	block: function(content, param, encode) {
		// Filter out white space at beginning
		var start = /\s/.test(this.nodes[0]) ? 1 : 0;
		return param.page.template('resource_block', {
			resource: this.renderNode(this.nodes[start], param, encode),
			content: this.renderChildren(param, encode, start + 1)
		});
	}
};