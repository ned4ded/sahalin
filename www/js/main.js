'use strict';

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var anDelay = 10000;
var anDur = 500;

function handleCallbacks(callbacks) {
  if (!callbacks) return;

  if (callbacks instanceof Array) {
    if (!callbacks.length) return;

    var _callbacks = _toArray(callbacks),
        first = _callbacks[0],
        last = _callbacks.slice(1);

    first();

    return handleCallbacks(last);
  }

  return callbacks();
}

function ableSaveBtn() {
  if (els.save.hasAttribute('disabled')) {
    els.save.removeAttribute('disabled');
  } else {
    els.save.setAttribute('disabled', true);
  }
};

function animateCurtain(_ref) {
  var forward = _ref.forward,
      reverse = _ref.reverse;

  var frc = $(els.frameCurtain);

  if (frc.hasClass('shown')) {
    if (reverse && reverse.before) handleCallbacks(reverse.before);

    frc.animate({
      width: '0%'
    }, anDur, function () {
      if (reverse && reverse.after) handleCallbacks(reverse.after);
      frc.removeClass('shown');
    });
  } else {
    if (forward && forward.before) handleCallbacks(forward.before);
    frc.animate({
      width: '100%'
    }, anDur, function () {
      frc.addClass('shown');
      if (forward && forward.after) handleCallbacks(forward.after);
    });
  }
}

function showPopup() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      forward = _ref2.forward,
      reverse = _ref2.reverse;

  var pu = $(els.popup);

  if (pu.hasClass('shown')) {
    if (reverse && reverse.before) handleCallbacks(reverse.before);

    pu.animate({
      opacity: 0
    }, 200, function () {
      if (reverse && reverse.after) handleCallbacks(reverse.after);
      pu.removeClass('shown');
      pu.hide();
    });
  } else {
    pu.show();
    if (forward && forward.before) handleCallbacks(forward.before);
    pu.animate({
      opacity: 1
    }, 200, function () {
      pu.addClass('shown');
      if (forward && forward.after) handleCallbacks(forward.after);
    });
  }
}
'use strict';

