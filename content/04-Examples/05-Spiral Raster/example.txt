<paperscript resize=true explain=true>
// Please note: dragging and dropping images only works for
// certain browsers when serving this script online:
var path, position, max;
var count = 0;
var grow = true;
var raster = new Raster('mona');
raster.remove();

var text = new PointText({
	justification: 'right',
	fontSize: 12,
	content: window.FileReader
		? 'drag & drop an image from your desktop to rasterize it'
		: 'to drag & drop images, please use Webkit, Firefox, Chrome or IE 10'
});

resetSpiral();

function onFrame(event) {
	if (grow) {
		if (raster && (view.center - position).length < max) {
			for (var i = 0, l = count / 36 + 1; i < l; i++) {
				growSpiral();
			}
			path.smooth();
		} else {
			grow = false;
		}
	}
}

function growSpiral() {
		count++;
	    var vector = new Point({
	        angle: count * 5,
	        length: count / 100
	    });
		var rot = vector.rotate(90);
		var color = raster.getAverageColor(position + vector / 2);
		var value = color ? (1 - color.gray) * 3.7 : 0;
		rot.length = Math.max(value, 0.2);
	    path.add(position + vector - rot);
		path.insert(0, position + vector + rot);
		position += vector;
}

function resetSpiral() {
	grow = true;

	// Transform the raster, so it fills the view:
	raster.fitBounds(view.bounds);

	if (path)
		path.remove();

	position = view.center;
	count = 0;
	path = new Path({
		fillColor: 'black',
		closed: true
	});

	position = view.center;
	max = Math.min(raster.bounds.width, raster.bounds.height) * 0.5;
}

function onResize() {
	resetSpiral();
	text.point = view.bounds.bottomRight - [30, 30];
}

function onKeyDown(event) {
	if (event.key == 'space') {
		path.selected = !path.selected;
	}
}

function onDocumentDrag(event) {
	event.preventDefault();
}

function onDocumentDrop(event) {
	event.preventDefault();

	var file = event.dataTransfer.files[0];
	var reader = new FileReader();

	reader.onload = function ( event ) {
		var image = document.createElement('img');
		image.onload = function () {
			raster = new Raster(image);
			raster.remove();
			resetSpiral();
		};
		image.src = event.target.result;
	};
	reader.readAsDataURL(file);
}

DomEvent.add(document, {
	drop: onDocumentDrop,
	dragover: onDocumentDrag,
	dragleave: onDocumentDrag
});
</paperscript>
<image src="mona.jpg" id="mona" class="hidden" />