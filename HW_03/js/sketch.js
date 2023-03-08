let butterflyImg;
let x = 200;
let y= 200;
let initTone = true;
let pitch = 300

// Set up Tone
let osc = new Tone.AMOscillator(pitch, 'sine', 'sine').start();
let gain = new Tone.Gain().toDestination();
let pan = new Tone.Panner().connect(gain);
let ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 1.0,
  release: 0.8
}).connect(pan);
osc.connect(ampEnv);

let noise = new Tone.Noise('pink').start();
let noiseEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 1.0,
  release: 0.8
}).connect(gain);

let noiseFilter = new Tone.Filter(800, "lowpass").connect(noiseEnv);
noise.connect(noiseFilter)

function setup() {
  createCanvas(400, 400);
  butterflyImg = loadImage("libraries/butterfly2.png");
  imageMode(CENTER);
}

function draw() {
  background(220);

  push();
  translate(x, y);
  scale(.3);
  image(butterflyImg, 0, 0, butterflyImg.width*1.75, butterflyImg.height*1.75);
  pop();

  if ((frameCount % 60) === 0) {
    pitch = random(300, 1000);
  }

  text('Press spacebar to hear the butterfly song!', 150, 35);

}

function keyPressed() {
  if (keyCode === 32 && initTone === true) {
    console.log('spacebar pressed');
    Tone.start();
    initTone = false;
  }
}

function mousePressed() {
  console.log('pressed');
  ampEnv.triggerAttackRelease('8n');
  osc.frequency.setValueAtTime(pitch+300, '+1');
  ampEnv.triggerAttackRelease('4n', '+1');

  if (mouseY > 200) {
    noiseEnv.triggerAttackRelease(0.5);
  }

}