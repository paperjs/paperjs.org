module.exports = {
	svg: {
		nesting: false,
		render: function(content) {
			return '<' + this.definition + (content !== null 
					? '>' + content + '</' + this.name + '>' 
					: '/>');
		}
	}
};