const s = sketch => {

  const NBARS = 8;
  const BAR_WIDTH = 25;
  const BAR_SPACING = 10;
  const BAR_HEIGHT = 250;

  let BARS = Array(NBARS).fill(0);
  let COLOR = '#3463b6'
  let COLOR_FROM = ''
  let COLOR_TO = ''
  let COLOR_LERP = 0 // goes from 0 to 1 (see lerpColor() p5.js for more info)

  const api_url = process.env.SONORE_SERVER_URL;
  console.log({ api_url });

  // Just check if server is accessible
  // axios
  //   .get(api_url)
  //   .then(res => console.log(res.data))
  //   .catch(err => console.log(err));

  const socket = io.connect(api_url);
  console.log('socket', socket)
  socket.on("data", data => {
    console.info('got new data', data.data)
      const receivedColor = data.data.length === 9 ? data.data.pop() : '#cccccc'
      if (receivedColor !== COLOR_TO) {
        console.log('new color', receivedColor)
        COLOR_TO = receivedColor
        COLOR_FROM = COLOR
        COLOR_LERP = 0
        // version where interpolate background
        // document.querySelector('.p5Canvas').style.background = possibleNewColor
        // COLOR = possibleNewColor
      }
    BARS = data.data
    console.info('BARS is now', BARS)
  });

  socket.on("color", data => {
    console.log('got color', color)
  });

  window.io = io
  window.socket = socket

  sketch.setup = () => {
    console.log("running setup");

    // /<room_number>/<bar_number>/<bar_value>
    // room_number:
    // 1 - Sala Suggia
    // 2 - Sala 2
    // 3 - Bar Artistas
    // 4 - Ensaio 1
    // 5 - Mockup
    //
    // bar_number: int [1-8]
    // bar_value: float [0-1]

    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    // sketch.background(100, 100, 100);
    // frameRate(50)
  }

  // function update() {
  //   for (let i = 0; i < BARS.length; i++) {
  //     BARS[i] = map(parseInt(random(0, 24)), 0, 24, 0, 1)
  //   }
  // }

  sketch.drawBars = () => {
    if (!BARS) return;
    for (let i = 0; i < BARS.length; i++) {
      sketch.drawBar(i);
    }
  }

  sketch.windowResized = () => {
    console.log('resized!')
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  }

  sketch.drawBar = (idx) => {

    const barsWidth = NBARS * BAR_WIDTH + (NBARS-1) * BAR_SPACING
    const offset = sketch.windowWidth/2 - barsWidth/2

    const x = idx * (BAR_WIDTH + BAR_SPACING) + offset;
    const w = BAR_WIDTH;
    const y = sketch.windowHeight/2 - BAR_HEIGHT/2;
    const val = BARS[idx];
    const h = sketch.map(val, 0, 1, 0, BAR_HEIGHT);
    const y2 = y + BAR_HEIGHT - h;

    // first empty rect
    sketch.push();
    sketch.fill(255);
    sketch.noStroke();
    sketch.rect(x, y, w, BAR_HEIGHT);
    sketch.pop();

    // fill
    sketch.push();
    sketch.fill(COLOR);
    sketch.noStroke();
    sketch.rect(x, y2, w, h);
    sketch.pop();
    // console.log({val, h})

    // border
    sketch.push();
    sketch.stroke(0);
    sketch.noFill();
    sketch.rect(x, y, w, BAR_HEIGHT);
    sketch.pop();
    // console.log({x, y, w, h: BAR_HEIGHT})

  }

  sketch.draw = () => {
    // sketch.background(100);
    // console.log('COLOR is', COLOR)
    // const c = sketch.color(`#${COLOR}`)
    // sketch.background(c);

    // update()
    // interpolate color before drawing
    if (COLOR_LERP < 1.0) {
      COLOR = sketch.lerpColor(sketch.color(COLOR_FROM), sketch.color(COLOR_TO), COLOR_LERP)
      COLOR_LERP += 0.01
      console.log('lerping', COLOR)
    }
    // console.log('not lerping', COLOR)

    sketch.drawBars();
  }

};

let myp5 = new p5(s);
