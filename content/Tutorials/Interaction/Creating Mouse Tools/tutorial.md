This tutorial explains the different ways to create Paper.js tools that the user can interact with by using the mouse.

<title>My First Mouse Tool</title>
We start with an example of a very simple tool that creates an empty path on execution and adds segments to it whenever you click the mouse:
</code>

<paperscript height=320 width=540 style='background:#e4e1e1' split=true>
// Create a new path once, when the script is executed:
var myPath = new Path();
myPath.strokeColor = 'black';

// This function is called whenever the user
// clicks the mouse in the view:
function onMouseDown(event) {
	// Add a segment to the path at the position of the mouse:
	myPath.add(event.point);
}
</paperscript>

<title>Mouse Handler Functions</title>

Paper.js offers mouse handlers for the different actions you can perform with a mouse. You can use these mouse handlers to produce different types of tools that have different ways of reacting to mouse interaction and movement.

<note>
In JavaScript, functions are blocks of code that are only executed when they are called from another part of the script. Handler functions are functions that are called by Paper.js when a certain event happens.
</note>

To see when the different handler functions are called, copy-paste the following code into a new JavaScript file, execute it and interact with the Paper.js tool:

<code>
function onMouseDown(event) {
	console.log('You pressed the mouse!');
}

function onMouseDrag(event) {
	console.log('You dragged the mouse!');
}

function onMouseUp(event) {
	console.log('You released the mouse!');
}
</code>

<title>The Event Object</title>

