(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* globals Map */

(function main(global, module, isWorker, workerSize) {
  var canUseWorker = !!(
    global.Worker &&
    global.Blob &&
    global.Promise &&
    global.OffscreenCanvas &&
    global.OffscreenCanvasRenderingContext2D &&
    global.HTMLCanvasElement &&
    global.HTMLCanvasElement.prototype.transferControlToOffscreen &&
    global.URL &&
    global.URL.createObjectURL);

  var canUsePaths = typeof Path2D === 'function' && typeof DOMMatrix === 'function';
  var canDrawBitmap = (function () {
    // this mostly supports ssr
    if (!global.OffscreenCanvas) {
      return false;
    }

    var canvas = new OffscreenCanvas(1, 1);
    var ctx = canvas.getContext('2d');
    ctx.fillRect(0, 0, 1, 1);
    var bitmap = canvas.transferToImageBitmap();

    try {
      ctx.createPattern(bitmap, 'no-repeat');
    } catch (e) {
      return false;
    }

    return true;
  })();

  function noop() {}

  // create a promise if it exists, otherwise, just
  // call the function directly
  function promise(func) {
    var ModulePromise = module.exports.Promise;
    var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;

    if (typeof Prom === 'function') {
      return new Prom(func);
    }

    func(noop, noop);

    return null;
  }

  var bitmapMapper = (function (skipTransform, map) {
    // see https://github.com/catdad/canvas-confetti/issues/209
    // creating canvases is actually pretty expensive, so we should create a
    // 1:1 map for bitmap:canvas, so that we can animate the confetti in
    // a performant manner, but also not store them forever so that we don't
    // have a memory leak
    return {
      transform: function(bitmap) {
        if (skipTransform) {
          return bitmap;
        }

        if (map.has(bitmap)) {
          return map.get(bitmap);
        }

        var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);

        map.set(bitmap, canvas);

        return canvas;
      },
      clear: function () {
        map.clear();
      }
    };
  })(canDrawBitmap, new Map());

  var raf = (function () {
    var TIME = Math.floor(1000 / 60);
    var frame, cancel;
    var frames = {};
    var lastFrameTime = 0;

    if (typeof requestAnimationFrame === 'function' && typeof cancelAnimationFrame === 'function') {
      frame = function (cb) {
        var id = Math.random();

        frames[id] = requestAnimationFrame(function onFrame(time) {
          if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
            lastFrameTime = time;
            delete frames[id];

            cb();
          } else {
            frames[id] = requestAnimationFrame(onFrame);
          }
        });

        return id;
      };
      cancel = function (id) {
        if (frames[id]) {
          cancelAnimationFrame(frames[id]);
        }
      };
    } else {
      frame = function (cb) {
        return setTimeout(cb, TIME);
      };
      cancel = function (timer) {
        return clearTimeout(timer);
      };
    }

    return { frame: frame, cancel: cancel };
  }());

  var getWorker = (function () {
    var worker;
    var prom;
    var resolves = {};

    function decorate(worker) {
      function execute(options, callback) {
        worker.postMessage({ options: options || {}, callback: callback });
      }
      worker.init = function initWorker(canvas) {
        var offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({ canvas: offscreen }, [offscreen]);
      };

      worker.fire = function fireWorker(options, size, done) {
        if (prom) {
          execute(options, null);
          return prom;
        }

        var id = Math.random().toString(36).slice(2);

        prom = promise(function (resolve) {
          function workerDone(msg) {
            if (msg.data.callback !== id) {
              return;
            }

            delete resolves[id];
            worker.removeEventListener('message', workerDone);

            prom = null;

            bitmapMapper.clear();

            done();
            resolve();
          }

          worker.addEventListener('message', workerDone);
          execute(options, id);

          resolves[id] = workerDone.bind(null, { data: { callback: id }});
        });

        return prom;
      };

      worker.reset = function resetWorker() {
        worker.postMessage({ reset: true });

        for (var id in resolves) {
          resolves[id]();
          delete resolves[id];
        }
      };
    }

    return function () {
      if (worker) {
        return worker;
      }

      if (!isWorker && canUseWorker) {
        var code = [
          'var CONFETTI, SIZE = {}, module = {};',
          '(' + main.toString() + ')(this, module, true, SIZE);',
          'onmessage = function(msg) {',
          '  if (msg.data.options) {',
          '    CONFETTI(msg.data.options).then(function () {',
          '      if (msg.data.callback) {',
          '        postMessage({ callback: msg.data.callback });',
          '      }',
          '    });',
          '  } else if (msg.data.reset) {',
          '    CONFETTI && CONFETTI.reset();',
          '  } else if (msg.data.resize) {',
          '    SIZE.width = msg.data.resize.width;',
          '    SIZE.height = msg.data.resize.height;',
          '  } else if (msg.data.canvas) {',
          '    SIZE.width = msg.data.canvas.width;',
          '    SIZE.height = msg.data.canvas.height;',
          '    CONFETTI = module.exports.create(msg.data.canvas);',
          '  }',
          '}',
        ].join('\n');
        try {
          worker = new Worker(URL.createObjectURL(new Blob([code])));
        } catch (e) {
          // eslint-disable-next-line no-console
          typeof console !== undefined && typeof console.warn === 'function' ? console.warn('🎊 Could not load worker', e) : null;

          return null;
        }

        decorate(worker);
      }

      return worker;
    };
  })();

  var defaults = {
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    x: 0.5,
    y: 0.5,
    shapes: ['square', 'circle'],
    zIndex: 100,
    colors: [
      '#26ccff',
      '#a25afd',
      '#ff5e7e',
      '#88ff5a',
      '#fcff42',
      '#ffa62d',
      '#ff36ff'
    ],
    // probably should be true, but back-compat
    disableForReducedMotion: false,
    scalar: 1
  };

  function convert(val, transform) {
    return transform ? transform(val) : val;
  }

  function isOk(val) {
    return !(val === null || val === undefined);
  }

  function prop(options, name, transform) {
    return convert(
      options && isOk(options[name]) ? options[name] : defaults[name],
      transform
    );
  }

  function onlyPositiveInt(number){
    return number < 0 ? 0 : Math.floor(number);
  }

  function randomInt(min, max) {
    // [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function toDecimal(str) {
    return parseInt(str, 16);
  }

  function colorsToRgb(colors) {
    return colors.map(hexToRgb);
  }

  function hexToRgb(str) {
    var val = String(str).replace(/[^0-9a-f]/gi, '');

    if (val.length < 6) {
        val = val[0]+val[0]+val[1]+val[1]+val[2]+val[2];
    }

    return {
      r: toDecimal(val.substring(0,2)),
      g: toDecimal(val.substring(2,4)),
      b: toDecimal(val.substring(4,6))
    };
  }

  function getOrigin(options) {
    var origin = prop(options, 'origin', Object);
    origin.x = prop(origin, 'x', Number);
    origin.y = prop(origin, 'y', Number);

    return origin;
  }

  function setCanvasWindowSize(canvas) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  }

  function setCanvasRectSize(canvas) {
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function getCanvas(zIndex) {
    var canvas = document.createElement('canvas');

    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = zIndex;

    return canvas;
  }

  function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.scale(radiusX, radiusY);
    context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    context.restore();
  }

  function randomPhysics(opts) {
    var radAngle = opts.angle * (Math.PI / 180);
    var radSpread = opts.spread * (Math.PI / 180);

    return {
      x: opts.x,
      y: opts.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: (opts.startVelocity * 0.5) + (Math.random() * opts.startVelocity),
      angle2D: -radAngle + ((0.5 * radSpread) - (Math.random() * radSpread)),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: opts.color,
      shape: opts.shape,
      tick: 0,
      totalTicks: opts.ticks,
      decay: opts.decay,
      drift: opts.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: opts.gravity * 3,
      ovalScalar: 0.6,
      scalar: opts.scalar,
      flat: opts.flat
    };
  }

  function updateFetti(context, fetti) {
    fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
    fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
    fetti.velocity *= fetti.decay;

    if (fetti.flat) {
      fetti.wobble = 0;
      fetti.wobbleX = fetti.x + (10 * fetti.scalar);
      fetti.wobbleY = fetti.y + (10 * fetti.scalar);

      fetti.tiltSin = 0;
      fetti.tiltCos = 0;
      fetti.random = 1;
    } else {
      fetti.wobble += fetti.wobbleSpeed;
      fetti.wobbleX = fetti.x + ((10 * fetti.scalar) * Math.cos(fetti.wobble));
      fetti.wobbleY = fetti.y + ((10 * fetti.scalar) * Math.sin(fetti.wobble));

      fetti.tiltAngle += 0.1;
      fetti.tiltSin = Math.sin(fetti.tiltAngle);
      fetti.tiltCos = Math.cos(fetti.tiltAngle);
      fetti.random = Math.random() + 2;
    }

    var progress = (fetti.tick++) / fetti.totalTicks;

    var x1 = fetti.x + (fetti.random * fetti.tiltCos);
    var y1 = fetti.y + (fetti.random * fetti.tiltSin);
    var x2 = fetti.wobbleX + (fetti.random * fetti.tiltCos);
    var y2 = fetti.wobbleY + (fetti.random * fetti.tiltSin);

    context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - progress) + ')';

    context.beginPath();

    if (canUsePaths && fetti.shape.type === 'path' && typeof fetti.shape.path === 'string' && Array.isArray(fetti.shape.matrix)) {
      context.fill(transformPath2D(
        fetti.shape.path,
        fetti.shape.matrix,
        fetti.x,
        fetti.y,
        Math.abs(x2 - x1) * 0.1,
        Math.abs(y2 - y1) * 0.1,
        Math.PI / 10 * fetti.wobble
      ));
    } else if (fetti.shape.type === 'bitmap') {
      var rotation = Math.PI / 10 * fetti.wobble;
      var scaleX = Math.abs(x2 - x1) * 0.1;
      var scaleY = Math.abs(y2 - y1) * 0.1;
      var width = fetti.shape.bitmap.width * fetti.scalar;
      var height = fetti.shape.bitmap.height * fetti.scalar;

      var matrix = new DOMMatrix([
        Math.cos(rotation) * scaleX,
        Math.sin(rotation) * scaleX,
        -Math.sin(rotation) * scaleY,
        Math.cos(rotation) * scaleY,
        fetti.x,
        fetti.y
      ]);

      // apply the transform matrix from the confetti shape
      matrix.multiplySelf(new DOMMatrix(fetti.shape.matrix));

      var pattern = context.createPattern(bitmapMapper.transform(fetti.shape.bitmap), 'no-repeat');
      pattern.setTransform(matrix);

      context.globalAlpha = (1 - progress);
      context.fillStyle = pattern;
      context.fillRect(
        fetti.x - (width / 2),
        fetti.y - (height / 2),
        width,
        height
      );
      context.globalAlpha = 1;
    } else if (fetti.shape === 'circle') {
      context.ellipse ?
        context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) :
        ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
    } else if (fetti.shape === 'star') {
      var rot = Math.PI / 2 * 3;
      var innerRadius = 4 * fetti.scalar;
      var outerRadius = 8 * fetti.scalar;
      var x = fetti.x;
      var y = fetti.y;
      var spikes = 5;
      var step = Math.PI / spikes;

      while (spikes--) {
        x = fetti.x + Math.cos(rot) * outerRadius;
        y = fetti.y + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = fetti.x + Math.cos(rot) * innerRadius;
        y = fetti.y + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
    } else {
      context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
      context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
      context.lineTo(Math.floor(x2), Math.floor(y2));
      context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
    }

    context.closePath();
    context.fill();

    return fetti.tick < fetti.totalTicks;
  }

  function animate(canvas, fettis, resizer, size, done) {
    var animatingFettis = fettis.slice();
    var context = canvas.getContext('2d');
    var animationFrame;
    var destroy;

    var prom = promise(function (resolve) {
      function onDone() {
        animationFrame = destroy = null;

        context.clearRect(0, 0, size.width, size.height);
        bitmapMapper.clear();

        done();
        resolve();
      }

      function update() {
        if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
          size.width = canvas.width = workerSize.width;
          size.height = canvas.height = workerSize.height;
        }

        if (!size.width && !size.height) {
          resizer(canvas);
          size.width = canvas.width;
          size.height = canvas.height;
        }

        context.clearRect(0, 0, size.width, size.height);

        animatingFettis = animatingFettis.filter(function (fetti) {
          return updateFetti(context, fetti);
        });

        if (animatingFettis.length) {
          animationFrame = raf.frame(update);
        } else {
          onDone();
        }
      }

      animationFrame = raf.frame(update);
      destroy = onDone;
    });

    return {
      addFettis: function (fettis) {
        animatingFettis = animatingFettis.concat(fettis);

        return prom;
      },
      canvas: canvas,
      promise: prom,
      reset: function () {
        if (animationFrame) {
          raf.cancel(animationFrame);
        }

        if (destroy) {
          destroy();
        }
      }
    };
  }

  function confettiCannon(canvas, globalOpts) {
    var isLibCanvas = !canvas;
    var allowResize = !!prop(globalOpts || {}, 'resize');
    var hasResizeEventRegistered = false;
    var globalDisableForReducedMotion = prop(globalOpts, 'disableForReducedMotion', Boolean);
    var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, 'useWorker');
    var worker = shouldUseWorker ? getWorker() : null;
    var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
    var initialized = (canvas && worker) ? !!canvas.__confetti_initialized : false;
    var preferLessMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion)').matches;
    var animationObj;

    function fireLocal(options, size, done) {
      var particleCount = prop(options, 'particleCount', onlyPositiveInt);
      var angle = prop(options, 'angle', Number);
      var spread = prop(options, 'spread', Number);
      var startVelocity = prop(options, 'startVelocity', Number);
      var decay = prop(options, 'decay', Number);
      var gravity = prop(options, 'gravity', Number);
      var drift = prop(options, 'drift', Number);
      var colors = prop(options, 'colors', colorsToRgb);
      var ticks = prop(options, 'ticks', Number);
      var shapes = prop(options, 'shapes');
      var scalar = prop(options, 'scalar');
      var flat = !!prop(options, 'flat');
      var origin = getOrigin(options);

      var temp = particleCount;
      var fettis = [];

      var startX = canvas.width * origin.x;
      var startY = canvas.height * origin.y;

      while (temp--) {
        fettis.push(
          randomPhysics({
            x: startX,
            y: startY,
            angle: angle,
            spread: spread,
            startVelocity: startVelocity,
            color: colors[temp % colors.length],
            shape: shapes[randomInt(0, shapes.length)],
            ticks: ticks,
            decay: decay,
            gravity: gravity,
            drift: drift,
            scalar: scalar,
            flat: flat
          })
        );
      }

      // if we have a previous canvas already animating,
      // add to it
      if (animationObj) {
        return animationObj.addFettis(fettis);
      }

      animationObj = animate(canvas, fettis, resizer, size , done);

      return animationObj.promise;
    }

    function fire(options) {
      var disableForReducedMotion = globalDisableForReducedMotion || prop(options, 'disableForReducedMotion', Boolean);
      var zIndex = prop(options, 'zIndex', Number);

      if (disableForReducedMotion && preferLessMotion) {
        return promise(function (resolve) {
          resolve();
        });
      }

      if (isLibCanvas && animationObj) {
        // use existing canvas from in-progress animation
        canvas = animationObj.canvas;
      } else if (isLibCanvas && !canvas) {
        // create and initialize a new canvas
        canvas = getCanvas(zIndex);
        document.body.appendChild(canvas);
      }

      if (allowResize && !initialized) {
        // initialize the size of a user-supplied canvas
        resizer(canvas);
      }

      var size = {
        width: canvas.width,
        height: canvas.height
      };

      if (worker && !initialized) {
        worker.init(canvas);
      }

      initialized = true;

      if (worker) {
        canvas.__confetti_initialized = true;
      }

      function onResize() {
        if (worker) {
          // TODO this really shouldn't be immediate, because it is expensive
          var obj = {
            getBoundingClientRect: function () {
              if (!isLibCanvas) {
                return canvas.getBoundingClientRect();
              }
            }
          };

          resizer(obj);

          worker.postMessage({
            resize: {
              width: obj.width,
              height: obj.height
            }
          });
          return;
        }

        // don't actually query the size here, since this
        // can execute frequently and rapidly
        size.width = size.height = null;
      }

      function done() {
        animationObj = null;

        if (allowResize) {
          hasResizeEventRegistered = false;
          global.removeEventListener('resize', onResize);
        }

        if (isLibCanvas && canvas) {
          if (document.body.contains(canvas)) {
            document.body.removeChild(canvas); 
          }
          canvas = null;
          initialized = false;
        }
      }

      if (allowResize && !hasResizeEventRegistered) {
        hasResizeEventRegistered = true;
        global.addEventListener('resize', onResize, false);
      }

      if (worker) {
        return worker.fire(options, size, done);
      }

      return fireLocal(options, size, done);
    }

    fire.reset = function () {
      if (worker) {
        worker.reset();
      }

      if (animationObj) {
        animationObj.reset();
      }
    };

    return fire;
  }

  // Make default export lazy to defer worker creation until called.
  var defaultFire;
  function getDefaultFire() {
    if (!defaultFire) {
      defaultFire = confettiCannon(null, { useWorker: true, resize: true });
    }
    return defaultFire;
  }

  function transformPath2D(pathString, pathMatrix, x, y, scaleX, scaleY, rotation) {
    var path2d = new Path2D(pathString);

    var t1 = new Path2D();
    t1.addPath(path2d, new DOMMatrix(pathMatrix));

    var t2 = new Path2D();
    // see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix/DOMMatrix
    t2.addPath(t1, new DOMMatrix([
      Math.cos(rotation) * scaleX,
      Math.sin(rotation) * scaleX,
      -Math.sin(rotation) * scaleY,
      Math.cos(rotation) * scaleY,
      x,
      y
    ]));

    return t2;
  }

  function shapeFromPath(pathData) {
    if (!canUsePaths) {
      throw new Error('path confetti are not supported in this browser');
    }

    var path, matrix;

    if (typeof pathData === 'string') {
      path = pathData;
    } else {
      path = pathData.path;
      matrix = pathData.matrix;
    }

    var path2d = new Path2D(path);
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');

    if (!matrix) {
      // attempt to figure out the width of the path, up to 1000x1000
      var maxSize = 1000;
      var minX = maxSize;
      var minY = maxSize;
      var maxX = 0;
      var maxY = 0;
      var width, height;

      // do some line skipping... this is faster than checking
      // every pixel and will be mostly still correct
      for (var x = 0; x < maxSize; x += 2) {
        for (var y = 0; y < maxSize; y += 2) {
          if (tempCtx.isPointInPath(path2d, x, y, 'nonzero')) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      width = maxX - minX;
      height = maxY - minY;

      var maxDesiredSize = 10;
      var scale = Math.min(maxDesiredSize/width, maxDesiredSize/height);

      matrix = [
        scale, 0, 0, scale,
        -Math.round((width/2) + minX) * scale,
        -Math.round((height/2) + minY) * scale
      ];
    }

    return {
      type: 'path',
      path: path,
      matrix: matrix
    };
  }

  function shapeFromText(textData) {
    var text,
        scalar = 1,
        color = '#000000',
        // see https://nolanlawson.com/2022/04/08/the-struggle-of-using-native-emoji-on-the-web/
        fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';

    if (typeof textData === 'string') {
      text = textData;
    } else {
      text = textData.text;
      scalar = 'scalar' in textData ? textData.scalar : scalar;
      fontFamily = 'fontFamily' in textData ? textData.fontFamily : fontFamily;
      color = 'color' in textData ? textData.color : color;
    }

    // all other confetti are 10 pixels,
    // so this pixel size is the de-facto 100% scale confetti
    var fontSize = 10 * scalar;
    var font = '' + fontSize + 'px ' + fontFamily;

    var canvas = new OffscreenCanvas(fontSize, fontSize);
    var ctx = canvas.getContext('2d');

    ctx.font = font;
    var size = ctx.measureText(text);
    var width = Math.ceil(size.actualBoundingBoxRight + size.actualBoundingBoxLeft);
    var height = Math.ceil(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);

    var padding = 2;
    var x = size.actualBoundingBoxLeft + padding;
    var y = size.actualBoundingBoxAscent + padding;
    width += padding + padding;
    height += padding + padding;

    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext('2d');
    ctx.font = font;
    ctx.fillStyle = color;

    ctx.fillText(text, x, y);

    var scale = 1 / scalar;

    return {
      type: 'bitmap',
      // TODO these probably need to be transfered for workers
      bitmap: canvas.transferToImageBitmap(),
      matrix: [scale, 0, 0, scale, -width * scale / 2, -height * scale / 2]
    };
  }

  module.exports = function() {
    return getDefaultFire().apply(this, arguments);
  };
  module.exports.reset = function() {
    getDefaultFire().reset();
  };
  module.exports.create = confettiCannon;
  module.exports.shapeFromPath = shapeFromPath;
  module.exports.shapeFromText = shapeFromText;
}((function () {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  return this || {};
})(), module, false));

},{}],2:[function(require,module,exports){
const {
  errorMessages,
  musicalElementsNotesObject,
} = require("./helper_objects");
const maxDistance = 11;

function validateNotesArray(arrayNotes, musicalElementsArray) {
  if (arrayNotes.length !== 2) {
    throw new Error(errorMessages.notTwoElements);
  } else if (!arrayNotes.every((note) => musicalElementsArray.includes(note))) {
    throw new Error(errorMessages.notesNotValid);
  } else if (arrayNotes[0] === arrayNotes[1]) {
    throw new Error(errorMessages.noteDuplicated);
  } else if (
    musicalElementsNotesObject[arrayNotes[0]] ===
    musicalElementsNotesObject[arrayNotes[1]]
  ) {
    throw new Error(
      errorMessages.inharmonicEquivalentNotesError(arrayNotes[0], arrayNotes[1])
    );
  }
}

function getIndexes(currentNotes) {
  const index1 = musicalElementsNotesObject[currentNotes[0]];
  const index2 = musicalElementsNotesObject[currentNotes[1]];
  return [index1, index2];
}

function validateDistance(distance) {
  if (typeof distance !== "number") {
    throw new Error(errorMessages.onlyDatatypeOfNumber);
  } else if (!Number.isInteger(distance)) {
    throw new Error(errorMessages.mustBeWholeNumber);
  } else if (distance > maxDistance || distance === 0) {
    throw new Error(errorMessages.distanceOutOfRange);
  } else if (distance < 0) {
    throw new Error(errorMessages.negativeDistance);
  }
}

const getRandomNote = (arrayOfAllNotes) =>
  arrayOfAllNotes[Math.floor(Math.random() * arrayOfAllNotes.length)];

module.exports = {
  validateDistance,
  validateNotesArray,
  getIndexes,
  getRandomNote,
};

},{"./helper_objects":3}],3:[function(require,module,exports){
const errorMessages = {
  notTwoElements: "The input must consist of exactly two elements to be valid.",
  notesNotValid:
    "The provided notes are not valid. Please refer to the following array for valid notes: ['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#'].",
  noteDuplicated: "Each note in the input must be unique and not duplicated.",
  distanceOutOfRange:
    "The provided answer is out of range. Please input a value from 1 to 11.",
  negativeDistance:
    "The distance cannot be negative. Please input a non-negative value for the distance.",
  mustBeWholeNumber:
    "The provided number must be a whole number, e.g., 5, not a decimal number like 5.1.",
  onlyDatatypeOfNumber:
    "Only the data type 'number' is valid, e.g., 5, not 'five', '5', or {}.",
  inharmonicEquivalentNotesError: (note1, note2) =>
    `${note1} and ${note2} are inharmonic equivalent notes; there is no semitone between them.`,
};

const musicalElementsNotesObject = {
  A: 0,
  "A#": 1,
  Bb: 1,
  B: 2,
  C: 3,
  "C#": 4,
  Db: 4,
  D: 5,
  "D#": 6,
  Eb: 6,
  E: 7,
  F: 8,
  "F#": 9,
  Gb: 9,
  G: 10,
  "G#": 11,
};

module.exports = { errorMessages, musicalElementsNotesObject };

},{}],4:[function(require,module,exports){
const {
  validateDistance,
  validateNotesArray,
  getIndexes,
  getRandomNote,
} = require("./helper_functions");
const { musicalElementsNotesObject } = require("./helper_objects");

class JamBuddy {
  static #musicalElements = musicalElementsNotesObject;
  #currentNotes = [];

  static get musicalElements() {
    return this.#musicalElements;
  }

  getCurrentNotes() {
    return this.#currentNotes;
  }

  setCurrentNotes(arrayNotes) {
    validateNotesArray(arrayNotes, Object.keys(JamBuddy.#musicalElements));
    this.#currentNotes = arrayNotes;
  }

  randomizeCurrentNotes() {
    const tempArray = Object.keys(JamBuddy.#musicalElements);
    let firstNote, secondNote;

    do {
      firstNote = getRandomNote(tempArray);
      secondNote = getRandomNote(tempArray);
    } while (
      JamBuddy.#musicalElements[firstNote] ===
      JamBuddy.#musicalElements[secondNote]
    );

    this.setCurrentNotes([firstNote, secondNote]);
  }

  checkAnswer(distance) {
    validateDistance(distance);
    const [index1, index2] = getIndexes(this.getCurrentNotes());
    const totalHarmonicNotes = 12;
    const absDiff = Math.abs(index1 - index2);
    const cyclicDistance = [absDiff, totalHarmonicNotes - absDiff];
    return cyclicDistance.includes(distance);
  }
}

module.exports = { JamBuddy };

},{"./helper_functions":2,"./helper_objects":3}],5:[function(require,module,exports){
const { JamBuddy } = require("./jam_buddy");
const confetti = require("canvas-confetti");
const {
  initNotes,
  reloadPage,
  toggleButtons,
  changeButtonColor,
  displayAnswerMessage,
  showStreakMessage,
  switchOffStreakMessage,
  delayCode,
  switchOffAnswer,
  clearTheBoxes,
  showAnswer,
  doTheExplanation,
  guiElements,
} = require("./script_helper_functions");

const jamBuddy = new JamBuddy();
let streakCounter = 0;
let noteOne, noteTwo;

const colorOne = "#007bff";
const colorTwo = "#7da2ca";

[noteOne, noteTwo] = initNotes(jamBuddy);

guiElements.restartButton.addEventListener("click", () => reloadPage(window));

guiElements.giveUpButton.addEventListener("click", () => {
  toggleButtons("disable");
  changeButtonColor(colorTwo);
  guiElements.inputField.disabled = true;
  clearTheBoxes(document);
  doTheExplanation(document, noteOne, noteTwo, streakCounter);
  streakCounter = 0;
  showStreakMessage(streakCounter);
});

guiElements.randomizeButton.addEventListener("click", () => {
  clearTheBoxes(document);
  switchOffAnswer(document, noteOne, noteTwo);
  toggleButtons("enable");
  changeButtonColor(colorOne);
  guiElements.inputField.disabled = false;
  [noteOne, noteTwo] = initNotes(jamBuddy);
});

guiElements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const distance = parseInt(guiElements.inputField.value);
  if (isNaN(distance)) {
    alert("Input can't be empty");
    return;
  }

  guiElements.inputField.value = "";
  switchOffAnswer(document, noteOne, noteTwo);
  switchOffStreakMessage();

  if (jamBuddy.checkAnswer(distance)) {
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.6 },
    });
    displayAnswerMessage("correct");
    showAnswer(document, noteOne, noteTwo);
    streakCounter++;
    toggleButtons("disable");
    changeButtonColor(colorTwo);
    guiElements.inputField.disabled = true;
  } else {
    displayAnswerMessage("incorrect");
    streakCounter = 0;
  }
  delayCode(streakCounter);
});

},{"./jam_buddy":4,"./script_helper_functions":6,"canvas-confetti":1}],6:[function(require,module,exports){
const { JamBuddy } = require("./jam_buddy");
const {guiElements} = require("./script_helper_objects");

function initNotes(jamBuddy) {
  jamBuddy.randomizeCurrentNotes();
  const [noteOne, noteTwo] = jamBuddy.getCurrentNotes();
  guiElements.firstNote.innerText = noteOne;
  guiElements.secondNote.innerText = noteTwo;
  return [noteOne, noteTwo];
}

function reloadPage(window) {
  window.location.reload();
}

function toggleButtons(status) {
  const isDisabled = status === "disable";
  guiElements.submitButton.disabled = isDisabled;
  guiElements.giveUpButton.disabled = isDisabled;
}

function changeButtonColor(color) {
  guiElements.submitButton.style.backgroundColor = color;
  guiElements.giveUpButton.style.backgroundColor = color;
}

function displayAnswerMessage(status) {
  guiElements.correctMessage.style.display =
    status === "correct" ? "block" : "none";
  guiElements.incorrectMessage.style.display =
    status === "incorrect" ? "block" : "none";
}

function showStreakMessage(streakCounter) {
  guiElements.streakNumberElement.innerText = streakCounter;
  guiElements.streakElement.style.display = "block";
}

function switchOffStreakMessage() {
  guiElements.streakElement.style.display = "none";
}

function switchMessageOff() {
  guiElements.correctMessage.style.display = "none";
  guiElements.incorrectMessage.style.display = "none";
}

function clearTheBoxes(document) {
  const arrayObject = [1, 4, 6, 9];
  for (let i = 0; i < 12; i++) {
    if (arrayObject.includes(i)) {
      document.querySelector(`#a${i}a0`).style.backgroundColor = "#ccc";
      document.querySelector(`#a${i}a1`).style.backgroundColor = "#ccc";
    } else {
      document.querySelector(`#a${i}`).style.backgroundColor = "#ccc";
    }
  }
}

function switchOffAnswer(document, noteOne, noteTwo) {
  guiElements.explanation.style.display = "none";
  document.querySelector(
    `#a${JamBuddy.musicalElements[noteOne]}`
  ).style.backgroundColor = "#ccc";
  document.querySelector(
    `#a${JamBuddy.musicalElements[noteTwo]}`
  ).style.backgroundColor = "#ccc";
}

function delayCode(streakCounter) {
  setTimeout(() => {
    switchMessageOff();
    showStreakMessage(streakCounter);
  }, 600);
}

function showAnswer(document, noteOne, noteTwo) {
  const arrayObject = [1, 4, 6, 9];
  const index1 = JamBuddy.musicalElements[noteOne];
  const index2 = JamBuddy.musicalElements[noteTwo];

  guiElements.explanation.style.display = "block";
  guiElements.answerText.style.display = "none";

  const getColorSelector = (index, note) =>
    `#a${index}${
      arrayObject.includes(index) ? `a${note.includes("#") ? "0" : "1"}` : ""
    }`;

  document.querySelector(
    getColorSelector(index1, noteOne)
  ).style.backgroundColor = "red";
  document.querySelector(
    getColorSelector(index2, noteTwo)
  ).style.backgroundColor = "yellow";
}

function doTheExplanation(document, noteOne, noteTwo, streakCounter) {
  showStreakMessage(streakCounter);
  showAnswer(document, noteOne, noteTwo);
  guiElements.answerText.style.display = "block";

  const one = JamBuddy.musicalElements[noteOne];
  const two = JamBuddy.musicalElements[noteTwo];

  if (one < two) {
    doCount(one, two, guiElements.clockwiseAnswer, () => {
      doCount(two, one, guiElements.antiClockwiseAnswer);
    });
  } else {
    doCount(two, one, guiElements.clockwiseAnswer, () => {
      doCount(one, two, guiElements.antiClockwiseAnswer);
    });
  }
}

function doCount(num1, num2, id, callback) {
  let count = 0;
  const totalNotes = 12;

  const intervalId = setInterval(() => {
    if (num1 !== num2) {
      num1 = (num1 + 1) % totalNotes;
      count++;
      id.innerText = count;
      guiElements.mainCounter.innerText = count;

      const element = document.querySelector(`#a${num1}`);
      const store = element.style.backgroundColor;
      element.style.backgroundColor = "blue";
      setTimeout(() => {
        element.style.backgroundColor = store;
      }, 600);
    } else {
      clearInterval(intervalId);
      if (typeof callback === "function") {
        callback();
      }
      guiElements.mainCounter.innerText = "";
    }
  }, 600);
}

module.exports = {
  initNotes,
  reloadPage,
  toggleButtons,
  changeButtonColor,
  displayAnswerMessage,
  showStreakMessage,
  switchOffStreakMessage,
  switchMessageOff,
  delayCode,
  switchOffAnswer,
  clearTheBoxes,
  showAnswer,
  doTheExplanation,
  doCount,
  guiElements,
};

},{"./jam_buddy":4,"./script_helper_objects":7}],7:[function(require,module,exports){
const guiElements = {
  form: document.getElementById("distance-input-form"),
  streakElement: document.getElementById("streak"),
  streakNumberElement: document.getElementById("streak-number"),
  inputField: document.getElementById("input-field"),
  restartButton: document.getElementById("restart-btn"),
  giveUpButton: document.getElementById("give-up-btn"),
  randomizeButton: document.querySelector("#randomize-btn"),
  submitButton: document.getElementById("submit-btn"),
  correctMessage: document.getElementById("correctMessage"),
  incorrectMessage: document.getElementById("incorrectMessage"),
  explanation: document.querySelector("#explanation"),
  answerText: document.querySelector("#answer-text"),
  mainCounter: document.querySelector("#main-counter"),
  clockwiseAnswer: document.querySelector("#clockwise-answer"),
  antiClockwiseAnswer: document.querySelector("#anti-clockwise-answer"),
  firstNote: document.querySelector("#first-note"),
  secondNote: document.querySelector("#second-note"),
};

module.exports = { guiElements };

},{}]},{},[5]);
