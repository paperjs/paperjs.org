ExpandableList = HtmlElement.extend({
	_class: 'expandable-list',

	initialize: function() {
		this.injectTop('a', { href: '#', 'class': 'arrow', events: {
			click: function(event) {
				var list = this.getParent();
				list.modifyClass('expanded', !list.hasClass('expanded'));
				event.stop();
			}
		}});
	}
});

SideList = HtmlElement.extend({
	_class: 'side-list',

	initialize: function() {
		// Shorten each list entry to fit the available space
		$$('div.entry', this).each(function(entry) {
			var title = $('div.title a', entry);
			// Span is needed for correct width, otherwise whole column is returned.
			var date = $('div.date span', entry);
			if (title && date) {
				var width = entry.getWidth() - date.getWidth();
				var text = title.getFirstNode();
				var str = text.getText();
				// Remove trailing white space, since we're matching non-white
				// in backward loop.
				var pos = str.length - str.match(/([\s]*)$/)[1].length;
				// Depending on the prediction, either one or the other of
				// the following loops is needed.
				// Now first go backwards until the height fits.
				while (title.getWidth() > width) {
					str = str.substring(0, pos).trim(' .,');
					text.setText(str + '\u2026');
					// Find the previous word using regexp, including whitespace.
					var word = (str.match(/([\s]*[^\s]*)$/) || [])[1];
					if (!word)
						break;
					pos -= word.length;
				}
			}
		});
	}
});

// TODO: See if this can be merged with SideList as it repeats functionality
AutoFit = HtmlElement.extend({
	_class: 'auto-fit',

	initialize: function() {
		var height = this.getHeight();
		var content = this.getFirst();
		var text = content.getLastNode();
		var str = text.getText();
		// Remove trailing white space, since we're matching non-white
		// in backward loop.
		var pos = str.length - str.match(/([\s]*)$/)[1].length;
		// Depending on the prediction, either one or the other of
		// the following loops is needed.
		// Now first go backwards until the height fits.
		while (content.getHeight() > height) {
			str = str.substring(0, pos);
			text.setText(str + '\u2026');
			// Find the previous word using regexp, including whitespace.
			var word = (str.match(/([\s]*[^\s]*)$/) || [])[1];
			if (!word)
				break;
			pos -= word.length;
		}
	}
});

Selector = HtmlElement.extend(new function () {

	function setup() {
		var selectors = $$('.selector');
		Selector.active = selectors[0];
		Selector.active.addClass('active');
		function update() {
//			if (!Selector.active.isVisible()) {
				selectors.each(function(selector) {
					if (selector.checkActive())
						throw $break;
				});
//			}
		}
		$document.addEvents({
			scroll: update
		});
		$window.addEvents({
			resize: update
		});
	}

	var scroll = new Fx.Scroll($document, { duration: 250 });

	return {
		_class: 'selector',

		initialize: function() {
			if (!Selector.setup) {
				Selector.setup = true;
				setup();
			}

			var link = $('a', this),
				that = this;
			this.target = $(link.get('href'));
			// Move all elements of this section into the section div now,
			// so the selector can easily check if the section is visible or not
			// We're not doing this on the server because it's easier here,
			// mainly due to the paragraph encoder not processing nested divs.
			var child = this.target && this.target.getNextNode();
			while (child && (!child.hasClass || !child.hasClass('section'))) {
				// Seems strange to call child.getNextNode() twice, but 
				// the Code tag below requires it because the first call
				// triggers its conversion from <pre> to CodeMirror... hmmm!
				child.getNextNode();
				var next = child.getNextNode();
				this.target.appendChild(child);
				child = next;
			}
			link.addEvents({
				click: function(event) {
					if (!that.target)
						return;
					scroll.toElement(that.target, { y: true }).chain(function() {
						window.location.hash = that.target.getId();
						that.activate();
					});
					event.stop();
				}
			});
		},

		isVisible: function() {
			return this.target && this.target.isVisible();
		},

		activate: function() {
			Selector.active.removeClass('active');
			this.addClass('active');
			Selector.active = this;
		},

		checkActive: function() {
			if (!this.isVisible())
				return false;
			this.activate();
			return true;
		}
	};
});

Index = HtmlElement.extend({
	_class: 'index',

	initialize: function() {
		// Move children into nested div, so it can be changed to fixed
		var container = this.injectTop('div', this.getChildNodes()),
			that = this;
		$window.addEvents({
			scroll: function(event) {
				container.modifyClass('fixed', that.getOffset(false, true).y <= 0);
			}
		});
	}
});

ContentEnd = HtmlElement.extend({
	_class: 'content-end',

	initialize: function() {
		var anchor = $$('a[name]').getLast(),
			that = this;
		if (anchor) {
			function resize() {
				var bottom = $window.getScrollSize().height
					- anchor.getOffset().y - $window.getSize().height;
				that.setHeight(that.getHeight() - bottom);
			}
			$window.addEvents({
				load: resize,
				resize: resize
			});
			// Not sure why these are required twice, in addition to load()..
			resize();
			resize();
		}
	}
});

