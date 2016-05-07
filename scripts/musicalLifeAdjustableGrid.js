/*
Conway's Game of Life combined with a music matrix!
Implementation by Jez
*/

//Music
//Major pentatonic scale starting on middle C: C4 D4 E4 G4 A4
//Frequencies: 261.63 293.66 329.63 392 440
//Octave = +/- 261.63 Hz
var frequencyOrigin = 103.83; // C4 261.63, C3 130.81, G2 98.0
//var scaleSteps = [0, 2, 4, 7, 9]; //major key - steps above freqencyOrigin for each note of the scale
var scaleSteps = [0,3,5,7,10]; //minor key
var stepFreq = Math.pow(2,(1/12)); //frequency of note = frequencyOrigin * stepfreq**(steps above frequency origin)

var sampleRate = 44100;
var tempo = 10; 
console.log("tempo: " + tempo);
var beatLength = sampleRate;// /tempo; //length of a beat in samples
console.log("Beat length: " + beatLength);

var columns = []; //track live cells in each column; initiate array at start, add and remove cells in update generation
var scale = [];

//vars
var canvas;
var ctx;
var baseWidth;

var numberOfTribes = 2;
var clickTribe = 1;

var bornLower = 3; //this many adjacent cells make cell live
var bornUpper = 3;
var surviveLower = 2; //lower bound for survival of live cells
var surviveUpper = 3; //upper bound for survival of live cells

var gridWidth = 16; //number of cells in each row
var gridHeight = 15; //number of cells in each column
var cellSize; //calculated dynamically based on canvas size and cellCount
var padding = 5; //pixel spacing between each cell
var scaleFactor = 1.0; //base canvas dimension = 100 square.  On resize, cell positioning and drawing uses this scaleFactor

var frameCounter = 0;
var updateRate = tempo; //updates per second, assuming frame rate of 60
var lifeCycleCounter = 0;
var lifeCycle = gridWidth; //updates per lifecycle - same as updateRate should give a lifecycle per second

var cells;

var outBounds;
var clicked = {pressed:false, out:false}; //tracks which cell has been clicked on n stuff...

//style
var rounded = false; //just in case we want rounded cells - has some impact on performance

//flags
var running = false;
var randomConfig = false;
var ready = false;

//colours
var strokeButtonBorder = "rgba(90,90,90,1)";
var fillLiveCell = "rgba(60,60,60,0.8)";
var fillDeadCell = "rgba(40,40,40,0.2)";
var fillBackground = "rgba(0,0,0,0)";
var fillHighlightColor = "rgba(256,256,256,1)";

var tribe1Color = "rgba(221,30,47,0.8)";
var tribe2Color = "rgba(6,162,203,0.8)";
var tribe3Color = "rgba(33,133,86,0.8)";
var tribe4Color = "rgba(235,176,53,0.8)";

function init() {	
	createGrid();
	draw();	 
}

function sizeGrid() {
	//default canvas width = 100
	//var w = canvas.width; //canvas resizes to adjust to window size	
	canvas.height = (cellSize*gridHeight + ((gridHeight+1) * padding))*scaleFactor;
}


function createGrid() {
	//essentially creates/resets the grid
	//set cell size by width of canvas, resize canvas vertically to cope with resultant height of grid
	//var w = canvas.width;
	
	//var h = canvas.height;
	//compare dimensions with cells in that dimension, use smaller dimension as cellSize
	/*cell1 = (w - (gridWidth+1)*padding)/gridWidth;
	cell2 = (h - (gridHeight+1)*padding)/gridHeight;
	if (cell1 > cell2) {
		cellSize = cell2;
	} else { cellSize = cell1;}
	*/
	/*
	cellSize = (w - (gridWidth+1)*padding)/gridWidth;
	canvas.height = cellSize*gridHeight + ((gridHeight+1) * padding);
	*/
	cellSize = (baseWidth - (gridWidth+1)*padding)/gridWidth;
	sizeGrid();
	cells = [];
	var px=0, py=0, i=0; //pixel coordinates and integer identifier
	for (var x=0; x<gridWidth;x++) {
		px+=padding;
		py=padding;
		for (var y=0; y<gridHeight; y++) {
			if (randomConfig) {
				var liveOrDie = sqeuedBool();
				var state;
				if (liveOrDie) {
					state = 1;
				} else {state = 0}
			} else {
				state = 0
			}
			cells.push({x:Math.round(px), y:Math.round(py),
			gx:x, gy:y, o:i, live:state, lastLive:state});
			py+=cellSize;
			py+=padding;
			i++;
		}
		px+=cellSize;
	}
	
	//let each cell know who his neighbour is - pretty expensive, must be an easier way; changing the 'cells' structure into nested arrays linked by column would make is simpler
	for (var c in cells) {
		cells[c].adjacentCells = getAdjacentCells(cells[c].gx, cells[c].gy);
	}
	defineColumns();
	refreshColumns();
	draw();	
}

