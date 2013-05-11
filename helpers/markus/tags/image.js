var Url = require('../lib/Url');

module.exports = {
	'image,img': function(content, param) {
		var src = this.values[0];
		if (!src) {
			src = content;
			content = null;
		}
		if (Url.isRemote(src)) {
			return '<img src="' + src + '"/>';
		} else {
			var image = param.page.images[src];
			if (image) {
				// Allow hiding of images, so that they are consumed and do not appear
				// at the end of the post, but can still be used for thumbnails.
				if (!this.attributes.hide) {
					if (this.attributes.id || this.attributes['class']) {
						param.imageId = this.attributes.id;
						param.imageClass = this.attributes['class'];
					}
					if (content) {
						image = param.page.template('resource_block', {
							content: content,
							resource: image.html(param)
						});
					} else {
						image = image.html(param);
					}
					return image;
				}
			}
		}
	}
};