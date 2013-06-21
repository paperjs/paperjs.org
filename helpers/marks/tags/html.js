module.exports = {
	'i,b,em,strong,s,strike': {
		render: function(content) {
			return '<' + this.definition + (content !== null 
					? '>' + content + '</' + this.name + '>' 
					: '/>');
		}
	},

    html: {
        nesting: false,
        encode: false,
        render: function(content) {
            return content;
        }
    }
};