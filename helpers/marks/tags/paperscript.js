module.exports = {
	paperscript: {
		nesting: false,
		encode: false,

		render: function(content, param, encode, before, after) {
			var code = content || this['arguments'][0];
			if (!code) return;
			var attrs = this.attributes;
			var id = attrs.id;
			if (!id) {
				param.canvasId = param.canvasId || 0;
				id = attrs.id = 'canvas-' + (++param.canvasId);
			}
			var source = attrs.source;
			var split = attrs.split === 'true';
			var explain = attrs.explain === 'true';
			var background = attrs.background;
			var border = attrs.border;
			delete attrs.source;
			delete attrs.split;
			delete attrs.explain;
			delete attrs.background;
			delete attrs.border;
			if (!attrs.resize) {
				if (!attrs.width)
					attrs.width = 540;
				if (!attrs.height)
					attrs.height = 540;
				if (border || split) {
					// Oh CSS why are you such a pain.
					attrs.width -= 2;
					attrs.height -= 2;
				}
			}
			var parts = [];
			parts.push(
				'<div class="paperscript'
					+ (split ? ' split' : '')
					+ (source === 'true' ? ' source' : '')
					+ '">'
			);
			if (source !== 'false') {
				parts.push(
					'<div class="buttons">',
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
					+ (border ? ' border' : '')
					+ '">'
			);

			parts.push(
					'<canvas ' + this.renderAttributes()
						+ (background ? ' style="background:' + background + '"' : '')
						+ '></canvas>',
				'</div>'
			);
			parts.push('</div>');
			return parts.join('');
		}
	}
};