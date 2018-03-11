class Easel {
  constructor({canvasId, config}) {
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

    this.listenState(() => {
      this.saveState();
    });

    this.listenMouse(() => {
      if(!this.hasHistory()) {
        return this.saveState();
      }
    });
  }

  clear() {
    this.canvas.clear();

    this.clearHistory();
  }

  getBlob(cb, type) {
    if(!cb) return;

    const t = type? type : 'image/png';
    const el = this.element;

    el.toBlob((blob) => {
      return cb(blob);
    }, t);
  }

  renderFromJson(data) {
    return this.canvas.loadFromJSON(data, this.canvas.renderAll.bind(this.canvas));
  }

  resize(h, w) {
    return ((h, w) => {
      this.clearHistory();
      this.saveState();

      this.canvas.setHeight(h);
      this.canvas.setWidth(w);
      this.canvas.renderAll();
    })(h, w);
  }

  hasHistory() {
    return this.history.length >= 1 ? true : false;
  }

  getState() {
    const state = this.canvas;

    return JSON.stringify( state.toJSON() );;
  }

  addState(state) {
    const h = this.history.slice();

    const [first, ...rest] = h;

    const newH = (h.length >= 10) ? [...rest, state] : [...h, state];

    return this.history = newH;
  }

  saveState() {
    const state = this.getState();

    return this.addState(state);
  }

  clearHistory() {
    return this.history = [];
  }

  getHistory() {
    return this.history.slice();
  }

  getLastState() {
    const h = this.getHistory();

    return h[h.length - 2];
  }

  saveHistory(arr) {
    this.clearHistory();

    return this.history = arr;
  }

  renderLastState(cb) {
    if(!this.hasHistory()) {
      if(cb) cb();
      return this.saveState();
    };

    const state = this.getLastState();
    this.renderFromJson(state);

    const h = this.getHistory();
    const newH = (h.length > 2) ? h.slice(0, h.length - 1) : [];
    this.saveHistory(newH);

    return cb ? cb() : null;
  }

  listenState(cb) {
    this.canvas.on('path:created', cb);
  }

  listenMouse(cb) {
    this.canvas.on('mouse:down', cb);
  }
}
