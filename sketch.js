// ─────────────────────────────────────────────
//  GLOBALS — things that live across frames
// ─────────────────────────────────────────────
let objects = []       // your drawable things go here
let mic, fft           // audio (if using p5.sound)
let NUMBER_OF_BUBBLES = 20
let INITIAL_DISTANCE_BETWEEN = 50
let FRACTAL_LEVELS = 20
const COLOR_CHOICES = ['#63a7ffff','#ff63a7ff','#63a7ffff','#63a7ffff','#e5ff63ff']

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
        this.squirl = map(col%5, 0, 4,.01, .06);
        this.angle = random(TWO_PI)       // random starting angle
        this.spin = -0.05  // how fast it rotates
        
    }

    update() {
        
        this.ax = sin(frameCount * 0.05 + this.offset) * .5
        this.ay = ( cos(frameCount * 0.05 + this.offset))* .5
        this.vx += this.ax + sin(frameCount * this.squirl + this.offset) * .5
        this.vy += this.ay + cos(frameCount * this.squirl + this.offset) * .5
        this.vx *= 0.8
        this.vy *= 0.8
        this.x += this.vx
        this.y += this.vy
        this.angle += this.spin

    }

draw() {
    for (let level = 0; level < FRACTAL_LEVELS; level++) {
        let scale = pow(0.5, level)        // each level is half the size
        let offset = this.r * level * 1.5  // spread them out

        noStroke()
        let r = red(this.color)
        let g = green(this.color)
        let b = blue(this.color)

        drawingContext.save()
        drawingContext.translate(
            this.x + cos(this.angle) * offset,
            this.y + sin(this.angle) * offset
        )
        drawingContext.rotate(this.angle + level * PI / 3)

        let grad = drawingContext.createRadialGradient(0, 0, 0, 0, 0, this.r * 3 * scale)
        grad.addColorStop(0,    `rgba(${r},${g},${b},0.5)`)
        grad.addColorStop(0.15, `rgba(${r},${g},${b},0.4)`)
        grad.addColorStop(0.5,  `rgba(${r},${g},${b},0.3)`)
        grad.addColorStop(1,    `rgba(255,255,255,0.1)`)

        drawingContext.fillStyle = grad
        drawingContext.beginPath()
        drawingContext.roundRect(
            -this.r * scale, -this.r * 2 * scale,
            this.r * 2 * scale, this.r * 4 * scale,
            this.r * 0.5 * scale
        )
        drawingContext.fill()
        drawingContext.restore()
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
        80,
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
    background(0, 0, 0, 10)   // now this actually fades

    blendMode(ADD)             // glow mode for bubbles
    for (let obj of objects) {
        obj.update()
        obj.draw()
    }
    blendMode(BLEND) 
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