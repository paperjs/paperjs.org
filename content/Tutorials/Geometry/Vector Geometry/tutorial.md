Vector geometry is a first class citizen in Paper.js. It is a great advantage to understand its basic principles when learning to write scripts for it. After all, there is a reason for the word <i>Vector</i> in <i>Vector Graphics</i>.

While building <url "http://scriptographer.org">Scriptographer</url> we found vector geometry to be a powerful way of working with positions, movement and paths. Once understood, it proves to be a lot more intuitive and flexible than working with the x- and y- values of the coordinate system directly, as most other visually oriented programming environments do.

As an example of the elegance of vector geometry, here is an interactive example of a brush tool. With only 24 lines of code, it produces a mouse tool that acts like a brush, with a variable thickness depending on speed and a sense of a natural expression.

Click and drag in the view below:
<paperscript height=420 width=540 background=black>
tool.minDistance = 10;
tool.maxDistance = 45;

var path;

function onMouseDown(event) {
	path = new Path();
	path.fillColor = new HsbColor(Math.random() * 360, 1, 1);

	path.add(event.point);
}

function onMouseDrag(event) {
	var step = event.delta / 2;
	step.angle += 90;
	
	var top = event.middlePoint + step;
	var bottom = event.middlePoint - step;
	
	path.add(top);
	path.insert(0, bottom);
	path.smooth();
}

function onMouseUp(event) {
	path.add(event.point);
	path.closed = true;
	path.smooth();
}
</paperscript>

This script is developed step by step in the <node TutorialPage-30 /> tutorial, along with explanations about each line of code. But before looking at such an applied example, it is crucial to understand the basic principles of vector geometry outlined here.

<title>Points and Vectors</title>

In many ways, vectors are very similar to points. Both are represented by x and a y coordinates. But while points describe absolute positions, vectors represent a relative information; a way to get from one point to another. Here a step-by-step example that explains the relation between vectors and points.

<image "Points-And-Vectors-01.gif">
We start by creating two <node TutorialPage-21 anchor="point">Point</node> objects to describe two absolute locations in the document, defined by their coordinate values:
<code>
var point1 = new Point(50, 50);
var point2 = new Point(110, 200);
</code>
</image>

<image "Points-And-Vectors-02.gif">
In order to get from <code point1 /> to <code point2 />, we can say we need to move <code 60 /> to the right (in x-direction), and <code 150 /> down (in y-direction). These values are the result of subtracting the x- and y-coordinates of <code point1 /> from the ones of <code point2 />:
<code>
var x = point2.x - point1.x;
// = 110 - 50 = 60
var y = point2.y - point1.y;
// = 200 - 50 = 150;
</code>
In other words, by adding these two values to the coordinates of <code point1 />, we end up at <code point2 />.
</image>

<image "Points-And-Vectors-03.gif" >
Instead of using these two separate values, it is much easier to use a vector as a container for the them. To calculate this vector, we can simply subtract <code point1 /> from <code point2 /> instead of the two separate subtractions in the previous step:

<code>
var vector = point2 - point1;
// = { x: 110, y: 200 } - { x: 50, y: 50 }
// = { x: 60, y: 150 }
</code>

<note>
Read more about mathematical operations in the <node TutorialPage-23 anchor="mathematical-operations" /> tutorial.

The result of this subtraction (<code vector />) is still a <node TutorialPage-21 anchor="point">Point</node> object. Technically, there is no distinction between points and vectors. It is just their meaning that changes: A point is absolute, a vector is relative.
</note>

</image>

<image "Points-And-Vectors-04.gif" >
Vectors can also be described as arrows. Similar to arrows, they point in a certain direction, and also indicate an amount of distance to move in that direction. An alternative and often more useful way of describing a vector is therefore by angle and length.

The Point object exposes this alternative notation through the <api Point#angle /> and <api Point#length /> properties, which both can be modified too.

<code>
console.log(vector.length);
// 161.55494
console.log(vector.angle);
// 68.19859
</code>

<note>
By default, all angles in Paper.js are measured in degrees. Read more about angles and rotation in the chapter about <url #rotating-vectors-and-working-with-angles>Rotating Vectors</url>.
</note>

</image>

It is so important that we repeat it again: Vectors contain relative information. All a vector tells us is in which direction and how far to move.

The easiest use of such a vector is to add it to an absolute position of a point. The result will again be an absolute point, which will be at a position shifted from the originating point by the amount specified by the vector. In this way we can add the same vector to many points, as illustrated in the image bellow. The vectors you see are all the same, but the points resulting from adding it to a group of existing points in different locations all differ.

