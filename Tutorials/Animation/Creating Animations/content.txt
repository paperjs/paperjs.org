<title>Creating Animations</title>
To create animations in Paper.js, we use the <api global#onFrame>onFrame</api> handler. When this function is defined, it is called up to 60 times a second by Paper.js. The view is redrawn automatically after the <code>onFrame</code> function has been executed.

<code>
function onFrame(event) {
	// Your animation code goes in here
}
</code>

<title>The Event Object</title>
The <api global#onFrame>onFrame</api> handler function receives an event object which contains information about the event:

<b>event.count</b>: the number of times the frame event was fired.
<b>event.time</b>: the total amount of time passed since the first frame event in seconds.
<b>event.delta</b>: the time passed in seconds since the last frame event.

<code>
function onFrame(event) {
	// the number of times the frame event was fired:
	console.log(event.count);

	// The total amount of time passed since
	// the first frame event in seconds:
	console.log(event.time);

	// The time passed in seconds since the last frame event:
	console.log(event.delta);
}
</code>
<title>Examples</title>
The following are a number of examples that make use of the <code>onFrame</code> handler to create animations.


<title>Rotating an Item</title>
In the following example, a rectangle shaped path is created on execution and each frame it is rotated by 3 degrees:

<paperscript split=true height=200>
// Create a rectangle shaped path with its top left point at
// {x: 75, y: 75} and a size of {width: 75, height: 75}
var topLeft = new Point(75, 75);
var size = new Size(75, 75);
var path = new Path.Rectangle(topLeft, size);
path.strokeColor = 'black';

function onFrame(event) {
	// Each frame, rotate the path by 3 degrees:
	path.rotate(3);
}
</paperscript>

<title>Animating Colors</title>

The following script creates a circle shaped path item with a red fill color. Then, each frame it slightly changes the hue of the color:

<paperscript split=true height=200>
// Create a circle shaped path at the center of the view,
// with a radius of 70:
var path = new Path.Circle(view.center, 70);

// Fill the path with red:
path.fillColor = 'red';

function onFrame(event) {
	// Each frame, change the fill color of the path slightly by
	// adding 1 to its hue:
	path.fillColor.hue += 1;
}
</paperscript>

<title>Moving an Item</title>

The following script creates a text item and moves it smoothly to a random destination point in the view. When the text item comes near the position, another random destination point is created. The contents of the text item is the distance between its current position and that of the destination point.

<paperscript split=true height=200 background="black">
// Create a centered text item at the center of the view:
var text = new PointText(view.center);
text.paragraphStyle.justification = 'center';
text.characterStyle.fontSize = 20;
text.fillColor = 'white';

// Define a random point in the view, which we will be moving
// the text item towards.
var destination = Point.random() * view.size;

function onFrame(event) {
	// Each frame, move the path 1/30th of the difference in position
	// between it and the destination.
	
	// The vector is the difference between the position of
	// the text item and the destination point:
	var vector = destination - text.position;
	
	// We add 1/30th of the vector to the position property
	// of the text item, to move it in the direction of the
	// destination point:
	text.position += vector / 30;
	
	// Set the content of the text item to be the length of the vector.
	// I.e. the distance it has to travel still:
	text.content = Math.round(vector.length);
	
	// If the distance between the path and the destination is less
	// than 5, we define a new random point in the view to move the
	// path to:
	if (vector.length < 5) {
		destination = Point.random() * view.size;
	}
}
</paperscript>

<title>Moving Multiple Items</title>

The following example shows a star field like animation. The speed that the circles move depends on their width. When a star leaves the view, it is moved back to left of the view.

<paperscript split=true height=200 background="black">
// The amount of circles we want to make:
var count = 150;

// Create a symbol, which we will use to place instances of later:
var path = new Path.Circle(new Point(0, 0), 10);
path.style = {
	fillColor: 'white',
	strokeColor: 'black'
};

var symbol = new Symbol(path);

// Place the instances of the symbol:
for (var i = 0; i < count; i++) {
	// The center position is a random point in the view:
	var center = Point.random() * view.size;
	var placedSymbol = symbol.place(center);
	placedSymbol.scale(i / count);
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
	// Run through the active layer's children list and change
	// the position of the placed symbols:
	for (var i = 0; i < count; i++) {
		var item = project.activeLayer.children[i];
		
		// Move the item 1/20th of its width to the right. This way
		// larger circles move faster than smaller circles:
		item.position.x += item.bounds.width / 20;

		// If the item has left the view on the right, move it back
		// to the left:
		if (item.bounds.left > view.size.width) {
			item.position.x = -item.bounds.width;
		}
	}
}
</paperscript>

<title>Animating Path Segments</title>

The following script creates a path and then changes the position of its segment points in the <code>onFrame</code> handler:

<paperscript split=true height=200>
// The amount of segment points we want to create:
var amount = 5;

// The maximum height of the wave:
var height = 60;

// Create a new path and style it:
var path = new Path();
path.style = {
	strokeColor: new GrayColor(0.2),
	strokeWidth: 30,
	strokeCap: 'square'
};

// Add 5 segment points to the path spread out
// over the width of the view:
for (var i = 0; i <= amount; i++) {
	path.add(new Point(i / amount, 1) * view.size);
}

// Select the path, so we can see how it is constructed:
path.selected = true;

function onFrame(event) {
	// Loop through the segments of the path:
	for (var i = 0; i <= amount; i++) {
		var segment = path.segments[i];

		// A cylic value between -1 and 1
		var sinus = Math.sin(event.time * 3 + i);
		
		// Change the y position of the segment point:
		segment.point.y = sinus * height + 100;
	}
	// Uncomment the following line and run the script again
	// to smooth the path:
	// path.smooth();
}
</paperscript>