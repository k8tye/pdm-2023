// images
let spriteSheet;

// bird animation
let sx = 0;
let sy = 0;
let sw = 80;
let sh = 80;
let u = 0, v = 0;
let animationLength = 16;
let currentFrame = 0;

// arduino
let connectButton;
let port;
let writer, reader;
let red, green, blue;
let joySwitch = 1;
let sensorData = { };
let joyX = 0, joyY=0;
let joyIsPressed = false;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// sound
let sounds = new Tone.Players({
  "thunder": "sounds/thunder.ogg",
  "bee": "sounds/beebuzzing.wav",
  "cicadas": "sounds/cicadas.wav",
  "water": "sounds/water.mp3"
}).toDestination();

// synth
const delay = new Tone.FeedbackDelay("8n", 0.5);
const synth = new Tone.Synth().toDestination();
const seq = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
}, ["C4", "D4", "C4", "G4", "C4", "D4", "A4"]);

// buttons
let button1, button2, button3, button4;
let col;
let textColor;

// sliders
let dSlider;
let fSlider;

// load image
function preload () {
  spriteSheet = loadImage("assets/birds.png");
}

function setup() {
  createCanvas(1450, 725);
  imageMode(CENTER);

  // sound
  sounds.connect(delay);
  delay.toDestination();

  // buttons
  col = color(32, 138, 199, 200);
  col2 = color(2, 104, 163);
  col3 = color(255, 255, 255);
  textColor = color('white');
  button1 = createButton('What is a polygon?');
  button1.size(200, 45);
  button1.style('background-color', col);
  button1.style('color', textColor);
  button1.style('font-size', '18px');
  button1.position(360, 210);
  button1.mousePressed(thunder);

  button2 = createButton('Why does a flamingo lift up one leg?');
  button2.size(350, 45);
  button2.style('background-color', col);
  button2.style('color', textColor);
  button2.style('font-size', '18px');
  button2.position(575, 380);
  button2.mousePressed(bee);

  button3 = createButton('Why do seagulls like to live by the sea?');
  button3.size(400, 45);
  button3.style('background-color', col);
  button3.style('color', textColor);
  button3.style('font-size', '18px');
  button3.position(850, 575);
  button3.mousePressed(cicadas);

  button4 = createButton('What do you call a sick eagle?');
  button4.size(300, 45);
  button4.style('background-color', col);
  button4.style('color', textColor);
  button4.style('font-size', '18px');
  button4.position(50, 45);
  button4.mousePressed(water);
  //--end buttons

  // sound sliders
  dSlider = createSlider(0., 1., 0.5, 0.05);
  dSlider.position(1250, 65);
  dSlider.mouseReleased( () => {
    delay.delayTime.value = dSlider.value();
  })

  fSlider = createSlider(0., 1., 0.5, 0.05);
  fSlider.position(1100, 65);
  fSlider.mouseReleased( () => {
    delay.feedback.value = fSlider.value();
  })
  //--end sound sliders

    // arduino
  if ("serial" in navigator) {
    connectButton = createButton("Press to Connect Joystick");
    connectButton.position(50, 600);
    connectButton.mousePressed(connect);
  }

}

function draw() {
  background(154, 216, 252);
  push();
  textSize(16);
  text('Press and Hold Spacebar to Hear Music!', 1100, 110);
  text('Use Sliders to Adujst Button Sound!', 1100, 50);
  fill(0, 0, 0);
  pop();
  synth.toDestination();

  // animation
  mouseMovement();
  birdFlying();
  currentFrame++;

  // arduino
  if (reader) {
    serialRead();
  }
 
  if (writer) {
    writer.write(encoder.encode(red + "," + green + "," + blue + "," + joySwitch + "\n"))
  //writer.write(new Uint8Array([ sliderLED.value() ]));
  }

  red = sensorData.Xaxis;
  green = sensorData.Yaxis;
  blue = 0;
  joySwitch = sensorData.Switch;

  joyX = map(red, 0, 255, 0, width);
  joyY = map(green, 0, 255, 0, height);
 
  if (sensorData.Switch == 0 && !joyIsPressed) {
    joyIsPressed = true; 
    joyPressed();
  }
  if (sensorData.Switch == 1)
    joyIsPressed = false; 
  
  push();
  text("Joystick Switch: " + sensorData.Switch, 50, 650);
  text("Joystick X-axis: " + sensorData.Xaxis, 50, 670);
  text("Joystick Y-axis: " + sensorData.Yaxis, 50, 690);
  pop();
 
  push();
  noFill();
  circle(joyX, joyY, 10);
  pop();
  //--end arduino
}

function joyPressed() {
// check button bounds against joyX, joyY and call button function 
  if ((joyX >= 360) && (joyX <= 560) && (joyY >= 210) && (joyY <= 255)){
    thunder();}
  if ((joyX >= 575) && (joyX <= 925) && (joyY >= 380) && (joyY <= 425)){
    bee();}
  if ((joyX >= 850) && (joyX <= 1250) && (joyY >= 575) && (joyY <= 620)){
    cicadas();}
  if ((joyX >= 50) && (joyX <= 350) && (joyY >= 45) && (joyY <= 90)){
    water();}
}

// animation f'ns
function birdFlying(x, y) {
  u = currentFrame % animationLength;
  print(u);
  image(spriteSheet, 40 + x, 40 + y, 80, 80, u*sw, v*sh, sw, sh);
}

function mouseMovement() {
  for (x = 10; x < joyX; x = x + 90) {
    for (y = 10; y < joyY; y = y + 90) {
      push();
      noFill();
      // strokeWeight(30);
      // square(x, y, 30, 30);
      // square(x, y, 80);
      pop();
      birdFlying(x, y);
    }
  }
}

// sound f'ns
function buttonSound(whichSound) {
  sounds.player(whichSound).start();
}

function thunder() {
  sounds.player("thunder").start();
  push()
  let button1A;
  button1A = createButton('A dead parrot!');
  button1A.position(360, 260);
  button1A.size(200, 45);
  button1A.style('background-color', col2);
  button1A.style('color', textColor);
  button1A.style('font-size', '18px');
  pop()
}

function bee (){
sounds.player("bee").start();
push()
let button2A;
button2A = createButton('Because if it lifted both legs it would fall over!');
button2A.position(575, 430);
button2A.size(375, 45);
button2A.style('background-color', col2);
button2A.style('color', textColor);
button2A.style('font-size', '18px')
pop()
}

function cicadas(){
  sounds.player("cicadas").start();
  push()
  let button3A;
  button3A = createButton('Because if they lived by the bay they would be bagels!');
  button3A.position(850, 625);
  button3A.size(475, 45);
  button3A.style('background-color', col2);
  button3A.style('color', textColor);
  button3A.style('font-size', '18px')
  pop()
}

function water(){
sounds.player("water").start();
push()
let button4A;
button4A = createButton('Illegal');
button4A.position(50, 95);
button4A.size(90, 45);
button4A.style('background-color', col2);
button4A.style('color', textColor);
button4A.style('font-size', '18px');
pop()
}


function keyPressed() {
  if (keyCode === 32) {
    Tone.start();
    seq.start();
    Tone.Transport.start();
  }
}

function keyReleased() {
  if (keyCode === 32){
  seq.stop();
  }
}

// arduino f'ns
async function serialRead() {
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
   //  console.log(value);
    sensorData = JSON.parse(value);
  }
 }
 
 async function connect() {
  port = await navigator.serial.requestPort();
 
 
  await port.open({ baudRate: 9600 });
 
 
  writer = port.writable.getWriter();
 
 
  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
 }
 
 class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }
 
  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }
 
  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
 }
