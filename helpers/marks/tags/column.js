module.exports = {
	column: function(content, param, encode) {
		if (this.previous && this.previous.name == 'column') {
			this.index = this.previous.index + 1;
			if (this.index >= 2)
				this.index = 0;
		} else {
			this.index = 0;
		}
		return (this.index == 0 ? '<div class="row">' : '')
		 		+ '<div class="column">' + content + '</div>'
				+ (this.index == 1 ? '</div>' : '');
	}
};