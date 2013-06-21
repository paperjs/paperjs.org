module.exports = {
	api: {
		attributes: 'id',
		defaultPackage: '',

		render: function(content, param, encode) {
			var id = this.attributes.id,
				matches = id.match(/(?:([a-z]*)\.)?([\w]*)(?:([#.])(\w*))?(\([^)]*\))?/),
				pkg = matches[1],
				cls = matches[2],
				sep = matches[3],
				name = matches[4],
				args = matches[5];
			if (!pkg)
				pkg = this.defaultPackage;
			if (!name)
				name = cls;
			var commonArgs;
			if (args) {
				args = args.substring(1, args.length - 1);
				// The args exlcuding the optional ones.
				commonArgs = args ? args.match(/([^\[]*)/)[1].split(/\s*,\s*/g) : [];
				// The args, with the [] for optional args filtered out
				args = args ? args.replace(/[\[\]]/g, '').split(/\s*,\s*/g) : [];
			}
			var url = pkg ? pkg + '/' : '';
			url += cls;
			// If there's no separator and now arguments, we're simply linking
			// to the class. Do not add the hash.
			if (sep || commonArgs) {
				url += '#';
				if (sep == '.')
					url += cls + '-';
				url += name;
				if (commonArgs && commonArgs.length > 0)
					url += '-' + commonArgs.join('-');
			}
			if (!content) {
				if (sep == '#')
					cls = cls[0].toLowerCase() + cls.substring(1);
				content = args && /^[A-Z]/.test(name) ? 'new ' + cls : cls;
				if (sep)
					content += '.' + name;
				if (args)
					content += '(' + args.join(', ') + ')';
			}
			return '<tt><a href="/reference/' + url.toLowerCase() + '">'
					+ content + '</a></tt>';
		}
	}
};