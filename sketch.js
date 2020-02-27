const s = sketch => {

  const NBARS = 8;
  const BAR_WIDTH = 25;
  const BAR_SPACING = 10;
  const BAR_HEIGHT = 250;

  let BARS = Array(NBARS).fill(0);

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
    console.log('got new data')
    BARS = data.data;
    console.log('BARS is now', BARS)
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
    sketch.background(100, 100, 100);
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

  sketch.drawBar = (idx) => {
    const x = idx * (BAR_WIDTH + BAR_SPACING) + 350;
    const w = BAR_WIDTH;
    const y = 100;
    const val = BARS[idx];
    const h = sketch.map(val, 0, 1, 0, BAR_HEIGHT);
    const y2 = y + BAR_HEIGHT - h;

    // border
    sketch.push();
    sketch.stroke(200);
    sketch.noFill();
    sketch.rect(x, y, w, BAR_HEIGHT);
    sketch.pop();
    // console.log({x, y, w, h: BAR_HEIGHT})

    // fill
    sketch.push();
    sketch.fill(255);
    sketch.noStroke();
    sketch.rect(x, y2, w, h);
    sketch.pop();
    // console.log({val, h})
  }

  sketch.draw = () => {
    sketch.background(100);

    // update()
    sketch.drawBars();
  }

};

let myp5 = new p5(s);