The mouse handler functions receive an event object which contains information about the mouse event, such as the current position of the mouse (<api ToolEvent#point>event.point</api>), the position where the mouse was pressed (<api ToolEvent#downPoint>event.downPoint</api>), the pressure of the mouse event (<api ToolEvent#pressure>event.pressure</api>) etc.

<tip>
The properties of the event object are explained in detail in the <node TutorialPage-29 /> tutorial.
</tip>

<title>Line Tool Example</title>

Here is a simple tool that draws lines. The starting point of the line is where you click and the last point is where you release the mouse.

Click, drag and release below to try it out:
<paperscript height=320 width=540 style='background:#e4e1e1' split=true>
// We start by defining an empty variable that is visible by both
// mouse handlers.
var myPath;

function onMouseDown(event) {
	// The mouse was clicked, so let's put a newly created Path into
	// myPath, give it the color black and add the location as the
	// path's first segment.
	myPath = new Path();
	myPath.strokeColor = 'black';
	myPath.add(event.point);
}

function onMouseUp(event) {
	// The mouse was released, so we add the new location as the end
	// segment of the line.
	myPath.add(event.point);
}
</paperscript>

<note>
The difference between this tool and the first example is that a new path is created each time the mouse is clicked, and the path is finished when the mouse is released.
</note>

The same tool can be written more simply, by using only the <api Tool#onMouseUp>onMouseUp(event)</api> handler, and accessing the <api ToolEvent#downPoint>event.downPoint</api> property:

Click, drag and release below to try it out:
<paperscript height=320 width=540 style='background:#e4e1e1' split=true>
function onMouseUp(event) {
	var myPath = new Path();
	myPath.strokeColor = 'black';
	myPath.add(event.downPoint);
	myPath.add(event.point);
}
</paperscript>

When the mouse is released, the <api Tool#onMouseUp>onMouseUp(event)</api> handler is called.

In the <api Tool#onMouseUp>onMouseUp</api> handler we create a new path and give it a black stroke:
<code start=2>
	var myPath = new Path();
	myPath.strokeColor = 'black';
</code>

Then we add two segments to it using the <api Path#add(segment) /> function.

First, we add a segment at <api ToolEvent.downPoint>event.downPoint</api>, which is the position where the mouse button was pressed:
<code start=4>
	myPath.add(event.downPoint);
</code>

Then, we add a segment at <api ToolEvent.point>event.point</api>, which is the position where the mouse button was released:
<code start=5>
	myPath.add(event.point);
</code>

<title short="Click, Drag, Release">Click, Drag and Release Example</title>

As a next step, we are going to make a small drawing tool:

When you click the mouse it will make a new <api Path />.
When you drag the mouse it will add segments to the path.
When you release the mouse it will add a circle shaped path at that position with a radius of 10.

Click and drag below to try it out:
<paperscript height=320 width=540 style='background:#e4e1e1' split=true>
var myPath;

function onMouseDown(event) {
	myPath = new Path();
	myPath.strokeColor = 'black';
}

function onMouseDrag(event) {
	myPath.add(event.point);
}

function onMouseUp(event) {
	var myCircle = new Path.Circle({
		center: event.point,
		radius: 10
	});
	myCircle.strokeColor = 'black';
	myCircle.fillColor = 'white';
}
</paperscript>

Now lets go through the script line by line to see whats happening:

To be able to access the <code>myPath</code> variable from both mouse handlers we declare it outside of the <api Tool#onMouseDown>onMouseDown</api> and <api Tool#onMouseDrag>onMouseDrag</api> handlers:
<code>
var myPath;
</code>

In the <api Tool#onMouseDown>onMouseDown</api> handler we create a new path and store it in the <code>myPath</code> variable:
<code start=3>
function onMouseDown(event) {
	myPath = new Path();
}
</code>

In the <api Tool#onMouseDrag>onMouseDrag</api> handler we add <api ToolEvent#point>event.point</api> (the position of the mouse) to <code>myPath</code> every time the user drags the mouse:
<code start=7>
function onMouseDrag(event) {
	myPath.add(event.point);
	myPath.strokeColor = 'black';
}
</code>

In the <api Tool#onMouseUp>onMouseUp</api> handler we create a circle shaped path with its center point at the position of the mouse when it was released and a radius of 10.
<code start=12>
function onMouseUp(event) {
	var myCircle = new Path.Circle({
		center: event.point,
		radius: 10
	});
	myCircle.strokeColor = 'black';
	myCircle.fillColor = 'white';
}
</code>

<title short="Distance of Mouse Movement">Using the Distance that the Mouse has Moved</title>

Another handy property in the event object is <api ToolEvent#delta>event.delta</api> which describes the difference between the current position and the last position of the mouse when the event was fired. So in an <api Tool#onMouseUp>onMouseUp</api> handler, <api ToolEvent#delta>event.delta</api> would describe the difference between the position where the mouse was clicked and the position where the mouse was released.

For example, if we would want to make a tool that creates circles through mouse interaction, we could write something like:

<paperscript height=320 width=540 style='background:#e4e1e1' split=true>
function onMouseUp(event) {
	var circle = new Path.Circle({
		center: event.middlePoint,
		radius: event.delta.length / 2
	});
	circle.strokeColor = 'black';
	circle.fillColor = 'white';
}
</paperscript>

This small script creates a circular path whenever you click, drag and release. It uses the position where the mouse was clicked (<api ToolEvent#downPoint>event.downPoint</api>) for the center point of the circle, and the distance between the down point and the position where the mouse was released (the <api Point#length>length</api> of <api ToolEvent#delta>event.delta</api>) for its radius.


<title>Minimum Distance</title>
Normally while dragging, the <api Tool#onMouseDrag>onMouseDrag</api> handler is called, no matter how far the mouse has dragged. We can set the minimum distance the mouse has to drag before firing the <api Tool#onMouseDrag>onMouseDrag</api> event by setting the <api Tool#minDistance>tool.minDistance</api> property.

For example, in the following tool script the <code>onMouseDrag</code> function is only called when the mouse has moved more than 20 points.

So when you click and drag in the following example, you will see that the radius of the circles is always 20pt or higher.

<paperscript height=320 width=540 style='background:#e4e1e1' split=true>
tool.minDistance = 20;

function onMouseDrag(event) {
	var circle = new Path.Circle({
		center: event.middlePoint,
		radius: event.delta.length / 2
	});
	circle.fillColor = 'black';
}
</paperscript>

<title>Maximum Distance</title>

We can also set the maximum distance until the firing of the next <api Tool#onMouseDrag>onMouseDrag</api> event by setting the <api Tool#maxDistance>tool.maxDistance</api> property. This will repeatedly fire the <api Tool#onMouseDrag>onMouseDrag</api> event until the distance between the event point and the mouse is less than <api Tool#maxDistance>tool.maxDistance</api>.

In the following code we set <api Tool#maxDistance>tool.maxDistance</api> to be 10 pt. Therefore, if the user were to drag the mouse by 50 pt, it would call the <api Tool#onMouseDrag>onMouseDrag</api> handler 5 times.

When you click and drag in the following example, you will see that when you drag fast enough the radiuses of the circles max out at 5pt. When you drag slower, the circles will be smaller.

<paperscript height=320 width=540 style='background:#e4e1e1' split=true>
tool.maxDistance = 10;

function onMouseDrag(event) {
	var circle = new Path.Circle({
		center: event.middlePoint,
		radius: event.delta.length / 2
	});
	circle.fillColor = 'black';
}
</paperscript>

<title>Fixed Distance Drag Events</title>

To set both the minimum and maximum distances we can set the <api Tool#fixedDistance>tool.fixedDistance</api> property. Then <api Tool#onMouseDrag>onMouseDrag</api> events are fired with intervals of fixed distances.

The following example creates circle shaped paths while you drag. By setting <api Tool#fixedDistance>tool.fixedDistance</api> to <code 30 />, the circles are created at strict 30pt intervals.

Click and drag below to try it out:
<paperscript height=320 width=540 style='background:#e4e1e1' split=true>
project.currentStyle.fillColor = 'black';

tool.fixedDistance = 30;

function onMouseDrag(event) {
	var circle = new Path.Circle({
		center: event.middlePoint,
		radius: event.delta.length / 2
	});
	circle.fillColor = 'black';
}
</paperscript>
<hide>
<title>Event Interval</title>
Normally the <api Tool#onMouseDrag>onMouseDrag</api> handler is only fired when you actually drag the mouse. Paper.js can also repeatedly call the <api Tool#onMouseDrag>onMouseDrag</api> with a fixed time delay after the user clicks the mouse. Setting the <api Tool#eventinterval>tool.eventInterval</api> property to an interval means the <api Tool#onMouseDrag>onMouseDrag</api> event is called repeatedly after the initial <api Tool#onMouseDown>onMouseDown</api> until the user releases the mouse:

The following example creates a path when the user clicks and then adds a segment every 30 ms at 1/30th of the distance between the last point of the path and the current mouse position.

Since the path will contains way too many points, we simplify it using <api Path#simplify() />.

Try it out by clicking and dragging below:

<paperscript height=320 width=540 style='background:#e4e1e1' split=true>
// Call the onMouseDrag function every 30 ms:
tool.eventInterval = 30;

var path;
function onMouseDown(event) {
    // If we already created a path before,
    // deselect it:
    if (path) {
        path.selected = false;
    }
    
    // Create a new path and add the first segment where
    // the user clicked:
    path = new Path();
    path.strokeColor = 'black';
    path.add(event.point);
}

function onMouseDrag(event) {
    var lastPoint = path.lastSegment.point;

    // the difference between the current position of the mouse
    // and the last segment point of the path:
    var vector = event.point - lastPoint;
    
    // the position of the new point that we will add to the path:
    var point = lastPoint + vector / 30;
    path.add(point);
}

function onMouseUp(event) {
    // Simplify the path:
    path.simplify();
    
    // Select the path to show the segment points:
    path.selected = true;
}
</paperscript>
</hide>