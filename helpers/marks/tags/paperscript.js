var decode = require('ent').decode;

module.exports = {
	paperscript: {
		nesting: false,
		encode: false,

		render: function(content, param, encode, before, after) {
			var code = content || this['arguments'][0];
			if (!code) return;
			code = decode(code);
			var attrs = this.attributes;
			var id = attrs.id;
			if (!id) {
				param.canvasId = param.canvasId || 0;
				id = attrs.id = 'canvas-' + (++param.canvasId);
			}
			var source = attrs.source;
			var split = attrs.split === 'true';
			var explain = attrs.explain === 'true';
			var inspector = attrs.inspector === 'true';
			var background = attrs.background;
			var border = attrs.border;
			delete attrs.source;
			delete attrs.split;
			delete attrs.explain;
			delete attrs.inspector;
			delete attrs.background;
			delete attrs.border;
			if (!attrs.resize) {
				if (!attrs.width)
					attrs.width = 540;
				if (!attrs.height)
					attrs.height = 540;
				if (border) {
					// Oh CSS why are you such a pain.
					attrs.width -= 2;
					attrs.height -= 2;
				}
			}
			var inspectorButton = inspector ? '<div class="tools"><div class="button inspector"></div></div>' : '';
			var parts = [];
			parts.push(
				'<div class="paperscript'
					+ (split ? ' split' : '')
					+ (source === 'true' ? ' source' : '')
					+ '">'
			);
			if (source !== 'false') {
				parts.push(
					'<div class="buttons-context">',
						'<div class="buttons">',
							inspector && !split ? inspectorButton : '',
							'<div class="button run">Source</div>',
							explain ? '<div class="explain"></div>' : '',
						'</div>'
				);
			}
			parts.push(
				'<script type="text/paperscript" canvas="' + id + '">'
					+ code
				+ '</script>'
			);
			parts.push(
				'<div class="canvas'
					+ (inspector && split ? ' buttons-context' : '')
					+ (border ? ' border' : '')
					+ '">'
			);

			if (inspector && split) {
				parts.push(
					'<div class="buttons">',
						inspectorButton,
					'</div>'
				);
			}
			parts.push(
					'<canvas ' + this.renderAttributes()
						+ (background ? ' style="background:' + background + '"' : '')
						+ '></canvas>',
				'</div>'
			);
			if (source !== 'false') {
				parts.push('</div>');
			}
			parts.push('</div>');
			return parts.join('\n   ');
		}
	}
};