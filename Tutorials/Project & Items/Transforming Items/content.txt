This tutorial explains how to move, scale and rotate items in your Paper.js project.

<note>To be able to show the difference before and after transforming items in the following examples, we create a copy of the original item which we then transform. We use <api Item#clone() /> to create a copy of an item. The original items have a black stroke and the copies have a red stroke.</note>

<title short="Changing Item Position">Changing the Position of an Item</title>

You can move an item around in the project by changing its <api Item#position /> property. This moves the item by its center point.

<image "item-position.gif" />

For example let's make a path and then move it to another position:
<paperscript height=200 split=true>
var circlePath = new Path.Circle(new Point(50, 50), 25);
circlePath.strokeColor = 'black';

// Make a copy of the path and set its stroke color to red:
var copy = circlePath.clone();
copy.strokeColor = 'red';

// Move the copy to {x: 100, y: 100}
copy.position = new Point(100, 100);
</paperscript>

Let's quickly go through the code above. In the first line we create a circle shaped path with its center point at <code>{x: 50, y: 50}</code> with a radius of 25 pt. In the second line we change the position (the center point) of the circle shaped path to <code>{x: 100, y: 100}</code>

We can also move an item by a certain amount using the <code>+=</code> operator.

The following example creates the same path as above, but instead of moving it to an absolute position, moves it 10pt to the right and 20pt down.
<code>
var circlePath = new Path.Circle(new Point(50, 50), 25);
circlePath.fillColor = 'black'
circlePath.position += new Point(10, 20);
</code>

To make an item follow the mouse, we can simply set its position to the position of the mouse. Move your mouse over the view below, to see how the item follows your mouse.

<paperscript height=200 width=540 split=true>
var circlePath = new Path.Circle(new Point(50, 50), 25);
circlePath.fillColor = 'black'

function onMouseMove(event) {
	circlePath.position = event.point;
}
</paperscript>


<title short="The Bounding Rectangle">The Bounding Rectangle of an Item</title>

When you select an item in a vector graphics application like Illustrator and select the transform tool it draws a rectangle around the item which describes its boundaries:

<image "transform-controls.gif" />

In Paper.js we can find out the dimensions of this bounding rectangle by looking at the <api Item#bounds /> property of item.

<note>
The <api Item#bounds /> property is a <api Rectangle />. Rectangles are described in detail in the <node TutorialPage-21 /> tutorial.
</note>

For example if want to know the width and height of an item, we can query the <api Item#bounds /> property for <api Rectangle#width >width</api> and <api Rectangle#height >height</api>:
<code>
var circlePath = new Path.Circle(new Point(50, 50), 25);
console.log(circlePath.bounds.width); // 50
console.log(circlePath.bounds.height); // 50
</code>

<image "bounds-width-height.gif" />

We can also find the position of the corner points of the bounding rectangle:

<code>
var circlePath = new Path.Circle(new Point(50, 50), 25);
console.log(circlePath.bounds.topLeft); // { x: 25.0, y: 25.0 }
console.log(circlePath.bounds.topRight); // { x: 75.0, y: 25.0 }
console.log(circlePath.bounds.bottomRight); // { x: 75.0, y: 75.0 }
console.log(circlePath.bounds.bottomLeft); // { x: 25.0, y: 75.0 }
</code>

<image "bounds-corner-points.gif" />

<title>Scaling Items</title>

To scale both the width and height of an item by the same amount, you can call the <api Item#scale(scale) /> of the item.

Let's make a path and then scale it by 50%:
<paperscript height=100 split=true>
var circlePath = new Path.Circle(new Point(75, 50), 25);
circlePath.style = {
	fillColor: 'white',
	strokeColor: 'black'
};

// Make a copy of the path and set its stroke color to red:
var copy = circlePath.clone();
copy.strokeColor = 'red';

// Scale the copy by 50%:
copy.scale(0.5);
</paperscript>

<title short="Scaling Around a Point">Scaling an Item Around a Center Point</title>

By default the <api Item#scale(scale) /> function scales an item around its center point. If you want to scale around a specific position, you can pass the scale function an optional center point: <api Item#scale(scale) >item.scale(scale, point)</api>.

Let's make a path and then scale it by 50% from <code>{x: 0, y: 0}</code>:
<paperscript height=100 split=true>
var circlePath = new Path.Circle(new Point(50, 50), 25);
circlePath.style = {
	fillColor: 'white',
	strokeColor: 'black'
};

// Make a copy of the path and set its stroke color to red:
var copy = circlePath.clone();
copy.strokeColor = 'red';

// Scale the copy by 50% around {x: 0, y: 0}:
copy.scale(0.5, new Point(0, 0));
</paperscript>

Since the corner positions of the <api Item#bounds /> bounding rectangle are also points, we can also pass them to the <api Item#scale(scale) >item.scale(scale, point)</api> function to act as a center point for the scale transformation.

For example, if we would want to scale an item by 50% using the top right position of the bounding rectangle:
<paperscript height=100 split=true>
var circlePath = new Path.Circle(new Point(50, 50), 25);
circlePath.style = {
	fillColor: 'white',
	strokeColor: 'black'
};

// Make a copy of the path and set its stroke color to red:
var copy = circlePath.clone();
copy.strokeColor = 'red';

