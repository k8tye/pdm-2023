let buffers = new Tone.ToneAudioBuffers({
  "clickBuffer": "sounds/water-click.wav",
  "jazzBuffer": "sounds/jazz.mp3",
  "pencilBuffer": "sounds/pencil_strokes.mp3",
  "trumpetBuffer": "sounds/trumpet.mp3",
}, () => {
  console.log("buffers loaded");
});

let sounds = new Tone.Players({
  "click": "sounds/water-click.wav",
  "jazz": "sounds/jazz.mp3",
  "pencil": "sounds/pencil_strokes.mp3",
  "trumpet": "sounds/trumpet.mp3"
}).toDestination();

let button;

const synth = new Tone.Synth().toDestination();
const seq = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
	// subdivisions are given as subarrays
}, ["C4", "D4", "C4", "G4", "C4", "D4", "A4"]);

let square1;
let square2;
let square3;
let square4;
let square5;
let square6;
let square7;
let square8;
let square9;
let square10;
let currentColor;

function setup() {
  background(255);
  createCanvas(displayWidth, displayHeight);
  currentColor = 0;
  text("Press Spacebar to Hear Music!", 10, 450);
  square1 = new PaintBox(1, 1, 40, "red"); //mouseX == 1 & 41; mouseY = 1 & 41 "red"
  square2 = new PaintBox(1, 42, 40, "orange"); // mouseY == 42 & 82 "orange"
  square3 = new PaintBox(1, 83, 40, "yellow"); // mouseY == 83 & 123 "yellow"
  square4 = new PaintBox(1, 124, 40, "green"); // mouseY == 124 & 164 "green"
  square5 = new PaintBox(1, 165, 40, "cyan"); // mouseY == 165 & 205 "cyan"
  square6 = new PaintBox(1, 206, 40, "blue"); // mouseY == 206 & 240 "blue"
  square7 = new PaintBox(1, 247, 40, "magenta"); // mouseY == 247 & 287 "magenta"
  square8 = new PaintBox(1, 288, 40, "brown"); // mouseY == 288 & 328 "brown"
  square9 = new PaintBox(1, 329, 40, "white"); // mouseY == 329 & 369 "white"
  square10 = new PaintBox(1, 370, 40, "black"); // mouseY == 370 & 410 "black"
  synth.toDestination();

  button = createButton("I'M DONE!");
  button.position (10, 415);
  button.mousePressed(doneMusic);

  sounds.player("jazz").volume.value = -12;
  Tone.Transport.bpm.value = 80;
}

function draw() {
  strokeWeight(1);
  stroke(255);
  square1.appear();
  square2.appear();
  square3.appear();
  square4.appear();
  square5.appear();
  square6.appear();
  square7.appear();
  square8.appear();
  square9.appear();
  square10.appear();

  selectedColor();
  drawing(currentColor);
}

function keyPressed() {
  if (keyCode === 32) {
    Tone.start();
    console.log('Tone started');
    // sounds.player("jazz").start();
    seq.start();
    Tone.Transport.start();
  }
}

function doneMusic() {
  seq.stop();
  sounds.player("trumpet").start();
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= 40) {
    if (mouseY >= 0 && mouseY < 415) {
    sounds.player("click").start();
    }
  } else if(mouseX > 40 && mouseX <= displayWidth) {
      if (mouseY >= 0 && mouseY < 415) {
        sounds.player("pencil").start(); 
      }
  }
}

class PaintBox {
  constructor(theX, theY, theSide, theColor) {
    this.x = theX;
    this.y = theY;
    this.side = theSide;
    this.color = theColor;
  }

  appear() {
    push();
    fill(this.color);
    square(this.x, this.y, this.side)
    pop();
  }
}

function selectedColor() {
  if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 1) && (mouseY < 41)) {
    currentColor = "red";
  }
  else if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 42) && (mouseY < 82)) {
    currentColor = "orange";
  }
  else if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 83) && (mouseY < 123)) {
    currentColor = "yellow";
  }
  else if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 124) && (mouseY < 164)) {
    currentColor = "green";
  }
  else if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 165) && (mouseY < 205)) {
    currentColor = "cyan";
  }
  else if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 206) && (mouseY < 240)) {
    currentColor = "blue";
  }
  else if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 247) && (mouseY < 287)) {
    currentColor = "magenta";
  }
  else if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 288) && (mouseY < 328)) {
    currentColor = "brown";
  }
  else if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 329) && (mouseY < 369)) {
    currentColor = "white";
  }
  else if (mouseIsPressed && (mouseX > 1) && (mouseX < 41) && (mouseY > 370) && (mouseY < 410)) {
    currentColor = "black";
  }
  else {
    currentColor = currentColor;
  }
}


function drawing(currentColor) {
  push();
  if (mouseIsPressed) {
    stroke(currentColor);
    strokeWeight(3);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
  pop();
}
