Paper.js allows you to find the average color of an area within a raster. This allows you to find the average color within a <api Rectangle />, <api Point /> or <api PathItem /> over an image.

The following example fills a circle shaped path with the average color of the raster at the position of the mouse:

<paperscript height="400" split=true>
// Create a raster item using the image tag with id='mona'
var raster = new Raster('mona');

// Move the raster to the center of the view
raster.position = view.center;

// Create a circle shaped path at {x: 50, y: 50}
// with a radius of 30:
var path = new Path.Circle({
	center: [50, 50],
	radius: 30,
	strokeColor: 'white'
});

function onMouseMove(event) {
	// Set the fill color of the path to the average color
	// of the raster at the position of the mouse:
	path.fillColor = raster.getAverageColor(event.point);
}
</paperscript>

The following script colors the selected paths with the average color of the pixels of the selected raster that fall within the shapes of the paths.

<paperscript height="400" split=true>
// Create a raster item using the image tag with id='mona'
var raster = new Raster('mona');

// Move the raster to the center of the view
raster.position = view.center;

// Set the opacity of the raster to 10%, so we can see
// the colored paths on top more clearly:
raster.opacity = 0.1;

// The onMouseMove event is fired in increments of 25 pts:
tool.fixedDistance = 25;

function onMouseMove(event) {
	// Create a circle shaped path with its center point
	// at the point in the middle between the current mouse
	// position and the position when the last onMouseDrag
	// event was fired:
	var path = new Path.Circle({
		center: event.middlePoint,
		radius: 12.5,
		strokeColor: 'white'
	});
	
	// Get the average color of the pixels that fall within
	// the shape of the path:
	path.fillColor = raster.getAverageColor(path);
}
</paperscript>

<image src="mona.jpg" id="mona" class="hidden" />