<image "Vectors.gif" />

<title>Calculating with Vectors</title>

As shown by the simple examples above, the power of vectors really comes into play when we use them in mathematical calculations, treating them as if they were simple values. Here an overview of the different possible operations.

<title short="Addition and Subtraction">Vector Addition and Subtraction</title>

A vector can be added to another, and the result is the same as if we superposed two descriptions of how to get from one place to another, resulting in a third vector.

<image "Vector-Addition-01.gif">
We start with four points:
<code>
var point1 = new Point(50, 0);
var point2 = new Point(40, 100);

var point3 = new Point(5, 135);
var point4 = new Point(75, 170);
</code>
As seen in <url #points-and-vectors>Points and Vectors</url>, we can now calculate the two vectors by subtracting the points from each other:
<code>
var vector1 = point2 - point1;
// = { x: 40, y: 100 } - { x: 50, y: 0 }
// = { x: -10, y: 100 }

var vector2 = point4 - point3;
// = { x: 75, y: 170 } - { x: 5, y: 135 }
// = { x: 70, y: 35 }
</code>
</image>

<image "Vector-Addition-02.gif">
To start at <code startPoint />, follow <code vector1 /> and then <code vector2 />, we could first add <code vector1 /> to the <code startPoint />, retrieve the resulting <code tempPoint /> and then add <code vector2 /> to that to get to the desired <code endPoint />.
<code>
var tempPoint = startPoint + vector1;
var endPoint = tempPoint + vector2;
</code>
But if we would like to apply the same combined vector to many points, this calculation would be unnecessarily complicated, as we would have to go through the <code tempPoint /> each time.
</image>

<image "Vector-Addition-03.gif">
Instead, we can just add <code vector1 /> to <code vector2 /> and use the resulting object as a new vector that describes the combined movement.
<code>
var vector = vector1 + vector2;
</code>
</image>

<image "Vector-Addition-04.gif">
But we can also do the opposite and subtract a vector from another instead of adding it. The result is the same as if we would go in the opposite direction of the vector that we are subtracting.
<code>
var vector = vector1 - vector2;
</code>
</image>

<note>
The results of these operations is the same as the addition or subtraction of each vector's x and y coordinates. It would not work however to add or subtract the length or angle values.
</note>

<title short="Multiplication and Division">Vector Multiplication and Division</title>

It is quite easy to imagine what a multiplication or division with a numerical value would do to a vector: Instead of saying "go 10 meters into that direction", it would for example correspond to "3 times 10 meters into that direction". A multiplied vector does not change its angle. But its length is changed, by the amount of the multiplied value.

<image "Vector-Multiplication.gif">
<code>
var bigVector = smallVector * 3;
</code>
Or, to go the other way:
<code>
var smallVector = bigVector / 3;
</code>
</image>
<note>
Due to a limitation of Javascript, we need to make sure that the vector to be multiplied or divided is on the left-hand side of the operation. This is because the left-hand side defines the nature of the type returned from the operation. To write the following would therefore produce invalid results:
<code>
var bigVector = 3 * smallVector;
</code>
</note>

<title>Changing a Vector's Length</title>

So we learned that multiplying or dividing a vector changes its length without modifying its angle. But we can also change the <code length /> property on vector objects directly:

<image Vector-Length-01.gif>
First we create a vector by directly use the Point constructor, since vectors and points are actually the same type of objects:
<code start=1>
var vector = new Point(24, 60);
console.log(vector.length);
// 64.62198
</code>

Now we change the vector's length property. This is similar to the multiplication in the previous example, but modifies the object directly:
<code start=4>
vector.length = vector.length * 3;
console.log(vector.length);
// 193.86593
</code>
</image>

<image Vector-Length-02.gif>
We can also set the length to a fixed value, stretching or shrinking the vector to this length:
<code start=7>
vector.length = 100;
</code>
</image>

Another way to change the vector's length is the <api Point#normalize() /> method. In Mathematics to normalize a vector means to resize it so its length is 1. <code normalize() /> handles that for us, and also accepts an optional parameter that defines the length to normalize to, if we would like it to be other than 1.

We start with the same vector as in the example above on line 1. Let's look at the normalized version of this vector:
<code>
var vector = new Point(24, 60); 
var normalizedVector = vector.normalize();
console.log(vector.length);
// 64.62198
console.log(normalizedVector.length);
// 1
</code>
Note that the length of <code normalizedVector /> is now 1, while the original vector remains unmodified. <code normalize() /> does not modify the vector it is called on, instead it returns a new normalized vector object.