function createCodeMirror(place, options, source) {
	return new CodeMirror(place, Hash.create({}, {
		mode: 'javascript',
		lineNumbers: true,
		matchBrackets: true,
		indentUnit: 4,
		tabSize: 4,
		indentWithTabs: true,
		tabMode: 'shift',
		value: source.getText().match(
			// Remove first & last empty line
			/^\s*?[\n\r]?([\u0000-\uffff]*?)[\n\r]?\s*?$/)[1]
	}, options));
}

Code = HtmlElement.extend({
	_class: 'code',

	initialize: function() {
		// Only format this element if it is visible, otherwise wait until
		// it is made visible and then call initialize() manually.
		if (this.initialized || this.getBounds().height == 0)
			return;
		var that = this;
		var start = this.getProperty('start');
		var highlight = this.getProperty('highlight');
		var editor = createCodeMirror(function(el) {
			that.replaceWith(el);
		}, {
			lineNumbers: !this.hasParent('.resource-text'),
			firstLineNumber: (start || 1).toInt(),
			mode: this.getProperty('mode') || 'javascript',
			readOnly: true
		}, this);
		if (highlight) {
			var highlights = highlight.split(',');
			for (var i = 0, l = highlights.length; i < l; i++) {
				var highlight = highlights[i].split('-');
				var hlStart = highlight[0].toInt() - 1;
				var hlEnd = highlight.length == 2
						? highlight[1].toInt() - 1 : hlStart;
				if (start) {
					hlStart -= start - 1;
					hlEnd -= start - 1;
				}
				for (var j = hlStart; j <= hlEnd; j++) {
					editor.setLineClass(j, 'highlight');
				}
			}
		}
		this.initialized = true;
	}
});

PaperScript = HtmlElement.extend({
	_class: 'paperscript',

	initialize: function() {
		// Only format this element if it is visible, otherwise wait until
		// it is made visible and then call initialize() manually.
		if (this.initialized || this.getBounds().height == 0)
			return;
		var script = $('script', this),
			runButton = $('.button.run', this);
		if (!script || !runButton)
			return;
		var that = this,
			canvas = $('canvas', this),
			hasResize = canvas.getProperty('resize'),
			showSplit = this.hasClass('split'),
			sourceFirst = this.hasClass('source'),
			width, height,
			editor = null,
			hasBorders = true,
			edited = false,
			animateExplain,
			inspectorButton = $('.button.inspector', this),
			explain = $('.explain', this),
			tools = $('.tools', this),
			source = script.injectBefore('div', {
				className: 'source hidden'
			});

		if (explain) {
			explain.addClass('hidden');
			// Add explanation bubbles to tickle the visitor's fancy
			var explanations = [{
				index: 0,
				list: [
					[4, ''],
					[4, '<b>Note:</b> You can view and even edit<br>the source right here in the browser'],
					[1, ''],
					[3, 'To do so, simply press the <b>Source</b> button &rarr;']
				]
			}, {
				index: 0,
				indexIfEdited: 3, // Skip first sentence if user has already edited code
				list: [
					[4, ''],
					[3, 'Why don\'t you try editing the code?'],
					[1, ''],
					[4, 'To run it again, simply press press <b>Run</b> &rarr;']
				]
			}];
			var timer,
				mode;
			animateExplain = function(clearPrevious) {
				if (timer)
					timer.clear();
				// Set previous mode's index to the end?
				if (mode && clearPrevious)
					mode.index = mode.list.length;
				mode = explanations[source.hasClass('hidden') ? 0 : 1];
				if (edited && mode.index < mode.indexIfEdited)
					mode.index = mode.indexIfEdited;
				var entry = mode.list[mode.index];
				if (entry) {
					explain.removeClass('hidden');
					explain.setHtml(entry[1]);
					timer = (function() {
						// Only increase once we're stepping, not in animate()
						// itself, as entering & leaving would continuosly step
						mode.index++;
						animateExplain();
					}).delay(entry[0] * 1000);
				}
				if (!entry || !entry[1])
					explain.addClass('hidden');
			};
			this.addEvents({
				mouseover: function() {
					if (!timer)
						animateExplain();
				},
				mouseout: function(event) {
					// Check the effect of :hover on button to see if we need
					// to turn off...
					// TODO: make mouseenter / mouseleave events work again
					if (timer && runButton.getStyle('display') == 'none') {
						timer = timer.clear();
						explain.addClass('hidden');
					}
				}
			});
		}

		function showSource(show) {
			source.modifyClass('hidden', !show);
			runButton.setText(show ? 'Run' : 'Source');
			if (tools)
				tools.modifyClass('hidden', show);
			if (explain)
				animateExplain(true);
			if (show && !editor) {
				editor = createCodeMirror(source.$, {
					onKeyEvent: function(editor, event) {
						edited = true;
						/*
						event = new DomEvent(event);
						if (event.type == 'keydown') {
							var pos = editor.getCursor();
							pos.ch += 4;
							editor.setCursor(pos);
							event.stop();
						}
						*/
					}
				}, script);
			}
		}

		function runScript() {
			var scope = paper.PaperScope.get(script.$);
			if (scope) {
				// Update script to edited version
				var code = editor.getValue();
				script.setText(code);
				// Keep a reference to the used canvas, since we're going to
				// fully clear the scope and initialize again with this canvas.
				// Support both old and new versions of paper.js for now:
				var element = scope.view.element || scope.view.canvas;
				// Clear scope first, then evaluate a new script.
				scope.clear();
				scope.initialize(script.$);
				scope.setup(element);
				scope.evaluate(code);
			}
		}

		function resize() {
			if (!canvas.hasClass('hidden')) {
				width = canvas.getWidth();
				height = canvas.getHeight();
			} else if (hasResize) {
				// Can't get correct dimensions from hidden canvas,
				// so calculate again.
				var size = $window.getScrollSize();
				var offset = source.getOffset();
				width = size.width - offset.x;
				height = size.height - offset.y;
			}
			// Resize the main element as well, so that the float:right button
			// is always positioned correctly.
			that.set({ width: width, height: height });
			source.set({
				width: width - (hasBorders ? 2 : 1),
				height: height - (hasBorders ? 2 : 0)
			});
		}

		function toggleView() {
			var show = source.hasClass('hidden');
			resize();
			canvas.modifyClass('hidden', show);
			showSource(show);
			if (!show)
				runScript();
			// Add extra margin if there is scrolling
			runButton.setStyle('margin-right',
				$('.CodeMirror', source).getScrollSize().height > height
					? 23 : 8);
		}

		if (hasResize) {
			// Install the resize event only after paper.js installs its own,
			// which happens on the load event. This is needed because we rely
			// on paper.js performing the actual resize magic.
			$window.addEvent('load', function() {
				$window.addEvents({
					resize: resize
				});
			});
			hasBorders = false;
			source.setStyles({
				borderWidth: '0 0 0 1px'
			});
		}

		if (showSplit) {
			showSource(true);
		} else if (sourceFirst) {
			toggleView();
		}

		runButton.addEvents({
			click: function(event) {
				if (showSplit) {
					runScript();
				} else {
					toggleView();
				}
				if (event) {
					event.stop();
				}
			},

			mousedown: function(event) {
				event.stop();
			}
		});
		this.initialized = true;
	}
});

