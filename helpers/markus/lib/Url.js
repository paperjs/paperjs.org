var Url =  new function() {
	var urlFiles = {};

	return {
		parse: function(url) {
			var values = url.match(/^(?:(\w+):\/\/)?([^:\/]+)(?::([0-9]+))?(\/.*)?/) || [];
			return {
				protocol: values[1],
				host: values[2],
				port: values[3],
				path: values[4]
			};
		},

		hasProtocol: function(url) {
			return (/^\w+:\/\//).test(url);
		},

		addProtocol: function(url) {
			return Url.hasProtocol(url) ? url : 'http://' + url;
		},

		/**
		 * Returns true if the url is remote, meaning it either starts with a
		 * protocol or with www. use hasProtocol to check wether a remote url
		 * provides a protocol, and add one if it does not.
		 */
		isRemote: function(url) {
			return Url.hasProtocol(url) || /^www\./.test(url);
		},

		/**
		 * Returns true if the url is a absolute local path, false otherwise.
		 * This is the case when it starts with a /.
		 */
		isAbsolute: function(url) {
			return (/^\//).test(url);
		},

		/**
		 * Returns true when the url is a relative local path, false othrwise.
		 * This is the case when it is not absolute and not remote.
		 */
		isRelative: function(url) {
			return (/^\w/).test(url) && !Url.isRemote(url);
		}
	};
};

module.exports = Url;