console.log('Hello, world');
function setup() {
    var canvas = createCanvas(windowWidth, 400);
    canvas.class('element');
    canvas.parent('sketch-holder');
}

function draw() {
}

function mouseMoved() {
	ellipse(mouseX, mouseY, 80, 80);
}