var lastMemberId = null;
function toggleMember(id, scrollTo, dontScroll) {
	var link = $('#' + id + '-link');
	if (!link)
		return true;
	var desc = $('#' + id + '-description');
	var v = !link.hasClass('hidden');
	// Retrieve y-offset before any changes, so we can correct scrolling after
	var offset = (v ? link : desc).getOffset().y;
	if (lastMemberId && lastMemberId != id) {
		var prevId = lastMemberId;
		lastMemberId = null;
		toggleMember(prevId, false, true);
	}
	lastMemberId = v && id;
	link.modifyClass('hidden', v);
	desc.modifyClass('hidden', !v);
	if (!dontScroll) {
		// Correct scrolling relatively to where we are, by checking the amount
		// the element has shifted due to the above toggleMember call, and
		// correcting by 11px offset, caused by 1px border and 10px padding.
		var scroll = $window.getScrollOffset();
		$window.setScrollOffset(scroll.x, scroll.y
				+ (v ? desc : link).getOffset().y - offset + 11 * (v ? 1 : -1));
	}
	if (!desc.editor && v) {
		desc.editor = $$('pre.code, .paperscript', desc).each(function(code) {
			code.initialize();
		});
	}
	if (scrollTo)
		scrollToMember(id);
	return false;
}

function toggleThumbnail(id, over) {
	$('#' + id).modifyClass('hidden', over);
	$('#' + id + '-over').modifyClass('hidden', !over);
}

function scrollToElement(id) {
	var e = $('#' + id + '-member');
	window.location.hash = id;
	if (e) {
		if (e.hasClass('member'))
			toggleMember(id);
		var offs = e.getOffset();
		$window.setScrollOffset(offs);
	}
}

$document.addEvent('domready', function() {
	var h = unescape(window.location.hash);
	if (h) scrollToElement(h.substring(1));
	var packages = $('.reference-packages');
	if (packages) {
		// Mark currently selected class as active. Do it client-sided
		// since the menu is generated by jsdocs.
		var path = window.location.pathname.toLowerCase();
		$$('a', packages).each(function(link) {
			if (link.get('href') == path) {
				link.addClass('active');
			}
		});
	}
});
