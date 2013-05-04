<nop/>
<title>Paper.js Architecture</title>
To understand how to work with Paper.js directly from JavaScript, without the use of the PaperScript automatisms, we first need to explain a little about the architecture of Paper.js. When working with PaperScript, each script is run in its own scope, a <api PaperScope /> object. The global <api global#paper>paper</api> object through which the library is exposed is also such a <api PaperScope /> object. It helps to think of these scopes as execution contexts.

Scopes were introduced as a way to have separate PaperScript contexts on a page with many examples, each having its own view and project, without seeing each other but still sharing the library code. They could be seen as sandboxed 'plugins' with shared code.

Each scope or context holds a row of objects that describe its state, such as a list of open <api PaperScope#projects>projects</api>, a reference to the active <api PaperScope#project>project</api>, a list of <api PaperScope#views>views</api> that each represent a canvas element, the currently active <api PaperScope#view >view</api>, a list of mouse <api PaperScope#tools>tools</api>, the currently active <api PaperScope#tool>tool</api>, etc.

To explain the relation between scopes, projects, views and tools: Each scope can hold one ore multiple projects, which are displayed through one or multiple views (each representing a Paper.js canvas). Views are not associated with a specific project, but in fact render all visible projects that have items within the visible area. Tools can work on any project within any view, as long as they belong to the same scope.

<title>Setting Up a Scope</title>

When working with JavaScript directly, in most cases one scope will be all that is required. Within this scope, one can still work with multiple projects or views by creating them using the <api Project() /> and <api View(canvas) /> constructors.

The easiest way is to use the existing <api global#paper>paper</api> object, and use its <api PaperScope#setup(canvas) /> method to initialize an empty project and a view for us. We reuse the example from <node href="/tutorials/getting-started/working-with-paper-js/" /> in order to see what is additionally required when working from JavaScript directly:

<code mode="text/html">
<!DOCTYPE html>
<html>
<head>
<!-- Load the Paper.js library -->
<paperscript type="text/javascript" src="js/paper.js"></paperscript>
<!-- Define inlined JavaScript -->
<paperscript type="text/javascript">
	// Only executed our code once the DOM is ready.
	window.onload = function() {
		// Get a reference to the canvas object
		var canvas = document.getElementById('myCanvas');
		// Create an empty project and a view for the canvas:
		paper.setup(canvas);
		// Create a Paper.js Path to draw a line into it:
		var path = new paper.Path();
		// Give the stroke a color
		path.strokeColor = 'black';
		var start = new paper.Point(100, 100);
		// Move to start and draw a line from there
		path.moveTo(start);
		// Note that the plus operator on Point objects does not work
		// in JavaScript. Instead, we need to call the add() function:
		path.lineTo(start.add([ 200, -50 ]));
		// Draw the view now:
		paper.view.draw();
	}
</paperscript>
</head>
<body>
	<canvas id="myCanvas" resize></canvas>
</body>
</html>
</code>

So if we compare this example to the one written in PaperScript, we see a row of differences. In addition to the code from the previous example, we need to:
- Register a handler for when the DOM is ready, since we cannot work with the canvas before that.
- Tell the <code paper /> object to setup a <code Project /> and a <code View /> for our canvas. Instead of passing the canvas object, we can also pass the canvas element's ID as a String. In PaperScript, this happens automatically through the <code>canvas="ID"</code> attribute.
- Access all Paper.js classes and objects through the <code paper /> object, since they are no longer global.
- Use Math functions instead of operators on <api Point /> and <api Size />.
- Draw the view at the end, since that is now only automatically handled when a <api View#onFrame /> handler is installed.

<note>
All the examples in tutorials and reference assume you are using PaperScript. If you work with JavaScript directly, you need to keep these differences in mind.
</note>
<note>
In the code above we use <code>window.onload = handler</code> to get a callback for when the DOM is ready. If you are working with a framework such as jQuery, you can register for the DOM-Ready event using <code>$(document).ready(handler)</code>, which fires before onload.
</note>

<title>Making the Scope Global</title>

It might not seem so practical to access all classes and objects through the <code paper /> object, so here two strategies for circumventing that.

