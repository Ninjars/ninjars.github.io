/*
Game of Life
Implementation by Jez
*/

//vars
var canvas;
var ctx;

var bornLower = 3; //this many adjacent cells make cell live
var bornUpper = 3;
var surviveLower = 2; //lower bound for survival of live cells
var surviveUpper = 3; //upper bound for survival of live cells
var randomConfig = true;

var cellCount = 30; //number of cells in each row and column
var cellSize; //calculated dynamically based on canvas size and cellCount
var padding = 3; //pixel spacing between each cell

var frameCounter = 0;
var updateRate = 15; //updates per second, assuming frame rate of 60
var lifeCycleCounter = 0;
var lifeCycle = 1; //updates per lifecycle - same as updateRate should give a lifecycle per second

var cells;

var outBounds;
var clicked = {pressed:false, out:false}; //tracks which cell has been clicked on n stuff...

//style
var rounded = false;

//button flags
var running = true;

//colours
var strokeButtonBorder = "rgba(90,90,90,1)";
var fillLiveCell = "rgba(60,60,60,0.8)";
var fillDeadCell = "rgba(40,40,40,0.2)";
var fillBackground = "rgba(0,0,0,0)";
var fillHighlightColor = "rgba(256,256,256,1)"

function init() {
	canvas = document.getElementById('GoL');
	canvas.width = canvas.offsetWidth; //get dimensions from the canvas element
	canvas.height = canvas.offsetHeight;
	canvas.onselectstart = function () { return false; }
	 
	if (!canvas.getContext){ 
		alert("Sorry, your browser does not support html 5 canvas. Please upgrade your browser, or use Firefox or Chrome.");
		return;
	}
	ctx = canvas.getContext("2d");		  
	 
	var h = canvas.height;
	cellSize = (h - (cellCount+1)*padding)/cellCount; //assume height is the shortest dimension, and we are going for a square grid
	 
	cells = [];
	var tx=0, ty=0, z=0; //tx and ty are the origin, z is a counter to uniquely identify each cell
	for (var x=0;x<cellCount;x++) {
		tx=padding;
		ty+=padding;
		for (var y=0;y<cellCount;y++) {
			if (randomConfig) {
				var state = randomBool()
			}
			cells.push({x:Math.round(tx), y:Math.round(ty),
			gx:x, gy:y, o:z, live:state, lastLive:state}); //gx and gy give the cell's grid coordinates, live is for a boolean state of active/inactive, lastLive for simultaneous generatino
						
			tx += cellSize + padding;
			z++;
		}			 
		ty += cellSize;
	}
	//let each cell know who his neighbour is - hugely expensive, must be an easier way; changing the 'cells' structure into nested arrays linked by column would make is simpler
	for (var c in cells) {
		cells[c].adjacentCells = getAdjacentCells(cells[c].gx, cells[c].gy);
	}	
	draw();	 
}

function randomBool() {
  var ran_number = Math.random()
  if (ran_number > 0.2) {
    return false;
	} else {
	 return true;
	}
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
			} else if (0 <= x1 < cellCount && 0 <= y1 < cellCount){
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
	cell = cells[c];
	ctx.globalCompositeOperation = "source-over";
	ctx.strokeStyle = strokeButtonBorder;
	if (rounded) {
		roundedRect(ctx,cell.x,cell.y,  cellSize,cellSize,5);
		ctx.stroke();
	} else {
		ctx.strokeRect(cell.x,cell.y, cellSize,cellSize);
	}
			
	 if (cell.live) {
		ctx.fillStyle = fillLiveCell;
		if (rounded) {
	 	 	 roundedRect(ctx,cell.x,cell.y,  cellSize,cellSize,5);
	 	 	 ctx.fill();
	 	} else {
	 		ctx.fillRect(cell.x,cell.y, cellSize,cellSize);
	 	}
	 } else {
	 	 ctx.fillStyle = fillDeadCell;
	 	 if (rounded) {
	 	 	 roundedRect(ctx,cell.x,cell.y,  cellSize,cellSize,5);
	 	 	 ctx.fill();
	 	 } else {
	 	 	 ctx.fillRect(cell.x,cell.y, cellSize,cellSize);
	 	 }
	 	 
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
		counter = 0;
		cell = cells[c];
		for (var a in cell.adjacentCells) {
			if (cell.adjacentCells[a].lastLive == true){
				counter += 1;
			}
		}
		if (cell.live == false && bornLower <= counter && counter <= bornUpper) {
			cell.live = true;
		} else if (counter < surviveLower || counter > surviveUpper) {
			cell.live = false;
		}
	}
}

function toggleGrid(x,y) {
	var clickedCell = getGrid(x,y);
	if (clickedCell != null) { //check that there is a cell being passed
		if (clicked.lastCell == null || clickedCell.o != clicked.lastCell.o) {
			if (clickedCell.live == true) {
				clickedCell.live = false;
			} else {
				clickedCell.live = true;
			}
			clicked.lastCell = clickedCell;
			drawCell(clickedCell.o);
		}
	}
}

function getGrid(x,y) {
	var cell;
	for (var c in cells) {
			cell = cells[c];
			if (cell.x <= x && 
				 x <= (cell.x+cellSize) && 
				cell.y <= y &&
			y <= (cell.y+cellSize)) {
		 return cell;
		}	 
	}	 
	return null;
}

// mainloop established using info at http://www.playmycode.com/blog/2011/08/building-a-game-mainloop-in-javascript/
function mainloop() {
	// is called every animation frame, which is the rate at which the screen refreshes.  Assumed to be 60 fps.
	if (running == true) {
		frameCounter += 1;
		if (frameCounter >= updateRate) {
			frameCounter = 0;
			lifeCycleCounter += 1;
			if (lifeCycleCounter >= lifeCycle) {
				lifeCycleCounter = 0;
				updateGeneration();
			}
			draw();
		}
	}
}

var animFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	null ;

//Live code!
$(document).ready(function(){
	init(); //hopefully this is the place to do the initialisation, before the loop kicks off...
	if ( animFrame !== null ) {
		var recursiveAnim = function() {
				mainloop();
				animFrame( recursiveAnim, canvas );
			};

			// start the mainloop
			animFrame( recursiveAnim, canvas );
	} else {
		var ONE_FRAME_TIME = 1000.0 / 60.0 ;
		setInterval( mainloop, ONE_FRAME_TIME );
	}
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
function play() {
	running = true;
}

function pause() {
	running = false;
}

function purge() {
	for (var c in cells) {
		cells[c].live = false;
		cells[c].lastLive = false;
		drawCell(c);
	}
}

function reset() {
	init();
}

