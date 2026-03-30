// ─────────────────────────────────────────────
//  GLOBALS — things that live across frames
// ─────────────────────────────────────────────
let objects = []       // your drawable things go here
let mic, fft           // audio (if using p5.sound)
let NUMBER_OF_BUBBLES = 8
let INITIAL_DISTANCE_BETWEEN = 200
let NUM_SLICES = 4
const COLOR_CHOICES = [ '#7C13A4', '#EA00D9', '#2AAEB6']

class bubble {
    constructor(x, y, r, col) {
        let colorIndex = floor(random(COLOR_CHOICES.length))
        this.x = x
        this.y = y
        this.ax = 0
        this.ay = 0
        this.vx = random(-.1,.1)
        this.vy = random(-.1,.1)
        this.offset = 0;
        this.r = r
        this.color = color(COLOR_CHOICES[colorIndex]);
        this.squirl = .1 + random(.1)  // how much the noise "twists"
        this.angle = random(TWO_PI)       // random starting angle
        this.spin = -.05  // how fast it rotates
        
    }

    update() {
        
        this.ax = sin(frameCount * 0.01 + this.offset) * .5
        this.ay = ( cos(frameCount * 0.01 + this.offset))* .5
        this.vx += this.ax + sin(frameCount * this.squirl + this.offset) * 1
        this.vy += this.ay + cos(frameCount * this.squirl + this.offset) * 1
        this.vx *= 0.8
        this.vy *= 0.8
        this.x += this.vx
        this.y += this.vy
        this.angle += this.spin

    }

    draw() {
      const cx = width / 2
      const cy = height / 2
  
      for (let slice = 0; slice < NUM_SLICES; slice++) {
          drawingContext.save()
          
          // rotate this slice around canvas center
          drawingContext.translate(cx, cy)
          drawingContext.rotate(slice * TWO_PI / NUM_SLICES)
          if (slice % 2 === 0) drawingContext.scale(1, -1)  // mirror alternating
          drawingContext.translate(-cx, -cy)
  
          // ── your existing code unchanged below ──
  
              noStroke()
              let r = red(this.color)
              let g = green(this.color)
              let b = blue(this.color)
  
              drawingContext.save()
              drawingContext.translate(
                  this.x + cos(this.angle) * this.offset,
                  this.y + sin(this.angle) * this.offset
              )
              drawingContext.rotate(this.angle * PI / 3)
  
              let grad = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.r*2)
              grad.addColorStop(0,    `rgba(${r},${g},${b},0.008)`)
              grad.addColorStop(.3,    `rgba(${r},${g},${b},0.006)`)
              grad.addColorStop(0.6, `rgba(${r},${g},${b},0.0002`)
              grad.addColorStop(1,  `rgba(${r},${g},${b},0.0001)`)
  
              drawingContext.fillStyle = grad
              drawingContext.beginPath()
              drawingContext.roundRect(
                  -this.r, -this.r * 2,
                  this.r * 2, this.r * 4,
                  this.r * 0.5
              )
              drawingContext.fill()
              drawingContext.restore()
        
          // ── end your existing code ──
  
          drawingContext.restore()  // restore the slice rotation
      }
  }
}

// ─────────────────────────────────────────────
//  SETUP — runs once
// ─────────────────────────────────────────────
function setup() {
  createCanvas(windowWidth, windowHeight)  // full window
  colorMode(RGB, 255)                      // default, explicit is clearer
  frameRate(60)
let cols = 10
let rows = ceil(NUMBER_OF_BUBBLES / cols)

let startX = (width / 2) - ((INITIAL_DISTANCE_BETWEEN * cols) / 2)
let startY = (height / 2) - ((INITIAL_DISTANCE_BETWEEN * rows) / 2) + 50

for (let i = 0; i < NUMBER_OF_BUBBLES; i++) {
    let col = i % cols
    let row = floor(i / cols)
    objects.push(new bubble(
        startX + INITIAL_DISTANCE_BETWEEN * col,
        startY + INITIAL_DISTANCE_BETWEEN * row,
        150,
        col
    ))
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

    // reset blend mode FIRST so background clears correctly
    blendMode(BLEND)
    background(0, 0, 0, 5)   // now this actually fades

    blendMode(ADD)             // glow mode for bubbles
    for (let obj of objects) {
        obj.update()
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