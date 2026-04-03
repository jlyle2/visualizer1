
const PTS   = 20;
const R     = 500;
const SPEED = 0.005;
const CENTER_SPEED = .01;
const blobs = [];
const centerBlobs = [];
const BLOBS = 15;
const CENTER_OFFSET_STRENGTH = 200;
const BASS_SMOOTHING = 0.99;
let fft;
let mic;
let rollingMid = 0;
let rollingHigh = 0;
let baseEffect = 10;

function setup() {
  mic = new p5.AudioIn();
  mic.start();
  
  fft = new p5.FFT();
  fft.setInput(mic);
  createCanvas(windowWidth, windowHeight)
  for (let i = 0; i< BLOBS; i++){
    let offsets = [];
    for (let i = 0; i < PTS; i++) {
      offsets.push(random(1000));
    }
    const x = floor(random(width));
    const y = floor(random(height));
    blobs.push(new Blobs(offsets, SPEED, x , y, R ))
  }

  for (let i = 2; i< 6; i++){
    let offsets = [];
    for (let i = 0; i < 6; i++) {
      offsets.push(random(100));
    }
    const x = width / 2;
    const y = height / 2;
    centerBlobs.push(new Blobs(offsets, SPEED, x , y, R / (1.1*i)  ))
  }
}

class Blobs{
  constructor(offsets, speed, x, y, r){
     this.offsets = offsets;
     this.speed = speed;
     this.x = x;
    this.y = y;
    this.r = r;
}
}

function draw() {
  fft.analyze();
  const mid = fft.getEnergy("lowMid");
  rollingMid = rollingMid * BASS_SMOOTHING + mid * (1 - BASS_SMOOTHING);
  const high = fft.getEnergy("highMid");
  rollingHigh = rollingHigh * BASS_SMOOTHING + high * (1 - BASS_SMOOTHING);


  const excitement = constrain(mid / rollingMid, 0.9, 3.0);
  const excitementHigh = constrain(mid / rollingHigh, 0.9, 3.0);
  const excitementMultiplyer1 = map(excitement, 0.9, 3.0, 1, 300)
  const excitementMultiplyer2 = map(excitementHigh, 0.9, 3.0, 2, 5)
  const excitementMultiplyer3 = map(excitement, 0.9, 3.0, 0, 1)
  background(0,0,0, 15);
  
  const t = frameCount * SPEED;
  const centerT = frameCount * CENTER_SPEED;
  const cx = width / 2;
  const cy = height / 2;
  stroke(255,27,0,100);
  strokeWeight(1);
  noFill();
  blendMode(ADD);
  for (const blob of blobs) {
    blob.x += sin(t + blob.offsets[0]) * .01 ;
    blob.y += cos(t + blob.offsets[0]) * .01;
    drawBlob(blob.offsets, blob.x, blob.y, t, blob.r);
  }
  stroke(150,150,150,100);
  blendMode(ADD);
  strokeWeight(1 * excitementMultiplyer2);
  for (const blob of centerBlobs) {
    blob.x += (noise(centerT + blob.offsets[0]) - 0.5) * .2;
    blob.y += (noise(centerT + blob.offsets[1]) - 0.5) * .2;
    drawBlob(blob.offsets, blob.x, blob.y, centerT, blob.r, CENTER_OFFSET_STRENGTH + excitementMultiplyer1);
  }
  blendMode(BLEND);
}

function drawBlob(offsets, cx, cy, t, radius, offsetStrength = 200) {

  const pts = [];
  for (let i = 0; i < offsets.length; i++) {
    const angle = map(i, 0, offsets.length, 0, TWO_PI);
    const offset = noise(offsets[i] + t) * offsetStrength;
    const r = radius + offset;
    const x = cx + cos(angle) * r;
    const y = cy + sin(angle) * r;
    pts.push([x, y]);
  }

  beginShape();
  curveVertex(...pts[pts.length - 1]);
  for (let i = 0; i < offsets.length; i++) {
    curveVertex(...pts[i]);
  }
  curveVertex(...pts[0]);
  curveVertex(...pts[1]);
  endShape();
}