(function () {
  console.log('canvas.js');
  var _ = function _(id) {
    return document.getElementById(id);
  };

  var canvas = new fabric.Canvas('canvas', {
    isDrawingMode: true
  });

  function saveCanvas() {
    var json = JSON.stringify(canvas.toJSON());
    var png = canvas.toDataURL('png');
    var msgBox = _('msgBox');

    $.post('/create', {
      fabricObject: json,
      dataUri: png,
      beforeSend: function beforeSend() {
        msgBox.innerHTML = 'Изображение обрабатывается';
      }
    }, 'json').done(function (data) {
      console.log(data);
      console.log('successfully sended');
      msgBox.innerHTML = 'Изображение успешно сохранено. Нажмите "ОК" чтобы продолжить.';
    }).fail(function (jqxhr, textStatus, err) {
      msgBox.innerHTML = 'Произошла ошибка на стороне клиента. Попробуйте повторить действие.';
      console.log('failure');
      console.log(jqxhr);
      console.log(textStatus);
      console.log(err);
    });
  }

  fabric.Object.prototype.transparentCorners = false;

  window.addEventListener('resize', resizeCanvas, false);

  var frame = _('frame');
  var popup = _('popup');
  var load = _('load');

  load.onclick = function (ev) {
    ev.preventDefault();

    $.get({
      url: '/render',
      dataType: 'json'
    }).done(function (data) {
      canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });
  };

  // function resizeCanvas() {
  //   canvas.setHeight(frame.clientHeight);
  //   canvas.setWidth(frame.clientWidth);
  //   canvas.renderAll();
  // }
  //
  // resizeCanvas();

  var drawingModeEl = _('drawing-mode'),

  // drawingOptionsEl = _('drawing-mode-options'),
  // drawingColorEl = _('drawing-color'),
  // drawingShadowColorEl = _('drawing-shadow-color'),
  // drawingLineWidthEl = _('drawing-line-width'),
  // drawingShadowWidth = _('drawing-shadow-width'),
  // drawingShadowOffset = _('drawing-shadow-offset'),
  // clearEl = _('clear'),
  save = _('save');

  // clearEl.onclick = function() { canvas.clear() };
  save.onclick = function convertToImagen() {
    save.setAttribute('disabled', true);
    saveCanvas();
    var close = _('close');

    var curtain = document.getElementById('curtain');
    var anDelay = 10000;
    var anDur = 500;
    var restartCanvas = function restartCanvas() {
      close.onclick = function () {

        anTimer('out');
        return setTimeout(function () {
          curtain.classList.remove("anim");
          canvas.clear();
          save.removeAttribute('disabled');

          close.onclick = '';
        }, anDur);
      };
    };

    var anTimer = function anTimer(cls) {
      curtain.classList.add(cls);
      var state = popup.getAttribute('data-shown') == 'true' ? false : true;
      popup.setAttribute('data-shown', state);

      setTimeout(function () {
        curtain.classList.remove(cls);
      }, anDur);
    };

    curtain.classList.add("anim");
    anTimer('in');
    // setTimeout(() => window.open(canvas.toDataURL('png')), anDur);

    restartCanvas();

    setTimeout(function () {
      if (close.getAttribute('data-shown') == 'false') close.click();
    }, anDelay);
  };

  // drawingModeEl.onclick = function() {
  //   canvas.isDrawingMode = !canvas.isDrawingMode;
  //   if (canvas.isDrawingMode) {
  //     drawingModeEl.innerHTML = 'Cancel drawing mode';
  //     drawingOptionsEl.style.display = '';
  //   }
  //   else {
  //     drawingModeEl.innerHTML = 'Enter drawing mode';
  //     drawingOptionsEl.style.display = 'none';
  //   }
  // };

  // if (fabric.PatternBrush) {
  //   var vLinePatternBrush = new fabric.PatternBrush(canvas);
  //   vLinePatternBrush.getPatternSrc = function() {
  //
  //     var patternCanvas = fabric.document.createElement('canvas');
  //     patternCanvas.width = patternCanvas.height = 10;
  //     var ctx = patternCanvas.getContext('2d');
  //
  //     ctx.strokeStyle = this.color;
  //     ctx.lineWidth = 5;
  //     ctx.beginPath();
  //     ctx.moveTo(0, 5);
  //     ctx.lineTo(10, 5);
  //     ctx.closePath();
  //     ctx.stroke();
  //
  //     return patternCanvas;
  //   };

  // var hLinePatternBrush = new fabric.PatternBrush(canvas);
  // hLinePatternBrush.getPatternSrc = function() {
  //
  //   var patternCanvas = fabric.document.createElement('canvas');
  //   patternCanvas.width = patternCanvas.height = 10;
  //   var ctx = patternCanvas.getContext('2d');
  //
  //   ctx.strokeStyle = this.color;
  //   ctx.lineWidth = 5;
  //   ctx.beginPath();
  //   ctx.moveTo(5, 0);
  //   ctx.lineTo(5, 10);
  //   ctx.closePath();
  //   ctx.stroke();
  //
  //   return patternCanvas;
  // };
  //
  // var squarePatternBrush = new fabric.PatternBrush(canvas);
  // squarePatternBrush.getPatternSrc = function() {
  //
  //   var squareWidth = 10, squareDistance = 2;
  //
  //   var patternCanvas = fabric.document.createElement('canvas');
  //   patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
  //   var ctx = patternCanvas.getContext('2d');
  //
  //   ctx.fillStyle = this.color;
  //   ctx.fillRect(0, 0, squareWidth, squareWidth);
  //
  //   return patternCanvas;
  // };
  //
  // var diamondPatternBrush = new fabric.PatternBrush(canvas);
  // diamondPatternBrush.getPatternSrc = function() {
  //
  //   var squareWidth = 10, squareDistance = 5;
  //   var patternCanvas = fabric.document.createElement('canvas');
  //   var rect = new fabric.Rect({
  //     width: squareWidth,
  //     height: squareWidth,
  //     angle: 45,
  //     fill: this.color
  //   });
  //
  //   var canvasWidth = rect.getBoundingRect().width;
  //
  //   patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
  //   rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });
  //
  //   var ctx = patternCanvas.getContext('2d');
  //   rect.render(ctx);
  //
  //   return patternCanvas;
  // };
  //
  // var img = new Image();
  // img.src = '../assets/honey_im_subtle.png';
  //
  // var texturePatternBrush = new fabric.PatternBrush(canvas);
  // texturePatternBrush.source = img;
  // }

  // _('drawing-mode-selector').onchange = function() {
  //
  //   if (this.value === 'hline') {
  //     canvas.freeDrawingBrush = vLinePatternBrush;
  //   }
  //   // else if (this.value === 'vline') {
  //   //   canvas.freeDrawingBrush = hLinePatternBrush;
  //   // }
  //   // else if (this.value === 'square') {
  //   //   canvas.freeDrawingBrush = squarePatternBrush;
  //   // }
  //   // else if (this.value === 'diamond') {
  //   //   canvas.freeDrawingBrush = diamondPatternBrush;
  //   // }
  //   // else if (this.value === 'texture') {
  //   //   canvas.freeDrawingBrush = texturePatternBrush;
  //   // }
  //   // else {
  //   //   canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
  //   // }
  //
  //   if (canvas.freeDrawingBrush) {
  //     canvas.freeDrawingBrush.color = drawingColorEl.value;
  //     canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
  //     canvas.freeDrawingBrush.shadow = new fabric.Shadow({
  //       blur: parseInt(drawingShadowWidth.value, 10) || 0,
  //       offsetX: 0,
  //       offsetY: 0,
  //       affectStroke: true,
  //       color: drawingShadowColorEl.value,
  //     });
  //   }
  // };

  // drawingColorEl.onchange = function() {
  //   canvas.freeDrawingBrush.color = this.value;
  // };
  // drawingShadowColorEl.onchange = function() {
  //   canvas.freeDrawingBrush.shadow.color = this.value;
  // };
  // drawingLineWidthEl.onchange = function() {
  //   canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
  //   this.previousSibling.innerHTML = this.value;
  // };
  // drawingShadowWidth.onchange = function() {
  //   canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
  //   this.previousSibling.innerHTML = this.value;
  // };
  // drawingShadowOffset.onchange = function() {
  //   canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
  //   canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
  //   this.previousSibling.innerHTML = this.value;
  // };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = '#555555';
    canvas.freeDrawingBrush.width = parseInt(10, 10) || 1;
  }
});
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Presentation = function () {
  function Presentation() {
    var _this = this;

    _classCallCheck(this, Presentation);

    this.getNextImg(0, function (acc) {
      if (!acc.length) return;

      _this.carousel(acc);
    }, 3);
  }

  _createClass(Presentation, [{
    key: 'getNextImg',
    value: function getNextImg(id, cb, count) {
      var acc = [];

      var rec = function rec(id, cb, failure) {
        var path = id ? '/presentation/next/' + id : '/presentation/next';

        return $.post(path, 'json').done(function (data) {
          acc = [].concat(_toConsumableArray(acc), [data]);

          if (acc.length >= count) {
            return cb(acc);
          };

          return rec(data.id, cb);
        }).fail(function (data) {
          if (failure > 3) return cb(acc);

          rec(id, cb, failure ? failure + 1 : 1);
        });
      };

      rec(id, cb);
    }
  }, {
    key: 'carousel',
    value: function carousel(data) {
      var _this2 = this;

      if (!data || !data.length) return;
      var curEl = document.getElementById('carousel-current');
      var nextEl = document.getElementById('carousel-next');
      var animDur = 2000;

      var rec = function rec(arr) {
        var _arr = _toArray(arr),
            cur = _arr[0],
            rest = _arr.slice(1);

        var _rest = _slicedToArray(rest, 1),
            next = _rest[0];

        var updatePath = function updatePath(el, e) {
          var path = el.path;
          var attr = "background-image: url('" + path + "')";
          e.setAttribute('style', attr);
        };

        updatePath(cur, curEl);
        updatePath(next, nextEl);

        // curEl.classList.remove('animate');
        // nextEl.classList.remove('animate');

        curEl.classList.add('animate');
        nextEl.classList.add('animate');

        setTimeout(function () {
          nextEl.classList.remove('animate');
          curEl.classList.remove('animate');
          updatePath(next, curEl);
          updatePath(cur, nextEl);

          setTimeout(function () {
            var last = rest.find(function (e, i) {
              return i === rest.length - 1;
            });
            var lastId = last ? last.id : 0;

            _this2.getNextImg(lastId, function (acc) {
              if (!acc.length) return;

              var newArr = [].concat(_toConsumableArray(rest), _toConsumableArray(acc));
              rec(newArr);
            }, 1);
          }, animDur);
        }, 5000);
      };

      rec(data);
    }
  }]);

  return Presentation;
}();