// Scale the copy by 50% around the top right
// point of its bounding box:
copy.scale(0.5, circlePath.bounds.topRight);
</paperscript>

Items can also be scaled with different horizontal and vertical scales. To do this we pass two numbers to scale using <api Item#scale(sx,sy) />.

For example, we can create a path and scale it horizontally by 500% and vertically by 150%:
<paperscript height=100 width=540 split=true>
var circlePath = new Path.Circle(new Point(270, 50), 25);
circlePath.style = {
	fillColor: 'white',
	strokeColor: 'black'
};

// Make a copy of the path and set its stroke color to red:
var copy = circlePath.clone();
copy.strokeColor = 'red';

// Scale the copy:
copy.scale(5, 1.5);
</paperscript>

<title>Rotating Items</title>

To rotate an item we call the <api Item#rotate(angle) /> function and pass it the angle we want to rotate by in degrees. This will rotate the item by the angle in a clockwise direction.

Now, let's create a rectangle shaped path and rotate it by 45 degrees:

<paperscript width=540 height=150 split=true>
var path = new Path.Rectangle(new Point(50, 50), new Size(100, 50));
path.style = {
    fillColor: 'white',
    strokeColor: 'black'
};

// Create a copy of the path and set its stroke color to red:
var copy = path.clone();
copy.strokeColor = 'red';

// Rotate the copy by 45 degrees:
copy.rotate(45);
</paperscript>

To rotate in a counter-clockwise direction we pass a negative angle to the <api Item#rotate(angle) /> function:

<paperscript width=540 height=150 split=true>
var path = new Path.Rectangle(new Point(50, 50), new Size(100, 50));
path.style = {
    fillColor: 'white',
    strokeColor: 'black'
};

// Create a copy of the path and set its stroke color to red:
var copy = path.clone();
copy.strokeColor = 'red';

// Rotate the copy by -45 degrees:
copy.rotate(-45);
</paperscript>

We can repeatedly rotate the path in an <code onFrame /> handler to make an animation:

<paperscript width=540 height=150 split=true>
var path = new Path.Rectangle(new Point(50, 50), new Size(100, 50));
path.style = {
    fillColor: 'white',
    strokeColor: 'black'
};

// Create a copy of the path and set its stroke color to red:
var copy = path.clone();
copy.strokeColor = 'red';

function onFrame(event) {
	// Each frame, rotate the copy by 1 degree:
	copy.rotate(1);
}
</paperscript>

<title>Rotating Around a Point</title>

In the same way as you can pass a point to the scale function to scale around, you can also pass a point to the rotate function to rotate around.

For example, let's rotate around the bottom left point of the bounding rectangle:
<paperscript width=540 height=150 split=true>
var path = new Path.Rectangle(new Point(80, 50), new Size(100, 50));
path.style = {
	fillColor: 'white',
	strokeColor: 'black'
};


// Create a copy of the path and set its stroke color to red:
var copy = path.clone();
copy.strokeColor = 'red';

// Save the bottom left position of the path's bounding box:
var point = copy.bounds.bottomLeft;

function onFrame(event) {
    // Each frame, rotate the path 3 degrees around the point
    // we defined earlier:
    copy.rotate(3, point);
}
</paperscript>

<title>Advanced Example</title>
Lets write a more advanced script that clones an item multiple times in a loop and rotates the clones by different angles.

<note>
Cloning (copying) items is described at the end of the <node TutorialPage-874 /> tutorial.
</note>

<paperscript height=150 width=540 split=true>
var circlePath = new Path.Circle(new Point(280, 100), 25);
circlePath.strokeColor = 'black';
circlePath.fillColor = 'white';

var clones = 30;
var angle = 360 / clones;

for(var i = 0; i < clones; i++) {
	var clonedPath = circlePath.clone();
	clonedPath.rotate(angle * i, circlePath.bounds.topLeft);
};
</paperscript>

Let's go through this script line by line.

First we create the path that we will be cloning and we make a variable called <code>clones</code> where we store the amount of clones that we want:
<code>
var circlePath = new Path.Circle(new Point(150, 150), 25);
circlePath.strokeColor = 'black';
circlePath.fillColor = 'white';
var clones = 30;
</code>

In the third line, we make a variable called <code>angle</code> and pass it 360 degrees (a full rotation) divided by the amount of clones we will be making:
<code start=6>
var angle = 360 / clones;
</code>

Next, we loop the amount of times we defined in the <code>clones</code> variable:
<code start=8>
for (var i = 0; i < clones; i++) {
</code>

Basically what this line does is make a variable called <code i /> and start it with <code 0 />. Then it executes the block of code that is in between the { } brackets. After executing, it adds <code 1 /> to <code i /> and compares <code i /> to the <code clones /> variable. If <code i /> is still smaller then the <code clones /> variable, it executes the code block again.

Within the loop we clone the path using <api Item#clone() /> and rotate it by <code>angle * i</code> from the top left point of its bounding rectangle. This means that when <code i /> is <code 0 />, the cloned path is rotated by <code 0 /> * <code angle /> and when <code i /> is <code 5 /> it  rotates the cloned path by <code 5 /> * <code angle />:
<code start=9>
	var clonedPath = circlePath.clone();
	clonedPath.rotate(angle * i, circlePath.bounds.topLeft);
</code>