Now what happens if we normalize to 10 instead?
<code start=7>
var normalizedVector = vector.normalize(10);
console.log(normalizedVector.length);
// 10
</code>
As expected, the returned vector has a length of 10. Note that we could also multiply the first normalized vector with 10:
<code start=10>
var normalizedVector = vector.normalize() * 10;
console.log(normalizedVector.length);
// 10
</code>

<title short="Rotating Vectors">Rotating Vectors and Working with Angles</title>

Rotating vectors is a powerful tool for constructing paths and shapes, as it allows us to define a relative direction at a certain angle rotated away from another direction, for example sideways. The <node TutorialPage-30 /> tutorial shows a good example of this, where rotated vectors are used to construct paths in parallel to the direction and position of the moved mouse.

<image "Angles.gif" >
All angles in Paper.js are measured in degrees, and are oriented clockwise. The angle values start from the horizontal axis and expand downwards. At 180° they flip to -180°, which is the same, since going halfway around a circle in the left or right direction results in the same position. This does not prevent you from setting angles to something higher than 180° though.
</image>

There are two ways to change the angle of a vector. The obvious one is by setting the vector's <code angle /> property to a new value. Let's first set up a vector that points 100 coordinates down and 100 to the right, and log its angle and length:

<image Rotating-Vectors-01.gif>
<code>
var vector = new Point(100, 100);
console.log(vector.angle);
// 45
</code>

Since we are going in equal amounts down and to the right, it has an angle of 45°. Let's log it's length so we can check it after we have rotated the vector:

<code>
console.log(vector.length);
// 141.42136
</code>
</image>

<image Rotating-Vectors-02.gif>
Now we rotate it by 90° clockwise by setting its angle to 45° + 90° = 135° and log the length again:

<code>
vector.angle = 135;
console.log(vector.length);
// 141.42136
</code>

Note how the length has not changed. All we changed is the vector's direction. If we log the whole vector again, we will see that its coordinates are not the same anymore:

<code>
console.log(vector);
// { x: -100, y: 100 }
</code>
</image>

<image Rotating-Vectors-03.gif>
Instead of setting the angle directly to 135, we could have also explicitly increase it by 90°:

<code>
vector.angle = vector.angle + 90;
</code>

A simpler way of writing such an increase of a value is to use the <code += /> operator, as it prevents us from writing <code vector.angle /> twice:

<code>
vector.angle += 90;
</code>
</image>

<title short="Methods and Properties">Operations, Methods and Properties</title>

Note that mathematical operations (addition, subtraction, multiplication and division) and methods such as <code rotate() /> and <code normalize() /> do not modify the involved vector and point objects. Instead, they return the result as a new  object. This means they can be chained and combined in expressions:
<code>
var point = event.middlePoint
		+ event.delta.rotate(90);
</code>
Changing a vector's <code angle /> or <code length /> on the other hand directly modifies the vector object, and can only be used outside of such expressions. Since we are directly modifying objects, we need to be careful about what we modify and use the <code clone() /> function when the original object shall not be modified.
<code>
var delta = event.delta.clone();
delta.angle += 90;
var point = event.middlePoint + delta;
</code>

<title>Vektor.js</title>

The example script below is provided as a help to familiarise yourself with the concept of vectors.

Play around with it to get a feeling for how vectors work, and try to use it to repeat the principles learned in this tutorial.

<paperscript width=540 height=540 border=true>

var values = {
	fixLength: false,
	fixAngle: false,
	showCircle: false,
	showAngleLength: true,
	showCoordinates: false
};

var vectorStart, vector, vectorPrevious;
var vectorItem, items, dashedItems;

function processVector(event, drag) {
	vector = event.point - vectorStart;
	if (vectorPrevious) {
		if (values.fixLength && values.fixAngle) {
			vector = vectorPrevious;
		} else if (values.fixLength) {
			vector.length = vectorPrevious.length;
		} else if (values.fixAngle) {
			vector = vector.project(vectorPrevious);
		}
	}
	drawVector(drag);
}

