Paper.js allows you to interact with the keyboard in two ways: You can either intercept key events and respond to these, or you can check the state of a given key at any moment, to see if it is pressed or not. This tutorial explains both approaches.

<title>Receiving Key Events</title>
To receive information about key presses, define an <code>onKeyDown</code> or <code>onKeyUp</code> handler function in your script. 

In the following example, we give feedback to the user about which key was pressed / released by creating a text item and changing its content:

<paperscript height=100 split=true>
// Create a centered text item at the center of the view:
var text = new PointText(view.center);
text.paragraphStyle.justification = 'center';
text.characterStyle.fontSize = 15;
text.fillColor = 'black';

// Set the initial content of the text item:
text.content = 'Click here to focus and then press some keys.';

function onKeyDown(event) {
	// When a key is pressed, set the content of the text item:
	text.content = 'The ' + event.key + ' key was pressed!';
}

function onKeyUp(event) {
	// When a key is released, set the content of the text item:
	text.content = 'The ' + event.key + ' key was released!';
}
</paperscript>

<note>
The <code>onKeyDown</code> event is fired continuously while a key is held down.
</note>

<title>The Event Object</title>
The example above uses the <api KeyEvent#key>event.key</api> property to see which key was pressed. The <api KeyEvent>event</api> object contains several properties that describe the key event:

<api KeyEvent#key>event.key</api>: the key that was pressed.

<api KeyEvent#key>event.character</api>: the character that the key press generated. This will, for example show a capitalized A when both shift and a are pressed.

<api KeyEvent#key>event.type</api>: the type of key event, either <code>'keydown'</code> or <code>'keyup'</code>

<title short="Is that Key Pressed?">Checking Whether a Key is Pressed</title>
To check whether a key is currently being held down, we can use the <api ui.Key.isDown(key) /> function.

In the following example we create a path and add segments to it while the user drags the mouse. When the 'a' key is pressed while dragging, instead of adding new segments, we move the last segment to the position of the mouse.

<paperscript height=200 split=true>
var path;
function onMouseDown(event) {
	path = new Path();
	path.strokeColor = 'black';
	path.add(event.point);
}

function onMouseDrag(event) {
	if(Key.isDown('a')) {
		// If the 'a' key is down, change the point of
		// the last segment to the position of the mouse:
		path.lastSegment.point = event.point;
	} else {
		// If the a key is not down, add a segment
		// to the path at the position of the mouse:
		path.add(event.point);
	}
}
</paperscript>

<title>Modifier Keys</title>
The <api ToolEvent>event</api> object that is passed to mouse event handlers such as <api Tool#onMouseDown>onMouseDown</api> also contain information about which modifier keys were pressed. Modifier keys are keys that don't directly produce a character: <code>capsLock, command, control, option, shift</code>

The <api ToolEvent#modifiers/>event.modifiers</api> property is an object with boolean values for the different modifier keys. So for example, to check if the shift key is down you would do:
<code>
function onMouseDrag(event) {
	if (event.modifiers.shift) {
		// Do something when the shift key is down
	}
}
</code>

For example if we wanted to make the same example script as above, but using the shift key:

<paperscript height=200 split=true>
var path;
function onMouseDown(event) {
	path = new Path();
	path.strokeColor = 'black';
	path.add(event.point, event.point);
}

function onMouseDrag(event) {
	if(event.modifiers.shift) {
		// If the shift key is down, change the point of
		// the last segment to the position of the mouse:
		path.lastSegment.point = event.point;
	} else {
		// If the shift key is not down, add a segment
		// to the path at the position of the mouse:
		path.add(event.point);
	}
}
</paperscript>

<title>Having Fun with Keys</title>
The following example creates a path on execution and then adds segment points to it when you press one of <b>wasd</b> keys in the direction of the key.

Click in the view below so it gets keyboard focus and press one of the <b>wasd</b> keys.

<paperscript height=200 split=true>
// The starting position of the line
var position = new Point(100, 100);

// The amount we will move when one of the keys is pressed:
var step = 10;

var path = new Path();
path.strokeColor = 'black';
path.add(position);

function onKeyDown(event) {
	if(event.key == 'a') {
		position.x -= step;
	}

	if(event.key == 'd') {
		position.x += step;
	}

	if(event.key == 'w') {
		position.y -= step;
	}

	if(event.key == 's') {
		position.y += step;
	}
	path.add(position);
}
</paperscript>