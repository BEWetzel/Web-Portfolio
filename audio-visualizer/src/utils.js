// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
  return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
  const getByte = () => getRandom(floor,255-floor);
  return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
  let lg = ctx.createLinearGradient(startX,startY,endX,endY);
  for(let stop of colorStops){
    lg.addColorStop(stop.percent,stop.color);
  }
  return lg;
};


const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};
const drawCircle = (ctx,x,y,radius,color) =>{
	ctx.save();
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x,y,radius,0,Math.PI * 2);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
};

const dtr = (degrees) =>{
	return degrees * (Math.PI/180);
};

// sourced from https://dev.to/lukewduncan/how-to-build-an-audio-player-with-html5-and-the-progress-element-387m
// line 69 of audio-player.js
// by Luke Duncan
const formatTimeOutput = (length) =>{
  length = Number(length);
  let minutes = Math.floor(length / 60),
    seconds_int = (length - minutes * 60),
    seconds_str = seconds_int.toString(),
    seconds = seconds_str.substr(0, 2),
    time = (minutes < 10 ? "0" + minutes : minutes) + ':' + (seconds < 10 ? "0" + seconds : seconds);

  return time;
};
  
export {makeColor, getRandomColor, getLinearGradient, goFullscreen, drawCircle,dtr, formatTimeOutput};