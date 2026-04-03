
const PTS   = 10;
const R     = 75;
const SPEED = 0.005;
const CENTER_SPEED = .004;
const blobs = [];
let centerBlobs = [];
let bigBlobs = [];
const BLOBS = 10;
const BIG_BLOBS = 5;
const CENTER_OFFSET_STRENGTH = 100;
const BASS_SMOOTHING = 0.96;
let TOTAL_OFFSET = 0
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
  for(let i = 0; i< BLOBS; i++)
  {
    centerBlobs.push(createBlob(true))
  }
  for(let i = 0; i < BIG_BLOBS; i++)
  {
    bigBlobs.push(createBigBlob(i))
  }
}

class Blobs{
  constructor(offsets, speed, x, y, rx, ry){
     this.offsets = offsets;
     this.speed = speed;
     this.x = x;
    this.y = y;
    this.rx = rx
    this.ry = ry
}
}

function draw() {
  update();
  fft.analyze();
  const mid = fft.getEnergy("lowMid") + fft.getEnergy("bass") + fft.getEnergy("mid") * 0.3;
  let high = fft.getEnergy("highMid") + fft.getEnergy("mid") * 0.3;
  high = 1
  
  // peak tracking
  peakMid = max(peakMid * 0.995, mid, 1);
  peakHigh = max(peakHigh * 0.995, high, 1);
  
  rollingMid = rollingMid * BASS_SMOOTHING + mid * (1 - BASS_SMOOTHING);
  rollingHigh = rollingHigh * BASS_SMOOTHING + high * (1 - BASS_SMOOTHING);

  const ratioLow = constrain(mid / rollingMid, 1, 2);
  const ratioHigh = constrain(high / rollingHigh, 1, 2);
// Increase peak decay so peaks track higher values
peakMid = max(mid, peakMid * 0.995);   // was probably 0.99 or lower
peakHigh = max(high, peakHigh * 0.995);
// Widen the absHigh constrain ceiling so it has room to move
const absLow = constrain(map(mid, 0, peakMid, 0.8, 2), 0.5, 2);
const absHigh = constrain(map(high, 0, peakHigh, 0.8, 2), 0.5, 2);

// Also widen bestHigh ceiling
const bestLow = constrain(ratioLow * absLow, 1, 3);
const bestHigh = constrain(ratioHigh * absHigh, 0.5, 3);
const excitementMultiplyer1 = map(bestLow, 1, 3, 0.5, 3)
  const excitementValue = map(bestHigh, 1, 3, .001, .05)
  TOTAL_OFFSET += TOTAL_OFFSET > 100000 ? excitementValue : -excitementValue
  background(0,0,0, 20);
  const t = frameCount * SPEED;
  const centerT = frameCount * CENTER_SPEED;
  const cx = width / 2;
  const cy = height / 2;
  stroke(255,40,40,250);
  blendMode(BLEND);
  noStroke();
  blendMode(ADD);
  strokeWeight(1);
  for (const blob of centerBlobs) {
    blob.x += (noise(centerT + blob.rx) - .5);
    blob.y += noise(centerT + blob.rx) * max(min(-1*sqrt(blob.rx),-1.5), -2);
    fill(170,20,14,200);
    drawBlob(blob.offsets, blob.x, blob.y, centerT, blob.rx, blob.ry, excitementMultiplyer1, 0);
  }
  for (const bigBlob of bigBlobs)
  {
  fill(170,20,14,200);
  drawBlob(bigBlob.offsets, bigBlob.x, bigBlob.y, centerT, bigBlob.rx, bigBlob.ry, excitementMultiplyer1, TOTAL_OFFSET );
  }
  blendMode(BLEND);
}

function update(){
  centerBlobs = centerBlobs.filter(b => isInFrame(b))
  if(centerBlobs.length < BLOBS)
  {
    centerBlobs.push(createBlob(false))
  }
}

function createBlob(initial){
    let offsets = [];
    let radius = max(R * pow(random(1), 2),40)
    let points = map(radius, 1, R, 5, 20)
    for (let i = 0; i < points; i++) {
      offsets.push(random(10));
    }
    let x;
    let portion = width/3
    if (random() < 0.5) {
        x = random(portion);               // left third
    } else {
        x = random(width-portion, width);        // right third
    }
    const y =initial ? random(height) : height + R * 5 ;
    return new Blobs(offsets, SPEED, x , y,  radius, radius * 1.5 )
}

function createBigBlob(i){
  let offsets = [];
  const x = i * (width/BIG_BLOBS) + random(width/(3*BIG_BLOBS));
  const distFromCenter = abs(width/2 - x) / (width/2);
  const rx = width/10 * pow(1 - distFromCenter, 1.1);  // thick at center, thin at edges
  const ry = height / 1.8;                               // always full height
  let points = 30
  for (let i = 0; i < points; i++) {
    offsets.push(random(300));
  }
  
  const y =height/2  ;
  return new Blobs(offsets, 0, x , y,  rx, ry )
}

function isInFrame(blob)
{
  return blob.y + R + R   >= 0 && blob.ry > 0;
} 

function drawBlob(offsets, cx, cy, t, rx, ry, excite, excite2) {
  const grad = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, max(rx, ry));
  grad.addColorStop(0, `rgba(255, 94, 20, 0.2)`);
  grad.addColorStop(0.2 * excite, `rgba(255, 94, 20, 0.1)`);
  grad.addColorStop(.6, 'rgba(255, 94, 20, 0.1)');
  grad.addColorStop(1, 'rgba(255, 36, 20, 0.06)');
  drawingContext.fillStyle = grad;
  drawingContext.strokeStyle = 'rgba(255,27,0,0.4)';

  const pts = [];
  for (let i = 0; i < offsets.length; i++) {
    const angle = map(i, 0, offsets.length, 0, TWO_PI);
    const offset = noise(offsets[i] + t + excite2) * (max(rx, ry) * 0.2);
    const x = cx + cos(angle) * (rx + offset);
    const y = cy + sin(angle) * (ry + offset);
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
