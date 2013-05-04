module.exports = {
	template: function(content, param) {
		return param.page.template(this.attributes.name, param);
	}
};