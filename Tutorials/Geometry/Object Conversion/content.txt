An important feature of Paper.js is its flexibility in parameter conversion when passing values to functions. In these situations, all basic types can alternatively be described as arrays or as plain JavaScript objects. Arrays are simply a listing of the default properties in their standard sequence. Some examples:

<code>
// Create a rectangle from a JS object description:
var rect = new Rectangle({ x: 10, y: 20, width: 100, height: 200 });
console.log(rect); // { x: 10, y: 20, width: 100, height: 200 }

// Define the size as an array containing [width, height]:
rect.size = [200, 300];
console.log(rect); // { x: 10, y: 20, width: 200, height: 300 }

// Change its point to a new one described by a JS object:
rect.point = { x: 20, y: 40 };
console.log(rect); // { x: 20, y: 40, width: 200, height: 300 }
</code>

Note that points are converted to sizes on the fly when required, and vice versa:

<code>
var rect = new Rectangle();
rect.point = { width: 100, height: 200 };
console.log(rect); // { x: 100, y: 200, width: 0, height: 0 }

rect.size = { x: 200, y: 400 };
console.log(rect); // { x: 100, y: 200, width: 200, height: 400 }
</code>