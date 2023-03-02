
let sounds = new Tone.Players({

  "thunder": "sounds/thunder.ogg",
  "bee": "sounds/beebuzzing.wav",
  "cicadas": "sounds/cicadas.wav",
  "water": "sounds/water.mp3"

})

const delay = new Tone.FeedbackDelay("8n", 0.5);

let soundNames = ["thunder", "bee", "cicadas", "water"];
let buttons = [];

let dSlider;
let fSlider;


function setup() {
  createCanvas(400, 400);
  sounds.connect(delay);
  delay.toDestination();

  soundNames.forEach((word, index) => {
    buttons[index] = createButton(word);
    buttons[index].position(index, index*70);
    buttons[index].mousePressed( () => buttonSound(word))
  })

  dSlider = createSlider(0., 1., 0.5, 0.05);
  dSlider.mouseReleased( () => {
    delay.delayTime.value = dSlider.value();
  })

  fSlider = createSlider(0., 1., 0.5, 0.05);
  fSlider.mouseReleased( () => {
    delay.feedback.value = fSlider.value();
  })


}

function draw() {
  background(0, 120, 180);
  text('Press the buttons for sound.', 10, 300)

}

function buttonSound(whichSound) {
    sounds.player(whichSound).start();
}