// ~~~~~~~~~ Music Functions ~~~~~~~~~~

function createScale() {
	for (var i = 0; i < gridHeight; i++) {
		scale[i] = defineNote(gridHeight - i);
		//scale[i].play();
		//console.log(scale[i]);
	}
}	

function defineNote(n) {
	//could change this to pre-calculate all notes needed, then just clone them for each note - might be more efficient?
	//var step = cellCount - n; //0 at the bottom, max at the top - now done in createScale()
	var step = n;
	var position = step%5; //5 notes in an octave, position is number of notes above octave
	var oct = (step-position)/5; //number of octaves above origin
	//var stepsFromOrigin = oct*12 + scaleSteps[position];
	var freq = frequencyOrigin * (Math.pow(stepFreq, (scaleSteps[position] + (oct*12))));
	var note = bellTone(freq, 1, 1, 1, 4, 4, 3);
	//console.log("note defined");
	//console.log("freq = " + freq);
	return note;	
}

function bellTone(freq, length, a, b, c, d, e) {
	var sampleCount = length*beatLength; //number of samples long, time defined by sample rate
	var f = freq/(sampleRate/sampleCount); //oscillation over course of note
	var samples = [];
	for (var i=0; i < sampleCount; i++) {
		var t = i/sampleCount; //time factor, running from 0 to 1
		var w = 2*Math.PI*f*t; //function of frequency and time - radius formula; position in cycle
		samples[i] = a*Math.cos(w + b*Math.sin(w*c)*Math.exp(-t*d)); //lower sin modifier gives a more mellow tone
		samples[i] *= Math.exp(-t*e); //fades value to zero at t increases
	}
	normaliseArray(samples);
	amplifyArray(samples);	
	
	var wave = new RIFFWAVE();
	var sound = new Audio();
	wave.header.sampleRate = sampleRate; //sample rate of 44KHz
	wave.header.numChannels = 1; //mono channel audio
	wave.Make(samples);	
	sound.src = wave.dataURI;
	return sound;
}

function normaliseArray(arr) {
	//hard-cap amplitude to between -1 and 1
	//scratch that - try to between 0.5 and -0.5 to leave some headroom to reduce clipping
	for (var i in arr) {
		if (arr[i] > 0.1) {
				arr[i] = 0.1;
			}else if (arr[i] < -0.1) { 
				arr[i] = -0.1;
			};
	}		
}

function amplifyArray(arr) {
	//highest volume = 128
	for (var i in arr) {
		arr[i] = 128+Math.round(127*arr[i]);
	}
}

function playColumn(x) {
	for (var i in columns[x]) {
		//console.log(columns[x][i]);
		columns[x][i].play(); //only contains notes of living cells
	}
}

// ~~~~~~~~~~~~ end music functions ~~~~~~~~~~~~

function defineColumns() {
	for (var i=0; i < gridWidth; i++) {
		columns[i] = [];
		//console.log(columns);
	}
}

