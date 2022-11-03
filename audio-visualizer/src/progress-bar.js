/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

let ctx,canvasWidth,canvasHeight;


function setupCanvas(canvasElement){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
}

function draw(params={}, curentTime, duration){

    if(!duration){
        duration = 60;
    }
    //clear the board
    ctx.clearRect(0,0,canvasWidth,canvasHeight);

	// 2 - draw background
    ctx.save();
    ctx.fillStyle = params.bottomColor;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();

    // Draw Progress
    let progress = curentTime / duration * 100;
    ctx.save();
    ctx.fillStyle = params.topColor;
    ctx.fillRect(0,0, progress * (canvasWidth / 100),canvasHeight);
    ctx.restore();
    
}

export {setupCanvas,draw};