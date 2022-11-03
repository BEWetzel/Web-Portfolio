/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/
import * as audio from './audio.js';
// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
import * as visualizer from './visualizer.js';
import * as progressBar from './progress-bar.js';
let canvasParams = {
  topColor      : "blue",
  bottomColor   : "green",
  showNoise     : false,
  showInvert    : false,
  showEmboss    : false
}
let circleParams = {
  minRadius     : 100,
  barSpacing    : 4,
  margin        : 5,
  baseHeight    : 5,
  rotSpeed      : 0.00001,
  phylloSpeed   : 0.03,
  c             : 4
}
import * as utils from './utils.js';


// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

let currentTime, duration, currentTimeLabel;

function init(){
  
	console.log("init called");
  audio.setupWebaudio(DEFAULTS.sound1); // load the New Adventure Theme.mp3
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  visualizer.setupCanvas(canvasElement,audio.analyserNode);
  let progressElement = document.querySelector("#progressBar");
  progressBar.setupCanvas(progressElement);
  setupUI(canvasElement);
  loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state (autoplay policy
    if(audio.audioCtx.state == "suspended"){
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if(e.target.dataset.playing == "no"){
      // if track is currently paused, play it
      audio.playCurrentSound();
      e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
      // if track IS playing, pause it
    }else{
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no"; // Our CSS will set the text to "Play"
    }
  };

  // set up the time counter
  currentTime = audio.getCurrentTime();
  duration = audio.element.duration;

  currentTimeLabel = document.querySelector("#currentTime");
  currentTimeLabel.innerHTML = utils.formatTimeOutput(currentTime);

  let durationLabel = document.querySelector("#endTime");
  if(!duration){
    duration = 60;
  }
  durationLabel.innerHTML = utils.formatTimeOutput(duration);
  
  // hook up volume slider and label
  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");
  
  // set the progress bar to the starting value
  progressBar.draw(canvasParams, currentTime,duration);

  // add .oninput event to slider
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);
    //update value of the label to match the value of the slider
    volumeLabel.innerHTML = Math.round((e.target.value/2*100));
  };

  //set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // Hook up track <select>
  let trackSelect = document.querySelector("#trackSelect");
  // add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    //pause the current track if it is playing
    if(playButton.dataset.playing = "yes"){
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  // Hook up gradient colors <select>
  let radioButtonsTop = document.querySelectorAll("input[type=radio][name=top]");
	for (let r of radioButtonsTop){
		r.onchange = function(e){
		  canvasParams.topColor = String(e.target.value);
		}
  }
  let radioButtonsBottom = document.querySelectorAll("input[type=radio][name=bottom]");
	for (let r of radioButtonsBottom){
		r.onchange = function(e){
		  canvasParams.bottomColor = String(e.target.value);
		}
	}

  // Hook up noise <select>
  let noise = document.querySelector("#noiseCB");
  // add .checked event to <select>
  noise.onclick = e => {
    canvasParams.showNoise = e.target.checked;
  }

  noise.checked = canvasParams.showNoise;
  
  // Hook up invert <select>
  let invert = document.querySelector("#invertCB");
  // add .checked event to <select>
  invert.onclick = e => {
    canvasParams.showInvert = e.target.checked;
  }

  invert.checked = canvasParams.showInvert;

  // Hook up emboss <select>
  let emboss = document.querySelector("#embossCB");
  // add .checked event to <select>
  emboss.onclick = e => {
    canvasParams.showEmboss = e.target.checked;
  }

  emboss.checked = canvasParams.showEmboss;
} // end setupUI

function loop(){
  /* NOTE: This is temporary testing code that we will delete in Part II */
    requestAnimationFrame(loop);
    visualizer.draw(canvasParams,circleParams);
    currentTime = audio.getCurrentTime();
    currentTimeLabel.innerHTML = utils.formatTimeOutput(currentTime);
    progressBar.draw(canvasParams, currentTime, duration);
}

export {init};