The most straight forward approach is to copy over all fields from the <code paper /> object into the global scope. This could be done manually, which would work well as long as there is only one project, view and tool. But with multiples of these, the global references to the active ones (<api PaperScope#project>project</api>, <api PaperScope#view>view</api> and <api PaperScope#tool>tool</api>) would not be kept up to date. Luckily there is a method for us that internally performs some JavaScript trickery so these references are kept in sync: <api PaperScope#install(scope)>paper.install(window)</api>. Equipped with this we can rewrite the code of the above example:

<code>
// Make the paper scope global, by injecting it into window:
paper.install(window);
window.onload = function() {
	// Setup directly from canvas id:
	paper.setup('myCanvas');
	var path = new Path();
	path.strokeColor = 'black';
	var start = new Point(100, 100);
	path.moveTo(start);
	path.lineTo(start.add([ 200, -50 ]));
	view.draw();
}
</code>

If polluting the global scope is really not an option, the second strategy circumvents that by using the dreaded <code>with()</code> statement. This is one half of the trickery that Paper.js applies internally for scoping each PaperScript in its own PaperScope object:

<code>
window.onload = function() {
	paper.setup('myCanvas');
	with (paper) {
		var path = new Path();
		path.strokeColor = 'black';
		var start = new Point(100, 100);
		path.moveTo(start);
		path.lineTo(start.add([ 200, -50 ]));
		view.draw();
	}
}
</code>

<title>Installing Event Handlers</title>

PaperScript recognises a couple of special event handlers when they are declared as global functions, while in JavaScript, these need to be manually installed on the appropriate object. Two such handlers are <api View#onFrame>onFrame</api> and <api View#onResize>onResize</api>, which both belong to the <api View /> class. view is automatically created for us if we use the <api PaperScope#setup(canvas) /> function as in the examples above. So all we have to do is install these handlers on the existing <api PaperScope#view>view</api> object:

<code mode="text/html">
<!DOCTYPE html>
<html>
<head>
<paperscript type="text/javascript" src="js/paper.js"></paperscript>
<paperscript type="text/javascript">
	paper.install(window);
	window.onload = function() {
		paper.setup('myCanvas');
		var path = new Path.Rectangle([75, 75], [100, 100]);
		path.strokeColor = 'black';

		view.onFrame = function(event) {
		    // On each frame, rotate the path by 3 degrees:
		    path.rotate(3);
		}
	}
</paperscript>
</head>
<body>
	<canvas id="myCanvas" resize></canvas>
</body>
</html>
</code>

<tip>
You can read more about animations in the tutorial <node href="/tutorials/animation/creating-animations/" />.
</tip>

<title>Working with Tools</title>

Just like with the view handlers, PaperScript simplifies and hides the dealing with <api Tool /> objects by making the tool handlers seem global and by creation a tool for us on the fly if any of these handlers are present: <api Tool#onMouseDown>onMouseDown</api>, <api Tool#onMouseUp>onMouseUp</api>, <api Tool#onMouseUp>onMouseDrag</api>, <api Tool#onMouseUp>onMouseMove</api>, etc.

In JavaScript we need to create the tool ourselves, and we need to manually install handlers on it. The advantage of this approach is that things are more transparent, and the handling of multiple tools will be less of a surprise.

<code mode="text/html">
<!DOCTYPE html>
<html>
<head>
<paperscript type="text/javascript" src="js/paper.js"></paperscript>
<paperscript type="text/javascript">
	paper.install(window);
	window.onload = function() {
		paper.setup('myCanvas');
		// Create a simple drawing tool:
		var tool = new Tool();
		var path;

		// Define a mousedown and mousedrag handler
		tool.onMouseDown = function(event) {
			path = new Path();
			path.strokeColor = 'black';
			path.add(event.point);
		}

		tool.onMouseDrag = function(event) {
			path.add(event.point);
		}
	}
</paperscript>
</head>
<body>
	<canvas id="myCanvas" resize></canvas>
</body>
</html>
</code>

<tip>
You can read more about mouse tools in the tutorial <node href="/tutorials/interaction/creating-mouse-tools/" />.
</tip>

<title>Multiple Tools</title>

The next example illustrates how easy it is to create multiple drawing tools and switch between them using some simple UI, in this case just two HTML links that activate one tool or the other:

<code mode="text/html">
<!DOCTYPE html>
<html>
<head>
<paperscript type="text/javascript" src="js/paper.js"></paperscript>
<paperscript type="text/javascript">
	paper.install(window);
	// Keep global references to both tools, so the HTML
	// links below can access them.
	var tool1, tool2;

	window.onload = function() {
		paper.setup('myCanvas');

		// Create two drawing tools.
		// tool1 will draw straight lines,
		// tool2 will draw clouds.

		// Both share the mouseDown event:
		var path;
		function onMouseDown(event) {
			path = new Path();
			path.strokeColor = 'black';
			path.add(event.point);
		}

		tool1 = new Tool();
		tool1.onMouseDown = onMouseDown;

		tool1.onMouseDrag = function(event) {
			path.add(event.point);
		}

		tool2 = new Tool();
		tool2.minDistance = 20;
		tool2.onMouseDown = onMouseDown;

		tool2.onMouseDrag = function(event) {
			// Use the arcTo command to draw cloudy lines
			path.arcTo(event.point);
		}
	}
</paperscript>
</head>
<body>
	<a href="javascript:tool1.activate();">Lines</a>
	<a href="javascript:tool2.activate();">Clouds</a>
	<canvas id="myCanvas" resize></canvas>
</body>
</html>
</code>