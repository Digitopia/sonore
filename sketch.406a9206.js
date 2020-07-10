// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"nyCU":[function(require,module,exports) {
var s = function s(sketch) {
  var NBARS = 8;
  var BAR_WIDTH = 25;
  var BAR_SPACING = 10;
  var BAR_HEIGHT = 250;
  var BARS = Array(NBARS).fill(0);
  var COLOR = '#3463b6';
  var COLOR_FROM = '';
  var COLOR_TO = '';
  var COLOR_LERP = 0; // goes from 0 to 1 (see lerpColor() p5.js for more info)

  var api_url = "https://sonore-api.steameducation.eu";
  console.log({
    api_url: api_url
  }); // Just check if server is accessible
  // axios
  //   .get(api_url)
  //   .then(res => console.log(res.data))
  //   .catch(err => console.log(err));

  var socket = io.connect(api_url);
  console.log('socket', socket);
  socket.on("data", function (data) {
    console.info('got new data', data.data);
    var receivedColor = data.data.length === 9 ? data.data.pop() : '#cccccc';

    if (receivedColor !== COLOR_TO) {
      console.log('new color', receivedColor);
      COLOR_TO = receivedColor;
      COLOR_FROM = COLOR;
      COLOR_LERP = 0; // version where interpolate background
      // document.querySelector('.p5Canvas').style.background = possibleNewColor
      // COLOR = possibleNewColor
    }

    BARS = data.data;
    console.info('BARS is now', BARS);
  });
  socket.on("color", function (data) {
    console.log('got color', color);
  });
  window.io = io;
  window.socket = socket;

  sketch.setup = function () {
    console.log("running setup"); // /<room_number>/<bar_number>/<bar_value>
    // room_number:
    // 1 - Sala Suggia
    // 2 - Sala 2
    // 3 - Bar Artistas
    // 4 - Ensaio 1
    // 5 - Mockup
    //
    // bar_number: int [1-8]
    // bar_value: float [0-1]

    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight); // sketch.background(100, 100, 100);
    // frameRate(50)
  }; // function update() {
  //   for (let i = 0; i < BARS.length; i++) {
  //     BARS[i] = map(parseInt(random(0, 24)), 0, 24, 0, 1)
  //   }
  // }


  sketch.drawBars = function () {
    if (!BARS) return;

    for (var i = 0; i < BARS.length; i++) {
      sketch.drawBar(i);
    }
  };

  sketch.windowResized = function () {
    console.log('resized!');
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };

  sketch.drawBar = function (idx) {
    var barsWidth = NBARS * BAR_WIDTH + (NBARS - 1) * BAR_SPACING;
    var offset = sketch.windowWidth / 2 - barsWidth / 2;
    var x = idx * (BAR_WIDTH + BAR_SPACING) + offset;
    var w = BAR_WIDTH;
    var y = sketch.windowHeight / 2 - BAR_HEIGHT / 2;
    var val = BARS[idx];
    var h = sketch.map(val, 0, 1, 0, BAR_HEIGHT);
    var y2 = y + BAR_HEIGHT - h; // first empty rect

    sketch.push();
    sketch.fill(255, 30);
    sketch.noStroke();
    sketch.rect(x, y, w, BAR_HEIGHT);
    sketch.pop(); // fill

    sketch.push();
    sketch.fill(COLOR);
    sketch.noStroke();
    sketch.rect(x, y2, w, h);
    sketch.pop(); // console.log({val, h})
    // border

    sketch.push();
    sketch.stroke(0);
    sketch.noFill();
    sketch.rect(x, y, w, BAR_HEIGHT);
    sketch.pop(); // console.log({x, y, w, h: BAR_HEIGHT})
  };

  sketch.draw = function () {
    // sketch.background(100);
    // console.log('COLOR is', COLOR)
    // const c = sketch.color(`#${COLOR}`)
    // sketch.background(c);
    // update()
    // interpolate color before drawing
    if (COLOR_LERP < 1.0) {
      COLOR = sketch.lerpColor(sketch.color(COLOR_FROM), sketch.color(COLOR_TO), COLOR_LERP);
      COLOR_LERP += 0.01;
      console.log('lerping', COLOR);
    } // console.log('not lerping', COLOR)


    sketch.drawBars();
  };
};

var myp5 = new p5(s);
},{}]},{},["nyCU"], null)
//# sourceMappingURL=/sonore/sketch.406a9206.js.map