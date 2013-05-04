var Html = require('./Html');
var Url = require('./Url');

var encodeHex = function(string) {
	return new Buffer(string).toString('hex');
};

function renderLink(param) {
	var out = '';

	if (!param || typeof param == 'string')
		param = { content: param };
	var url = '';
	if (param.href) {
		url = param.href;
	} else if (param.email) {
		// Simple email 'encryption'. Hopefully enough for spam bots?
		var parts = param.email.split('@');
		if (parts.length == 2)
			url = "javascript:window.location='\\x6D\\x61\\x69\\x6C\\x74\\x6F\\x3A"
					+ encodeHex(parts[0]) + "' + '\\x40' + '"
					+ encodeHex(parts[1]) + "';";
	} else { // object / id ; action
		var object = param.object || param.id && root.get(param.id);
		if (object)
			url = object.href(param.action);
	}
	if (param.query)
		url += (param.query[0] == '?' ? '' : url.indexOf('?') != -1 ? '&' : '?')
				+ param.query;

	if (param.anchor)
		url += '#' + param.anchor;

	if (url && Url.isRemote(url)) { // Not a local page -> target = '_blank'
		// Make sure the non-local url has a protocol, http is default:
		url = Url.addProtocol(url);
		// TODO: make handling of this an app wide switch?
		if (!param.attributes)
			param.attributes = {};
		if (!param.attributes.target)
			param.attributes.target = '_blank';
	}

	var confirm = param.confirm && 'confirm(' + JSON.stringify(param.confirm) + ')';

	// Handle onClick
	var onClick = param.onClick;
	if (onClick) {
		// Make sure it ends with ;
		if (!/;$/.test(onClick))
			onClick += ';';
		if (!url)
			url = '#';
	} else if (url) {
		if (param.update) {
			onClick = "$('#" + param.update + "').load('" + url + "');";
			url = '#';
		} else if (param.popup) {
			var popupParam = { url: url, name: 'popup' };
			for (var i in param.popup)
				popupParam[i] = param.popup[i];
			onClick = 'new Window('
					+ JSON.stringify(popupParam) + ');';
			url = '#';
		}
	}

	var attributes = param.attributes;
	// Notice: param.text is not the same as param.content:
	// content is supposed to be encoded already, text is encoded automatically!
	var content = param.content;
	if (!content) {
		if (param.text) {
			content = encode(param.text);
		} else if (url) {
			content = url.match(/^(?:\w+:\/\/)?(.*)$/)[1];
		}
	}
	if (!url) {
		// Simply render the content without a link.
		out = content;
	} else {
		if (onClick || confirm) {
			if (confirm)
				onClick = onClick 
					? 'if (' + confirm + ') ' + onClick + ' return false;'
					: 'return ' + confirm + ';';
			if (!attributes)
				attributes = {};
			attributes.onclick = onClick + (confirm ? '' : ' return false;');
		}
		out = '<a href="' + url + '"' 
			+ (attributes ? Html.attributes(attributes) : '') + '>' 
			+ content + '</a>';
	}

	return out;
}

module.exports = renderLink;