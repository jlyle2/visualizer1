
const PTS   = 20;
const R     = 500;
const SPEED = 0.005;
const blobs = [];
const BLOBS = 10;

function setup() {
  createCanvas(windowWidth, windowHeight)
  for (let i = 0; i< BLOBS; i++){
    let offsets = [];
    for (let i = 0; i < PTS; i++) {
      offsets.push(random(1000));
    }
    const x = floor(random(width));
    const y = floor(random(height));
    blobs.push(new Blobs(offsets, SPEED, x , y ))
  }
}

class Blobs{
  constructor(offsets, speed, x, y){
     this.offsets = offsets;
     this.speed = speed;
     this.x = x;
    this.y = y;
}
}

function draw() {
  background(0,0,0, 10);
  
  const t = frameCount * SPEED;
  const cx = width / 2;
  const cy = height / 2;
  stroke(255,27,0,100);
  noFill();
  blendMode(ADD);
  for (const blob of blobs) {
    blob.x += sin(t + blob.offsets[0]) * 2 ;
    blob.y += cos(t + blob.offsets[0]) * 2;
    drawBlob(blob.offsets, blob.x, blob.y, t);
  }
  blendMode(BLEND);
}

function drawBlob(offsets, cx, cy, t) {

  const pts = [];
  for (let i = 0; i < offsets.length; i++) {
    const angle = map(i, 0, offsets.length, 0, TWO_PI);
    const offset = noise(offsets[i] + t) * 200;
    const r = R + offset;
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
