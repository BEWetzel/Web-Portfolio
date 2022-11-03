console.log("index.js loaded");
(function(){
    "use strict";
	const canvasWidth = 800, canvasHeight = 600;
    const fps = 300;
    const divergence = 137.5;
    const c = 4;
	let ctx;
    let n = 0;
    let maxRadius = 100;

    window.onload = init;


	function init(){
		ctx = canvas.getContext("2d");
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		ctx.fillRect(0,0,canvasWidth,canvasHeight);
        
        //loop();

        // read changes from the inputs
        document.querySelector("#pRadius").onchange = function(e){
            maxRadius = e.target.value;
            //bewLIB.updateInfo();
        }

        // call button functionalities
        document.querySelector("#btnExport").onclick = bewLIB.doExport;
        document.querySelector("#btnClear").onclick = function(){bewLIB.doClear(ctx,canvasWidth,canvasHeight);};

        canvas.onclick = canvasClicked;
    }
    
    function canvasClicked(e){
        let rect = e.target.getBoundingClientRect();
        let mouseX = e.clientX - rect.x;
        let mouseY = e.clientY - rect.y;
        console.log(mouseX,mouseY);
    
        // draw a phyllotaxis wherever the canvas is clicked
        let x = mouseX;
        let y = mouseY;
    
        bewLIB.drawPhyllotaxis(ctx,x,y,maxRadius,n,c,divergence);
    }

    function loop(){
        setTimeout(loop,1000/fps);      

        // // Fade
        // ctx.save();       
        // ctx.fillStyle = "black";
        // ctx.globalAlpha = 10/fps;
        // ctx.fillRect(0,0,canvasWidth, canvasHeight)
        // ctx.restore();

        // each frame draw a new dot
        // `a` is the angle
        // `r` is the radius from the center (e.g. "Pole") of the flower
        // `c` is the "padding/spacing" between the dots
        let a = n * bewLIB.dtr(divergence);
        let r = c * Math.sqrt(n);
        // console.log(a,r);

        // now calculate the `x` and `y`
        let x = r * Math.cos(a) + canvasWidth/2;
        let y = r * Math.sin(a) + canvasHeight/2;
        // console.log(x,y);

        let color = `hsl(${n/5 % 361},100%,50%)`;
        // let color = bewLIB.getPictureColor(documentQuerrySelector())

        bewLIB.drawCircle(ctx,x,y,2,color);

        // restart
        if(x >= canvasWidth || x <= 0){
            n = 0;
        }

        n++;
    }
})();