<title>Working with Rasters</title>
In Paper.js we refer to an image as a <api Raster />. Rasters can be moved around and transformed in your project, just like any other item.

<title>Placing Images in your Project</title>
To add an image to your project, embed the image in your page using a normal html image tag and give it an id. Then create the raster using <api Raster(id) /> and pass the id to it.

<note>Images need to already be loaded when they are added to a Paper.js project. Working with local images or images hosted on other websites may throw security exceptions on certain browsers.</note>

For our examples we will be using an image of the Mona Lisa, which is located at the bottom of this page and has <code 'mona' /> as its id.

<paperscript height=300 split=true>
// Create a raster item using the image tag with id='mona'
var raster = new Raster('mona');

// Move the raster to the center of the view
raster.position = view.center;

// Scale the raster by 50%
raster.scale(0.5);

// Rotate the raster by 45 degrees:
raster.rotate(45);
</paperscript>

<image "mona.jpg" id="mona" class="hidden" />

<title>Rasterizing Items</title>

You can rasterize any <api Item /> in your document to a <api Raster /> item, by calling <api Item#rasterize() />. The item itself is not removed automatically after rasterizing, so if you don't want the item around anymore, you have to call <api Item#remove() /> on it yourself.

<paperscript height="100" split=true>
var circle = new Path.Circle({
	center: [80, 50],
	radius: 5,
	fillColor: 'red'
});

// Create a rasterized version of the path:
var raster = circle.rasterize();

// Move it 100pt to the right:
raster.position.x += 100;

// Scale the path and the raster by 300%, so we can compare them:
circle.scale(5);
raster.scale(5);
</paperscript>

By default <api Item#rasterize() /> rasterizes the item at 72 dpi. To rasterize at a different dpi, just pass the dpi as a number the rasterize function. For example to rasterize an item at 300 dpi, you would write: <code item.rasterize(300) />.