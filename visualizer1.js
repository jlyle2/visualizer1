
const PTS   = 20;
const R     = 500;
const SPEED = 0.005;
const CENTER_SPEED = .004;
const blobs = [];
const centerBlobs = [];
const BLOBS = 8;
const CENTER_OFFSET_STRENGTH = 100;
const BASS_SMOOTHING = 0.98;
let peakMid = 0;
let peakHigh = 0;
let fft;
let mic;
let rollingMid = .001;
let rollingHigh = .001;
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

  for (let i = 2; i< 9; i++){
    let offsets = [];
    for (let i = 0; i < 9; i++) {
      offsets.push(random(10));
    }
    const x = width / 2;
    const y = height / 2;
    centerBlobs.push(new Blobs(offsets, SPEED, x , y, R / (1.5*i)  ))
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
  const mid = fft.getEnergy("lowMid") + fft.getEnergy("bass") + fft.getEnergy("mid") * 0.3;
  const high = fft.getEnergy("highMid") + fft.getEnergy("treble") + fft.getEnergy("mid") * 0.3;
  
  // peak tracking
  peakMid = max(peakMid * 0.995, mid);
  peakHigh = max(peakHigh * 0.995, high);
  
  rollingMid = rollingMid * BASS_SMOOTHING + mid * (1 - BASS_SMOOTHING);
  rollingHigh = rollingHigh * BASS_SMOOTHING + high * (1 - BASS_SMOOTHING);

  const excitementLow = constrain(mid / rollingMid, 0.9, 2);
  const excitementHigh = constrain(high / rollingHigh, 0.9, 2);
  const absLow = map(mid, 0, peakMid, 0.9, 2);
  const absHigh = map(high, 0, peakHigh, 0.9, 2);
  const bestLow = max(excitementLow, absLow);
  const bestHigh = max(excitementHigh, absHigh);

  const excitementMultiplyer1 = map(bestLow, .9, 2, 1, 100)
  const excitementMultiplyer2 = map(bestHigh, .9, 2, 1, 5)
  background(0,0,0, 10);
  
  const t = frameCount * SPEED;
  const centerT = frameCount * CENTER_SPEED;
  const cx = width / 2;
  const cy = height / 2;
  stroke(255,27,0,100);
  strokeWeight(1*excitementMultiplyer2);
  noFill();
  blendMode(ADD);
  for (const blob of blobs) {
    blob.x += sin(t + blob.offsets[0]) * .01 ;
    blob.y += cos(t + blob.offsets[0]) * .01;
    drawBlob(blob.offsets, blob.x, blob.y, t, blob.r);
  }
  stroke(255,255,255, 100);
  blendMode(BLEND);
  strokeWeight(.5* excitementMultiplyer2);
  for (const blob of centerBlobs) {
    blob.x += (noise(centerT + blob.offsets[0]) - 0.5) * .2;
    blob.y += (noise(centerT + blob.offsets[1]) - 0.5) * .2;
    noFill();
    // fill(250,80,0,200 * excitementMultiplyer3);
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