new Presentation();
'use strict';

var errHandler = function errHandler(err) {
  var errHeading = err.status + ': ' + err.statusText;
  var errContent = err.responseText;

  return console.log(errHeading + ' ' + errContent);
};
// (function{
//   const
// }())
"use strict";
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Easel = function () {
  function Easel(_ref) {
    var _this = this;

    var canvasId = _ref.canvasId,
        config = _ref.config;

    _classCallCheck(this, Easel);

    this.id = canvasId || 'canvas';
    this.config = config;

    this.canvas = new fabric.Canvas(this.id, {
      isDrawingMode: true
    });

    this.history = [];

    this.canvas.freeDrawingBrush.color = this.config.brushColor || '#000000';
    this.canvas.freeDrawingBrush.width = parseInt(this.config.brushSize, 10) || 1;

    fabric.Object.prototype.transparentCorners = false;

    this.listenState(function () {
      _this.saveState();
    });
  }

  _createClass(Easel, [{
    key: 'clear',
    value: function clear() {
      this.canvas.clear();
    }
  }, {
    key: 'save',
    value: function save(callback) {
      var _this2 = this;

      var json = JSON.stringify(this.canvas.toJSON());

      $.post('/create', {
        fabricObject: json,
        beforeSend: callback(null, 'Изображение обрабатывается')
      }, 'json').done(function (data) {
        callback(null, 'Изображение успешно отправлено, нажмите кнопку "ОК" для продолжения');
        _this2.upload(data.id);
      }).fail(function (jqxhr, textStatus, err) {
        console.log(jqxhr);
        callback('\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435.\n          Status: ' + err);
      });
    }
  }, {
    key: 'upload',
    value: function upload(name) {
      var canvas = document.getElementById(this.id);

      canvas.toBlob(function (blob) {
        var formdata = new FormData();
        formdata.append(name, blob);

        $.ajax({
          url: '/upload',
          type: 'post',
          data: formdata,
          processData: false,
          contentType: false
        }).done(function (data) {
          console.log(data);
          // const url = data.path;
          // const href = document.getElementById('link');
          // href.setAttribute('href', url);
          // href.setAttribute('target', '_blank');
          // $(href).text('Ссфлка на картинку');
          // $('#msgBox').after( $(href) );
        });
      }, 'image/png');
    }
  }, {
    key: 'renderLast',
    value: function renderLast() {
      var _this3 = this;

      $.get({
        url: '/render',
        dataType: 'json'
      }).done(function (data) {
        console.log(data);
        _this3.renderFromJson(data);
      }).fail(function (err) {
        return errHandler(err);
      });
    }
  }, {
    key: 'renderFromJson',
    value: function renderFromJson(data) {
      // const d = data instanceof Object ? data : JSON.parse(data);
      // console.log(d);
      return this.canvas.loadFromJSON(data, this.canvas.renderAll.bind(this.canvas));
    }
  }, {
    key: 'resize',
    value: function resize(h, w) {
      var _this4 = this;

      return function (h, w) {
        _this4.clearHistory();
        _this4.saveState();

        _this4.canvas.setHeight(h);
        _this4.canvas.setWidth(w);
        _this4.canvas.renderAll();
      }(h, w);
    }
  }, {
    key: 'hasHistory',
    value: function hasHistory() {
      return this.history.length >= 1 ? true : false;
    }
  }, {
    key: 'getState',
    value: function getState() {
      var state = this.canvas;

      return JSON.stringify(state.toJSON());;
    }
  }, {
    key: 'addState',
    value: function addState(state) {
      var h = this.history.slice();

      var _h = _toArray(h),
          first = _h[0],
          rest = _h.slice(1);

      var newH = h.length >= 10 ? [].concat(_toConsumableArray(rest), [state]) : [].concat(_toConsumableArray(h), [state]);

      return this.history = newH;
    }
  }, {
    key: 'saveState',
    value: function saveState() {
      var state = this.getState();

      return this.addState(state);
    }
  }, {
    key: 'clearHistory',
    value: function clearHistory() {
      return this.history = [];
    }
  }, {
    key: 'getHistory',
    value: function getHistory() {
      return this.history.slice();
    }
  }, {
    key: 'getLastState',
    value: function getLastState() {
      var h = this.getHistory();

      return h[h.length - 2];
    }
  }, {
    key: 'saveHistory',
    value: function saveHistory(arr) {
      this.clearHistory();

      return this.history = arr;
    }
  }, {
    key: 'renderLastState',
    value: function renderLastState(cb) {
      if (!this.hasHistory()) {
        if (cb) cb();
        return this.saveState();
      };

      var state = this.getLastState();
      this.renderFromJson(state);

      var h = this.getHistory();
      var newH = h.length > 2 ? h.slice(0, h.length - 1) : [];
      this.saveHistory(newH);

      return cb ? cb() : null;
    }
  }, {
    key: 'listenState',
    value: function listenState(cb) {
      this.canvas.on('path:created', cb);
    }
  }]);

  return Easel;
}();
'use strict';

