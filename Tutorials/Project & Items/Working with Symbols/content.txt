<title>Working with Symbols</title>

Symbols allow you to place multiple instances of an item in your project. This can save memory, since all instances of a symbol simply refer to the original item and it can speed up moving around complex objects, since internal properties such as segment lists and gradient positions don't need to be updated with every transformation.

<title>Creating Symbols</title>

To create a symbol from an item, just pass the item to the <api Symbol(item) /> constructor. When you create a symbol using an item, that item is automatically removed from the document.

To place instances of the symbol in your project, you can call <api Symbol#place(position) /> on it, with the position where you want to place it.

For example, lets create a circle shaped path and place a few instances of it:

<paperscript height=100 split=true>
var path = new Path.Circle(new Point(20, 20), 30);
path.fillColor = 'red';

// Create a symbol from the path:
var symbol = new Symbol(path);

// Place two instances of the symbol:
symbol.place(new Point(80, 50));
symbol.place(new Point(150, 50));
</paperscript>

<title>Placed Symbols</title>

A placed instance of a symbol is a <api PlacedSymbol /> and can be manipulated like any other <api Item />.

<paperscript height=100 split=true>
var path = new Path.Circle(new Point(20, 20), 30);
path.fillColor = 'red';

var symbol = new Symbol(path);

var placed = symbol.place(new Point(80, 50));

// Scale the place symbol by 50% in y direction:
placed.scale(1, 0.5);

// Rotate the symbol by 45 degrees:
placed.rotate(45);
</paperscript>

<title>Selecting Placed Symbols</title>
When you select a <api PlacedSymbol /> by setting <api Item#selected /> to <code true />, Paper.js draws its bounding box. This allows you to see how it has been transformed.

<paperscript height=100 split=true>
var path = new Path.Circle(new Point(20, 20), 30);
path.fillColor = 'red';

// Create a symbol from the path:
var symbol = new Symbol(path);

// Place an instance of the symbol at the center of the view:
var placed = symbol.place(view.center);

// Select the placed symbol:
placed.selected = true;

// Rotate the placed symbol by 45 degrees:
placed.rotate(45);
</paperscript>

<title>Symbol Definition</title>

When you create a symbol from an item, that item becomes the definition of the symbol. Editing the definition of a symbol is reflected in all its <api PlacedSymbol /> instances.

<paperscript height=100 split=true>
var path = new Path(new Point(20, 20), new Point(50, 50));
path.style = {
    strokeColor: 'red',
    strokeWidth: 10,
    strokeCap: 'round'
};

// Create a symbol from the path:
var symbol = new Symbol(path);

// Place 30 instances of the symbol in the project in random
// positions in the view:
for (var i = 0; i < 30; i++) {
    var position = view.size * Point.random();
    var placed = symbol.place(position);
}

function onFrame(event) {
    // Each frame, rotate the definition
    // of the symbol by 1 degree:
    symbol.definition.rotate(1);
    
    // Add 0.2 degrees to the stroke color's hue:
    symbol.definition.strokeColor.hue += 0.2;
}
</paperscript>