function sqeuedBool() {
  var ran_number = Math.random()
  if (ran_number > 0.2) {
    return false;
	} else {
	 return true;
	}
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAdjacentCells(x,y) {
	var adjacent = [];
	var x1;
	var y1;
	//add adjacent cells to list
	for (var ox = -1; ox<2; ox++) {
		x1 = x+ox;
		for (var oy = -1; oy<2; oy++) {
			y1 = y+oy;
			if (x1 == x && y1 == y){ //don't add reference cell			
			} else if (0 <= x1 < gridWidth && 0 <= y1 < gridHeight){
				for (var c in cells) {
					if (cells[c].gx == x1 && cells[c].gy == y1) {
						adjacent.push(cells[c]);
					}
				}
			}
		}
	}
	
	return adjacent;
}

function draw() {
	// Clear and redraw background
	//ctx.globalCompositeOperation = "source-over";
	//ctx.fillStyle = fillBackground;
	//ctx.fillRect(0,0,canvas.width,canvas.height);	
	ctx.clearRect(0,0,canvas.width,canvas.height);	
	for (var c in cells) {
		drawCell(c);
	}
}

// Draw one cell
function drawCell(c) {
	var cell;
	var fillColor;
	cell = cells[c];
	//set fill colour
	if (cell.live == 0) {
		fillColor = fillDeadCell;
	} else if (cell.live == 1) {
		fillColor = tribe1Color;
	} else if (cell.live == 2) {
		fillColor = tribe2Color;
	} else if (cell.live == 3) {
		fillColor = tribe3Color;
	} else if (cell.live == 4) {
		fillColor = tribe4Color;
	}
	
	ctx.globalCompositeOperation = "source-over";
	ctx.strokeStyle = strokeButtonBorder;
	var x = cell.x*scaleFactor;
	var y = cell.y*scaleFactor;
	var size = cellSize*scaleFactor;
	if (rounded) {
		roundedRect(ctx,x,y, size,size,5);
		ctx.stroke();
	} else {
		ctx.strokeRect(x,y, size,size);
	}
			
	ctx.fillStyle = fillColor;
	if (rounded) {
		 roundedRect(ctx,x,y, size,size,5);
		 ctx.fill();
	} else {
		ctx.fillRect(x,y, size,size);
	}
}

function roundedRect(ctx,x,y,width,height,radius){  
	ctx.beginPath();  
	ctx.moveTo(x,y+radius);  
	ctx.lineTo(x,y+height-radius);  
	ctx.quadraticCurveTo(x,y+height,x+radius,y+height);  
	ctx.lineTo(x+width-radius,y+height);  
	ctx.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);  
	ctx.lineTo(x+width,y+radius);  
	ctx.quadraticCurveTo(x+width,y,x+width-radius,y);  
	ctx.lineTo(x+radius,y);  
	ctx.quadraticCurveTo(x,y,x,y+radius);  
} 

function updateGeneration() {
	var counter;
	for (var c in cells) {
		cell = cells[c];
		cell.lastLive = cell.live;
	}
	for (var c in cells) {
		counter = [0,0,0,0,0];
		cell = cells[c];
		for (var a in cell.adjacentCells) {
			counter[cell.adjacentCells[a].lastLive] += 1;
		}
		var adjacentLive = cell.adjacentCells.length - counter[0];
		if (cell.live == 0 && bornLower <= adjacentLive && adjacentLive <= bornUpper) { //birth new cell, checking for majority tribe adjacent
			counter.shift(); //remove first value
			var majority = Math.floor(indexOfHighestValue(counter)); //not convinced this is returning a propper int...
			majority += 1; //adjust for removal of counter[0]
			cell.live = majority;
			//columns[cell.gx].push(scale[cell.gy]);
		} else if (adjacentLive < surviveLower || adjacentLive > surviveUpper) {
			cell.live = 0;
			/*
			for (i in columns[cell.gx]) {
				if (columns[cell.gx][i] == scale[i]) {
					columns[cell.gx].splice(i, 1); //cut out dead notes from column
				}
			}
			*/
		}
	}
	//because i seem to be missing edge cases, I'm gonna have to iterate again to update list of living and dead cells :(
	refreshColumns();
}

function indexOfHighestValue(arr) {
	var highest = 0;
	var index = -1;
	for (var i in arr) {
		if (arr[i] > highest) {
			index = i;
			highest = arr[i];
		}
	}
	return index;
}

function refreshColumns() {
	for (var i in columns) {
		columns[i] = [];
	}
	for (var i in cells) {
		cell = cells[i];
		if (cell.live > 0) {
			columns[cell.gx].push(scale[cell.gy].cloneNode(true));
		}
	}
}

function toggleGrid(x,y) {
	var clickedCell = getGrid(x,y);
	if (clickedCell != null) { //check that there is a cell being passed
		if (clicked.lastCell == null || clickedCell.o != clicked.lastCell.o) {
			if (clickedCell.live > 0) {
				clickedCell.live = 0;
				/*
				for (i in columns[cell.gx]) {
					if (columns[cell.gx][i] == scale[i]) {
						columns[cell.gx].splice(i, 1); //cut out dead notes from column
					}
				}
				*/
			} else {
				clickedCell.live = clickTribe;
				//columns[clickedCell.gx].push(scale[clickedCell.gy]);
			}
			clicked.lastCell = clickedCell;
			refreshColumns();
			drawCell(clickedCell.o);
		}
	}
}