function drawVector(drag) {
	if (items) {
		for (var i = 0, l = items.length; i < l; i++) {
			items[i].remove();
		}
	}
	if (vectorItem)
		vectorItem.remove();
	items = [];
	var arrowVector = vector.normalize(10);
	var end = vectorStart + vector;
	vectorItem = new Group([
		new Path([vectorStart, end]),
		new Path([
			end + arrowVector.rotate(135),
			end,
			end + arrowVector.rotate(-135)
		])
	]);
	vectorItem.strokeWidth = 0.75;
	vectorItem.strokeColor = '#e4141b';
	// Display:
	dashedItems = [];
	// Draw Circle
	if (values.showCircle) {
		dashedItems.push(new Path.Circle({
			center: vectorStart,
			radius: vector.length
		}));
	}
	// Draw Labels
	if (values.showAngleLength) {
		drawAngle(vectorStart, vector, !drag);
		if (!drag)
			drawLength(vectorStart, end, vector.angle < 0 ? -1 : 1, true);
	}
	var quadrant = vector.quadrant;
	if (values.showCoordinates && !drag) {
		drawLength(vectorStart, vectorStart + [vector.x, 0],
				[1, 3].indexOf(quadrant) != -1 ? -1 : 1, true, vector.x, 'x: ');
		drawLength(vectorStart, vectorStart + [0, vector.y], 
				[1, 3].indexOf(quadrant) != -1 ? 1 : -1, true, vector.y, 'y: ');
	}
	for (var i = 0, l = dashedItems.length; i < l; i++) {
		var item = dashedItems[i];
		item.strokeColor = 'black';
		item.dashArray = [1, 2];
		items.push(item);
	}
	// Update palette
	values.x = vector.x;
	values.y = vector.y;
	values.length = vector.length;
	values.angle = vector.angle;
}

function drawAngle(center, vector, label) {
	var radius = 25, threshold = 10;
	if (vector.length < radius + threshold || Math.abs(vector.angle) < 15)
		return;
	var from = new Point(radius, 0);
	var through = from.rotate(vector.angle / 2);
	var to = from.rotate(vector.angle);
	var end = center + to;
	dashedItems.push(new Path.Line(center,
			center + new Point(radius + threshold, 0)));
	dashedItems.push(new Path.Arc(center + from, center + through, end));
	var arrowVector = to.normalize(7.5).rotate(vector.angle < 0 ? -90 : 90);
	dashedItems.push(new Path([
			end + arrowVector.rotate(135),
			end,
			end + arrowVector.rotate(-135)
	]));
	if (label) {
		// Angle Label
		var text = new PointText(center
				+ through.normalize(radius + 10) + new Point(0, 3));
		text.content = Math.floor(vector.angle * 100) / 100 + '°';
		text.fillColor = 'black';
		items.push(text);
	}
}

function drawLength(from, to, sign, label, value, prefix) {
	var lengthSize = 5;
	if ((to - from).length < lengthSize * 4)
		return;
	var vector = to - from;
	var awayVector = vector.normalize(lengthSize).rotate(90 * sign);
	var upVector = vector.normalize(lengthSize).rotate(45 * sign);
	var downVector = upVector.rotate(-90 * sign);
	var lengthVector = vector.normalize(
			vector.length / 2 - lengthSize * Math.sqrt(2));
	var line = new Path();
	line.add(from + awayVector);
	line.lineBy(upVector);
	line.lineBy(lengthVector);
	line.lineBy(upVector);
	var middle = line.lastSegment.point;
	line.lineBy(downVector);
	line.lineBy(lengthVector);
	line.lineBy(downVector);
	dashedItems.push(line);
	if (label) {
		// Length Label
		var textAngle = Math.abs(vector.angle) > 90
				? textAngle = 180 + vector.angle : vector.angle;
		// Label needs to move away by different amounts based on the
		// vector's quadrant:
		var away = (sign >= 0 ? [1, 4] : [2, 3]).indexOf(vector.quadrant) != -1
				? 8 : 0;
		var text = new PointText(middle + awayVector.normalize(away + lengthSize));
		text.rotate(textAngle);
		text.paragraphStyle.justification = 'center';
		value = value || vector.length;
		text.content = (prefix || '') + Math.floor(value * 1000) / 1000;
		text.fillColor = 'black';
		items.push(text);
	}
}

var dashItem;

function onMouseDown(event) {
	var end = vectorStart + vector;
	var create = false;
	if (event.modifiers.shift && vectorItem) {
		vectorStart = end;
		create = true;
	} else if (vector && (event.modifiers.option
			|| end && end.getDistance(event.point) < 10)) {
		create = false;
	} else {
		vectorStart = event.point;
	}
	if (create) {
		dashItem = vectorItem;
		vectorItem = null;
	}
	processVector(event, true);
//	document.redraw();
}

function onMouseDrag(event) {
	if (!event.modifiers.shift && values.fixLength && values.fixAngle)
		vectorStart = event.point;
	processVector(event, event.modifiers.shift);
}

function onMouseUp(event) {
	processVector(event, false);
	if (dashItem) {
		dashItem.dashArray = [1, 2];
		dashItem = null;
	}
	vectorPrevious = vector;
}
</paperscript>