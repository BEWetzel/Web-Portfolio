import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData, rotation = 0, divergence = 137.7;


function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.6,color:"green"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
}

function draw(params={}, circleParams={}){
    // populate array with data
	analyserNode.getByteFrequencyData(audioData);
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
    
    // clear the board
    ctx.clearRect(0,0,canvasWidth,canvasHeight);

    // draw gradient
    gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,
        [{percent:0,color : params.topColor},
        {percent:.6,color : params.bottomColor}])
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();

    // call drawRects and draw phyllotaxis here to allow the image data to be processed.
    drawRects(circleParams);
    drawPhylotaxis(circleParams);

    // bitmap manipulation
    // grab all of the pixels on the canvas and put them in the `data` array
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width; 
    if(params.showNoise){   
            // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
            for(let i = 0; i < length; i += 4){
            	// C) randomly change every 20th pixel to red
                if(Math.random() < .05){
            		// data[i] is the red channel
            		// data[i+1] is the green channel
            		// data[i+2] is the blue channel
            		// data[i+3] is the alpha channel
            		data[i] = data[i+1] = data[i+2] = 0;// zero out the red and green and blue channels
                    data[i] = 255;// make the red channel 100% red
                    data[i+2] = 255; // make the blue channel 100% blue
            	} // end if
            } // end for
    }   

    if(params.showInvert){ // fixed the frame lag. Removed unnecessary variables 
            for(let i = 0; i < length; i += 4){
                    data[i] = 255 - data[i]; // set red value
                    data[i+1] = 255 - data[i+1]; // set blue value
                    data [i+2] = 255 - data [i+2]; // set the green value
                    // data[i+3] is the alpha, but we're leaving it alone
            }
    }


    if(params.showEmboss){
            for(let i = 0; i < length; i++){
                if(i%4 == 3)continue; // skip alpha
                data[i] = 127 + 2*data[i] - data[i+4] - data[i+width*4];
            }
    }
    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
    
}

// draw the audio data representation
const drawRects = (params={}) =>{
    analyserNode.getByteFrequencyData(audioData);
    let screenWidthForBars = canvasWidth - (audioData.length * params.barSpacing) - params.margin * 2;
    let barWidth = screenWidthForBars / audioData.length;

    let angles = 360 / audioData.length;
    let toRadians = angles * Math.PI/180;

    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,1)';
  
    for(let i=0; i < audioData.length; i++){
        ctx.save();
        // draw the rects in a circle around the center of the canvas
        ctx.translate(canvasWidth/2, canvasHeight/2); // center the draw
        ctx.rotate(toRadians * i + rotation); // get the rotation to draw the bar around the center of the screen

        ctx.fillRect(0, params.minRadius, barWidth, params.baseHeight+audioData[i]/4); // draw the bar
        rotation += params.rotSpeed*params.margin;
        ctx.restore();
    }
    
    ctx.restore();
}

// draw the phyllotaxis. I was hopind to do a cool representation of the waveform here
const drawPhylotaxis = (params={}) =>{
    let n = 0;
    
    for(let i = 0; i < params.minRadius * 4; i++){
        // `a` is the angle
        // `r` is the radius from the center (e.g. "Pole") of the flower
        // `c` is the "padding/spacing" between the dots
        let a = n * utils.dtr(divergence) - rotation;
        let r = params.c * Math.sqrt(n);

        // now calculate the `x` and `y`
        let x = r * Math.cos(a) + canvasWidth/2;
        let y = r * Math.sin(a) + canvasHeight/2;

        let color = `hsl(${n/5 % 361},100%,50%)`;

        utils.drawCircle(ctx,x,y,2,color);
        n++;
    }
    divergence += params.phylloSpeed;
}
export {setupCanvas,draw, drawRects};