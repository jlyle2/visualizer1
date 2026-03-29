// ─────────────────────────────────────────────
//  GLOBALS — things that live across frames
// ─────────────────────────────────────────────
let objects = []       // your drawable things go here
let mic, fft           // audio (if using p5.sound)
let NUMBER_OF_BUBBLES = 100
const COLOR_CHOICES = ['#FF2DD1B4', '#ca22f8b4', '#9d4dffb4', '#63C8FFB4']

class bubble {
    constructor(x, y, r) {
        let colorIndex = floor(random(COLOR_CHOICES.length))
        this.x = x
        this.y = y
        this.ax = 0
        this.ay = 0
        this.vx = random(-.1,.1)
        this.vy = random(-.1,.1)
        this.offset = random(-PI/(colorIndex+1), PI/(colorIndex+1)) + PI;
        this.r = r
        this.color = color(COLOR_CHOICES[colorIndex]);
    }

    update() {
        
        this.ax = sin(frameCount * 0.2 + this.offset) * 0.9
        this.ay = ( cos(frameCount * 0.2 + this.offset))* .9
        this.vx += this.ax + sin(frameCount * .3 + this.offset) * .7
        this.vy += this.ay + cos(frameCount * .3 + this.offset) * .7
        this.vx *= 0.8
        this.vy *= 0.8
        this.x += this.vx
        this.y += this.vy
    }

    draw() {
        noStroke()
        fill(this.color)
        ellipse(this.x, this.y, this.r * 2)
    }
}

// ─────────────────────────────────────────────
//  SETUP — runs once
// ─────────────────────────────────────────────
function setup() {
  createCanvas(windowWidth, windowHeight)  // full window
  colorMode(RGB, 255)                      // default, explicit is clearer
  frameRate(60)

  for(let i = 0; i< NUMBER_OF_BUBBLES; i++) {
    objects.push(new bubble(random(width), random(height), 20))
  }

  // Audio setup (comment out if not using)
  // userStartAudio()  // required by browsers — call from a click handler
  // mic = new p5.AudioIn()
  // mic.start()
  // fft = new p5.FFT(0.8, 1024)  // smoothing, bins
  // fft.setInput(mic)

  // Create your initial objects here
  // e.g.: for (let i = 0; i < 10; i++) objects.push(new Thing())
}

// ─────────────────────────────────────────────
//  DRAW — runs every frame (~60fps)
// ─────────────────────────────────────────────
function draw() {

  // ── 1. CLEAR / TRAIL ──────────────────────
  background(0, 0, 0, 5)                    // full clear — no trails
  // background(0, 0, 0, 20)       // semi-transparent — motion trails

  // ── 2. GET AUDIO DATA ─────────────────────
  // (comment out if not using audio)
  // let spectrum = fft.analyze()
  // let bass     = fft.getEnergy('bass')        // 0-255
  // let amplitude = mic.getLevel()              // 0-1

  // ── 3. UPDATE ─────────────────────────────
  // Move things, apply physics, react to audio
  for (let obj of objects) {
    obj.update()
    // obj.update(bass)   // pass audio data in
  }

  // ── 4. DRAW ───────────────────────────────
  // Set blend mode, then render
  blendMode(BLEND)     // normal
  // blendMode(ADD)    // glow mode — use on dark backgrounds

  for (let obj of objects) {
    obj.draw()
  }
}

// ─────────────────────────────────────────────
//  INPUT EVENTS — optional
// ─────────────────────────────────────────────
function mousePressed() {
  // fires on click
  // userStartAudio()  // must call this to unlock audio on first click
}

function keyPressed() {
  // key === 'ArrowUp', ' ', etc.
}

// ─────────────────────────────────────────────
//  RESPONSIVE — keep canvas full window on resize
// ─────────────────────────────────────────────
function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}