var easel = new Easel({
  canvasId: 'canvas',
  config: {
    brushColor: '#000000',
    brushSize: 10
  }
});

var els = {
  frame: document.getElementById('frame'),
  popup: document.getElementById('popup'),
  load: document.getElementById('load'),
  clear: document.getElementById('clear'),
  undo: document.getElementById('undo'),
  save: document.getElementById('save'),
  popupClose: document.getElementById('close'),
  frameCurtain: document.getElementById('curtain'),
  msgBox: document.getElementById('msgBox'),
  msgHeading: document.getElementById('msgHeading')
};

(function () {

  var frameHeight = function frameHeight() {
    return els.frame.clientHeight;
  };
  var frameWidth = function frameWidth() {
    return els.frame.clientWidth;
  };

  var addMsg = function addMsg(err, msg) {
    if (err) {
      $(els.msgHeading).text('Ошибка!');
      $(els.msgBox).text(err);
    } else {
      $(els.msgHeading).text('Успешно!');
      $(els.msgBox).text(msg);
    }
  };

  var handlers = {
    resize: function resize() {
      return easel.resize(frameHeight(), frameWidth());
    },
    clear: function clear() {
      return easel.clear();
    },
    save: function save() {
      return easel.save(addMsg);
    },
    load: function load() {
      return easel.renderLast();
    },
    undo: function undo(cb) {
      return easel.renderLastState(cb);
    },
    hasHistory: function hasHistory() {
      return easel.hasHistory();
    },
    listenState: function listenState(cb) {
      return easel.listenState(cb);
    },
    clearHistory: function clearHistory() {
      return easel.clearHistory();
    }
  };

  handlers.resize();

  $(window).resize(handlers.resize);

  $(els.clear).click(handlers.clear);

  $(els.save).click(function () {
    return animateCurtain({
      forward: {
        before: ableSaveBtn,
        after: [showPopup, handlers.save, handlers.clearHistory]
      },
      reverse: {
        before: showPopup
      }
    });
  });

  $(els.popupClose).click(function () {
    return showPopup({
      reverse: {
        after: function after() {
          return animateCurtain({
            reverse: {
              after: [handlers.clear, ableSaveBtn]
            }
          });
        }
      }
    });
  });

  $(els.load).click(function (ev) {
    ev.preventDefault();
    handlers.load();
  });

  var historyCallback = function historyCallback() {
    if (!handlers.hasHistory()) {
      els.undo.setAttribute('disabled', true);
    } else {
      els.undo.removeAttribute('disabled');
    }
  };

  handlers.listenState(historyCallback);

  $(els.undo).click(function () {
    return handlers.undo(historyCallback);
  });
})();