console.log("bewLIB.js loaded");
(function(){
"use strict";
    function UpdateInfo(){

    }

	function dtr(degrees){
		return degrees * (Math.PI/180);
	}

    function drawPhyllotaxis(ctx,x,y,r,n,c,divergence){            
        // each frame draw a new dot
        // `a` is the angle
        // `r` is the radius from the center (e.g. "Pole") of the flower
        // `c` is the "padding/spacing" between the dots
        let a = n * bewLIB.dtr(divergence);
        let rCurrent = c * Math.sqrt(n);
        if(rCurrent > r){
            return;
        }
        // console.log(a,r);

        // now calculate the `x` and `y`
        x = rCurrent * Math.cos(a) + x;
        y = rCurrent * Math.sin(a) + y;
        // console.log(x,y);

        let color = `hsl(${n/5 % 361},100%,50%)`;
        //let color = getPictureColor(documentQuerrySelector("#imageSelection").value)

        bewLIB.drawCircle(ctx,x,y,2,color);

        n++;
        setTimeout(drawPhyllotaxis(ctx,x,y,r,n,c,divergence),1000/fps);
    }

	function drawCircle(ctx,x,y,radius,color){
		ctx.save();
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
    }

    function getRandomColor(){
        const getByte = _ => 0 + Math.round(Math.random() * 200);
        return `rgba(${getByte()}, ${getByte()}, ${getByte()},.8)`;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function drawRectangle(ctx,x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black",globalAlpha=1){
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.globalAlpha = globalAlpha;        
        ctx.beginPath();
        ctx.rect(x,y,width,height);
        ctx.closePath();
        ctx.fill();
        if(lineWidth > 0){
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = strokeStyle;
          ctx.stroke();
        }
        ctx.restore();
    }

    function drawLine(ctx,x1,y1,x2,y2,lineWidth=1,strokeStyle="black",globalAlpha=1){
      ctx.save();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = strokeStyle;
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.closePath();     
      ctx.stroke();
      ctx.restore();
    }

    function drawComplexCircle(ctx,x,y,r,angleStart,angleFinal,rotation=false,fillStyle="black",lineWidth=0,strokeStyle="black",globalAlpha=1){
      ctx.save();
      ctx.fillStyle = fillStyle;
      ctx.beginPath();
      ctx.arc(x,y,r, angleStart, angleFinal, rotation);                        
      ctx.closePath();   
      ctx.fill();
      if(lineWidth > 0){
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = strokeStyle;
          ctx.stroke();
        }
    }

    function getPictureColor(x,y,address){
        
    }

    function doExport(){
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
        // https://www.w3schools.com/jsref/met_win_open.asp
        const data = canvas.toDataURL(); 
        const newWindow = window.open();
        newWindow.document.body.innerHTML = `<iframe src="${data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`;
    }

    function doClear(ctx, width, height){
        drawRectangle(ctx,0,0,width,height);
    }

    window.bewLIB = {
        dtr:dtr,
        drawCircle:drawCircle,
        drawComplexCircle:drawComplexCircle,
        drawLine:drawLine,
        drawRectangle:drawRectangle,
        drawPhyllotaxis:drawPhyllotaxis,
        getPictureColor:getPictureColor,       
        getRandomInt:getRandomInt,
        getRandomColor:getRandomColor,
        doExport:doExport,
        doClear:doClear
    };
})();