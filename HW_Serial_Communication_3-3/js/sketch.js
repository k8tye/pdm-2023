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

// buttons
let button1, button2, button3, button4;
let col;
let textColor;

// load image
function preload () {
  spriteSheet = loadImage("assets/birds.png");
}

function setup() {
  createCanvas(520, 525);
  imageMode(CENTER);

  // buttons
  col = color(32, 138, 199);
  textColor = color('white');

  button4 = createButton('TURN OFF BLUE LED');
  button4.size(200, 35);
  button4.style('background-color', col);
  button4.style('color', textColor);
  button4.style('font-size', '16px');
  button4.position(50, 100);
  button4.mousePressed(water);
  //--end buttons

    // arduino
  if ("serial" in navigator) {
    connectButton = createButton("Connect Joystick");
    connectButton.position(50, 50);
    connectButton.mousePressed(connect);
  }
}

function draw() {
  background(170, 170, 170);

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
  noFill();
  circle(joyX, joyY, 10);
  pop();
  //--end arduino
}

function joyPressed() {
  if ((joyX >= 50) && (joyX <= 250) && (joyY >= 100) && (joyY <= 135)){
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
      strokeWeight(10);
      square(x, y, 80);
      pop();
      birdFlying(x, y);
    }
  }
}

function water(){
push()
let button4A;
button4A = createButton('Good Job');
button4A.position(50, 150);
button4A.size(100, 35);
button4A.style('background-color', col);
button4A.style('color', textColor);
button4A.style('font-size', '16px');
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