function getGrid(x,y) {
	var cell;
	for (var c in cells) {
		cell = cells[c];
		if (cell.x <= x/scaleFactor && 
			 x/scaleFactor <= (cell.x+cellSize) && 
			cell.y <= y/scaleFactor &&
		y/scaleFactor <= (cell.y+cellSize)) {
			console.log(cell.gx, cell.gy);
			return cell;
		}	 
	}	 
	return null;
}

function mainloop() {
	// is called every animation frame, which is the rate at which the screen refreshes.  Assumed to be 60 fps.
	if (running == true) {
		if (frameCounter < tempo) {
			frameCounter += 1;
		//console.log("Frame Tick");
		}else {
			//console.log("beat");
			frameCounter = -1;
			playColumn(lifeCycleCounter);
			lifeCycleCounter += 1;			
			draw();	
			if (lifeCycleCounter >= lifeCycle) {
				//console.log("lifecycle");
				lifeCycleCounter = 0;
				updateGeneration();
			}	
		}		
	}
}

var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	null ;



var recursiveAnim = function() {
	mainloop();
	animFrame( recursiveAnim, canvas );
}
			
function loadAudioScript() {
	$.getScript('../scripts/riffwave.js', function() {
		console.log("Generating Audio...");
		createScale();
	});
}

//Live code!
$(document).ready(function(){
	// define canvas
	canvas = document.getElementById('MainCanvas');
	canvas.width = canvas.offsetWidth; //get dimensions from the canvas element
	canvas.height = canvas.offsetHeight;
	canvas.onselectstart = function () { return false; }
	baseWidth = canvas.width;
	 
	if (!canvas.getContext){ 
		alert("Sorry, your browser does not support html 5 canvas. Please upgrade your browser, or use Firefox or Chrome.");
		return;
	}
	
	ctx = canvas.getContext("2d");	
	var container = $(canvas).parent();
	
	
	console.log("Initialising");
	loadAudioScript();
	init(); 
	if ( animFrame !== null ) {		
		// start the mainloop
		animFrame( recursiveAnim, canvas );
	} else {
		var ONE_FRAME_TIME = 1000.0 / 60.0 ;
		setInterval( mainloop, ONE_FRAME_TIME );
	}
	
	//Resize canvas when window is resized
	$(window).resize(respondCanvas);
	
	function respondCanvas() {
		canvas.width = $(container).width() - 60;
		//canvas.height = $(container).height(); //defined in sizeGrid()
		scaleFactor = canvas.width/baseWidth; //baseWidth is the original width of the canvas
		sizeGrid();
		draw(); //redraw
	}
	
	//initial call
	respondCanvas();

	$(canvas).mousedown(function(e) {
		//console.log("mouse Clicked");
		var x = e.pageX - $(this).offset().left;
		var y = e.pageY - $(this).offset().top;		
		clicked.pressed = true;
		toggleGrid(x,y);
		
	}).mouseup(function(e) {
		clicked.pressed = false;
		clicked.out = false;
		clicked.lastCell = null;
		
	}).mousemove(function(e) {				
		if (clicked.pressed) {
			var x = e.pageX - $(this).offset().left ;
			var y = e.pageY - $(this).offset().top ;
			toggleGrid(x,y);
		}
		
	}).mouseout(function(e) {
		if (clicked.pressed) {
			clicked.out = true;
			clicked.pressed = false;
		}
		
	}).mouseenter(function(e) {
		if (clicked.out) {
			clicked.pressed = true;
			clicked.out = false;
		}
	});
});

//button functions
function go() {
	running = true;
	console.log("go clicked");
}

function pause() {
	running = false;
	console.log("paused");
}

function reset() {
	randomConfig=true;
	frameCounter = 0;
	lifeCycleCounter = 0;
	createGrid();
}

function purge() {
	console.log("clear clicked");
	for (var c in cells) {
		cells[c].live = 0;
		cells[c].lastLive = 0;
	}
	pause();
	frameCounter = 0;
	lifeCycleCounter = 0;
	refreshColumns();
	draw();
}

function setTribeCount() {
	numberOfTribes = $('#tribeCount').val();
	randomConfig=true;
	createGrid();
}

function setTribeDraw(i) {
	clickTribe = i;
}

