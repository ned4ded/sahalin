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

function ableSaveBtn(el) {
  if (el.hasAttribute('disabled')) {
    el.removeAttribute('disabled');
  } else {
    el.setAttribute('disabled', true);
  }
};

function animateCurtain(el, _ref) {
  var forward = _ref.forward,
      reverse = _ref.reverse;

  var frc = $(el);

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

function showPopup(el) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      forward = _ref2.forward,
      reverse = _ref2.reverse;

  var pu = $(el);

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

;

(function () {
  if (!document.getElementById('carousel')) return;

  new Presentation();
})();
'use strict';

var errHandler = function errHandler(err) {
  var errHeading = err.status + ': ' + err.statusText;
  var errContent = err.responseText;

  return console.log(errHeading + ' ' + errContent);
};
'use strict';

(function () {
  var el = document.getElementById('printing');

  if (!el) return;

  var printer = function printer() {
    return window.print();
  };

  var reprintBtn = document.getElementById('print-btn');

  if ($(el).data('printOnLoad')) printer();

  $(reprintBtn).click(printer);
})();
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

    this.element = document.getElementById(this.id);

    this.history = [];

    this.canvas.freeDrawingBrush.color = this.config.brushColor || '#000000';
    this.canvas.freeDrawingBrush.width = parseInt(this.config.brushSize, 10) || 1;

    fabric.Object.prototype.transparentCorners = false;

    this.listenState(function () {
      _this.saveState();
    });

    this.listenMouse(function () {
      if (!_this.hasHistory()) {
        return _this.saveState();
      }
    });
  }

  _createClass(Easel, [{
    key: 'clear',
    value: function clear() {
      this.canvas.clear();

      this.clearHistory();
    }
  }, {
    key: 'getBlob',
    value: function getBlob(cb, type) {
      if (!cb) return;

      var t = type ? type : 'image/png';
      var el = this.element;

      el.toBlob(function (blob) {
        return cb(blob);
      }, t);
    }
  }, {
    key: 'renderFromJson',
    value: function renderFromJson(data) {
      return this.canvas.loadFromJSON(data, this.canvas.renderAll.bind(this.canvas));
    }
  }, {
    key: 'resize',
    value: function resize(h, w) {
      var _this2 = this;

      return function (h, w) {
        _this2.clearHistory();
        _this2.saveState();

        _this2.canvas.setHeight(h);
        _this2.canvas.setWidth(w);
        _this2.canvas.renderAll();
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
  }, {
    key: 'listenMouse',
    value: function listenMouse(cb) {
      this.canvas.on('mouse:down', cb);
    }
  }]);

  return Easel;
}();
'use strict';

(function () {
  var canvasId = 'canvas';

  if (!document.getElementById(canvasId)) return;

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

  var easel = new Easel({
    canvasId: 'canvas',
    config: {
      brushColor: '#000000',
      brushSize: 10
    }
  });

  if (!easel) console.log('no easel');

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
    },
    getState: function getState() {
      return easel.getState();
    },
    getBlob: function getBlob(cb) {
      return easel.getBlob(cb);
    },
    upload: function upload(name) {
      return handlers.getBlob(function (b) {
        var formdata = new FormData();
        formdata.append(name, b);

        $.ajax({ url: '/upload', type: 'post', data: formdata, processData: false, contentType: false }).done(function (data) {
          // console.log(data);
        });
      });
    },
    save: function save() {
      var json = handlers.getState();

      $.post('/create', {
        fabricObject: json,
        beforeSend: addMsg(null, 'Изображение обрабатывается')
      }, 'json').done(function (data) {
        var id = data.id;

        addMsg(null, 'Изображение успешно отправлено, нажмите кнопку "ОК" для продолжения');
        handlers.upload(data.id);
      });
    }

  };

  handlers.resize();

  $(window).resize(handlers.resize);

  $(els.clear).click(handlers.clear);

  $(els.save).click(function () {
    return animateCurtain(els.frameCurtain, {
      forward: {
        before: function before() {
          return ableSaveBtn(els.save);
        },
        after: [function () {
          return showPopup(els.popup);
        }, handlers.save, handlers.clearHistory]
      },
      reverse: {
        before: function before() {
          return showPopup(els.popup);
        }
      }
    });
  });

  $(els.popupClose).click(function () {
    return showPopup(els.popup, {
      reverse: {
        after: function after() {
          return animateCurtain(els.frameCurtain, {
            reverse: {
              after: [handlers.clear, function () {
                return ableSaveBtn(els.save);
              }]
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