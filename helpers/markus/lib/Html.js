// Translate JavaScript names to HTML names
var properties = {
	'className': 'class', 'htmlFor': 'for', colSpan: 'colspan',
	rowSpan: 'rowspan', accessKey: 'accesskey', tabIndex: 'tabindex',
	maxLength: 'maxlength', readOnly: 'readonly'
};

// Block tags are tags that require to be rendered outside of paragraphs.
var blockTags = new function() {
	var tags = {};
	'address,dir,div,table,blockquote,center,dl,fieldset,form,h1,h2,h3,h4,h5,h6,hr,isindex,ol,p,pre,ul,script,canvas'
		.split(',').forEach(function(tag) {
			tags[tag] = true;
		});
	return tags;
};

// Empty tags are tags that do not have a closing tag, so no need to search for it.
var emptyTags = new function() {
	var tags = {};
	'area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param'
		.split(',').forEach(function(tag) {
			tags[tag] = true;
		});
	return tags;
};

var Html = {
	/*
	 * Global switch to control XHTML format. Since we're defaulting to 
	 * HTML5 now, set it to false
	 */
	XHTML: false,
	
	/* Tag rendering functions */

	/**
	 * Renders attributes for an Html tag. The first param is prepended by
	 * a space, so the tag rendering code does not need to take care of that
	 */
	attributes: function(attributes) {
		var out = '';

		for (var name in attributes) {
			var value = attributes[name];
			name = properties[name] || name;
			// Only pre XHTML allows empty attributes
			if (value !== null || !Html.XHTML && value !== undefined) {
				out += ' ' + name;
				if (value !== null)
					out += '="' + encodeEntities(value) + '"';
			}
		}

		return out;
	},

	element: function(name, attributes, content) {
		var out = '<' + name;
		if (attributes !== null)
			Html.attributes(attributes, out);

		if (content !== null) {
			out += '>' + content + '</' + name + '>';
		} else {
			// use /> only for empty XHTML tags:
			out += Html.XHTML ? ' />' : '>';
		}

		return out;
	},

	script: function(attributes) {
		// Render with empty content so tag is not rendered as an empty tag
		// and gets closed again (</script>).
		return Html.element('script', attributes, '');
	},

	link: function(attributes) {
		return Html.element('link', attributes, null);
	},

	image: function(attributes) {
		return Html.element('img', attributes, null);
	},

	textarea: function(attributes) {
		var value = attributes.value;
		delete attributes.value;
		// Form elements should have both id and name
		if (!attributes.id)
			attributes.id = attributes.name;
		return Html.element('textarea', attributes, value
				? encodeEntities(value) : '');
	},

	select: function(attributes) {
		var out = '';

		var options = attributes.options;
		delete attributes.options;
		// Form elements should have both id and name
		if (!attributes.id)
			attributes.id = attributes.name;
		out += '<select' + Html.attributes(attributes) + '>';
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			if (option === null)
				continue;
			if (typeof option == 'object') {
				if (option.name === null) {
					option.name = option.value;
				} else if (option.value === null) {
					option.value = option.name;
				}
			} else {
				option = {
					name: option, 
					value: option
				};
			}
			if (option.selected || option.value == attributes.current) {
				// Setting selected to null causes an non-xhtml attribute
				// without a value in Html.attributes() (<... selected ...>)
				option.selected = Html.XHTML ? 'selected' : null;
			} else {
				delete option.selected;
			}
			out += Html.element('option', option, option.name);
		}
		out += '</select>';

		if (asString)
			return out.pop();
	},

	input: function(attributes, out) {
		switch(attributes.type) {
			case 'radio':
			case 'checkbox':
				if (!attributes.value) attributes.value = 1;
				// Setting checked to null causes an non-xhtml attribute
				// without a value in Html.attributes() (<... checked ...>)
				if (attributes.value == attributes.current)
					attributes.checked = Html.XHTML ? 'checked' : null;
				break;

		}
		// Form elements should have both id and name
		if (attributes.id === undefined)
			attributes.id = attributes.name;
		delete attributes.current;
		return Html.element('input', attributes, null, out);
	},

	lineBreak: function() {
		return Html.XHTML ? '<br />' : '<br>';
	},

	/* Html Formating functions */

	/**
	 * Performs something similar to Helma's own formatParagraphs, but
	 * handles 'suffixes' (bits of text after tags on the same line)
	 * differently, by not wrapping them in paragraphs. This seems more
	 * logical.
	 * This is highly optimised but roughly 8 times slower than the Java
	 * version.
	 * TODO: Fix then internal formatParagraphs to do the same on the
	 * helma-in-boots fork.
	 */
	formatParagraphs: function(input) {
//			var t = Date.now();
		// Determine used lineBreak sequence and use it to break input into
		// lines. This is much faster than using the regexp directly in
		// split, which itself is still faster than finding lines using
		// indexOf. All in all this alone leads to a speed increase of * 2.
		var lineBreak = (input.match(/(\r\n|\n|\r)/) || [, '\n'])[1];
		var lines = input.split(lineBreak);
		var isParagraph = false, wasParagraph = false,
			isSuffix = false, wasSuffix = false;
		var out = [];
		var breakTag = Html.lineBreak();
		for (var i = 0, l = lines.length; i < l; i++) {
			var line = lines[i];
			/*
			if (report) {
				User.log('#', i, line);
				var start = out.length;
			}
			*/
			if (!line || /^\s*$/.test(line)) {
				// what if line |= '' but only contains \s*?
				if (isParagraph) {
					out.push(lineBreak, '</p>');
					isParagraph = false;
				} else {
					// Only add one break on empty lines if the previous line
					// was a suffix. See bellow for explanations.
					if (wasSuffix)
						out.push(breakTag);
				}
			} else {
				wasSuffix = false;
				var match;
				if (match = line.match(/^<(\w*)/)) {
					var tag = match[1], isBlockTag = blockTags[tag];
					if (isParagraph && isBlockTag) {
						out.push(lineBreak, '</p>');
						isParagraph = false;
						wasParagraph = false;
					} else if (!isParagraph && !isBlockTag && !isSuffix) {
						// if (report) User.log('Tag', tag);
						out.push(lineBreak, '<p>');
						isParagraph = true;
					}
					if (isBlockTag && !emptyTags[tag]) {
						// if (report) User.log('Block Tag', tag);
						// Find the end of this outside tag. We need to count the
						// nesting of opening and closing tags in order to make sure
						// the whole block is detected.
						var open = '<' + tag;
						var close = '</' + tag + '>';
						// Start with nesting 1 and searchIndex after the tag
						// so the currently opening tag is already counted.
						var nesting = 1, searchIndex = open.length; 
						for (; i < l; i++) {
							line = lines[i];
							// if (report) User.log('Adding', line);
							// If the line is the rest of a previously processed
							// line (see bellow), do not add a newline before it.
							// This is crucual e.g. for rendering of inlined image
							// resources in Scriptographer .block .text.
							if (!isSuffix && i > 0)
								out.push(lineBreak);
							out.push(line);
							// if (report) User.log('Nesting', nesting, line);
							isSuffix = false;
							while (true) {
								var closeIndex = line.indexOf(close, searchIndex);
								var openIndex = line.indexOf(open, searchIndex);
								if (closeIndex != -1) {
									if (openIndex != -1) {
										if (closeIndex < openIndex) {
											// We're closing before opening again, reduce
											// nesting and see what is to be done after.
											nesting--;
											searchIndex = openIndex;
										} else {
											// Else we're opening a new one and closing it
											// again, so nesting stays the same.
											searchIndex = closeIndex + close.length;
										}
									} else {
										nesting--;
										searchIndex = closeIndex + close.length;
									}
									if (nesting === 0) {
										// if (report) User.log('Closed', line);
										isParagraph = false;
										var index = closeIndex + close.length;
										if (index < line.length) {
											// If there is more right after, put it back
											// into lines and reduce i by 1, so this line
											// will be iterated and processed again.
											// if (report) User.log('Suffix', line.substring(index));
											lines[i--] = line.substring(index);
											// Replace the full line with what has been
											// processed already.
											out[out.length - 1] = line.substring(0, index);
											// Mark this as a so called suffix, which is
											// a snippet of text that followed a block tag
											// on the same line. We don't want these to
											// be rendered in a new paragraph. Instead
											// it should just follow the block tag and
											// be terminated with a br tag. isSuffix handles
											// that. This might not be a suffix thought but
											// another block tag. The parsing of the line
											// that's been put back will tell...
											isSuffix = true;
										}
										break;
									}
								} else if (openIndex != -1) {
									nesting++;
									searchIndex = openIndex + open.length;
								} else {
									searchIndex = 0;
									break;
								}
							}
							if (nesting === 0)
								break;
						}
						continue;
					}
				} else {
					if (!isParagraph && !isSuffix) {
						out.push(lineBreak, '<p>');
						isParagraph = true;
					}
				}
				// wasParagraph is used to know that we are on lines 2nd and
				// beyond within a paragraph, so we can add break tags.
				if (wasParagraph)
					out.push(breakTag);
				if (i > 0)
					out.push(lineBreak);
				out.push(line);
				// Suffixes are outside paragraphs and therefore need a
				// break after.
				if (isSuffix) {
					out.push(breakTag);
					wasSuffix = true;
					isSuffix = false;
				}
			}
			wasParagraph = isParagraph;
			// if (report) User.log(' ->', out.slice(start, out.length).join(''));
		}
		var ret = out.join('');
		// User.log('Time', Date.now() - t);
		//	if (report) User.log(ret);
		return ret;
	},

	formatLists: function(input) {
		// Converts dashed lists to real one with the class "list" applied.
		if (!input)
			return input;
		// Lists
		// -–—• = \x2d\u2013\u2014\u2022
		var hasLists = false;
		var str = input.replace(
			/^(\n*)(?:\s*)[\x2d\u2013\u2014\u2022](?:\s*)(.*)$/gm,
			function(all, pre, line) {
				hasLists = true;
				return pre + '<li>' + line.trim() + '</li>';
			}
		);
		if (hasLists) {
			str = str.replace(/(?:<li>(?:.*?)<\/li>\s*)+/gm, function(all) {
				var end = all.match(/<\/li>(.*)$/m)[1];
				return '<ul class="list">' + all.substring(0,
						all.length - end.length) + '</ul>\n' + end;
			});
		}
		return str;
	}
};

module.exports = Html;