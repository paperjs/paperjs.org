module.exports = {
	svg: {
		nesting: false,
		encode: false,

		render: function(content) {
			return '<' + this.definition + (content !== null 
					? '>' + content + '</' + this.name + '>' 
					: '/>');
		}
	}
};