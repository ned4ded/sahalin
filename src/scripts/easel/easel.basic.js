class Easel {
  constructor({canvasId, config}) {
    this.id = canvasId || 'canvas';
    this.config = config;

    this.canvas = new fabric.Canvas(this.id, {
      isDrawingMode: true
    });

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

  save(callback) {
    const json = JSON.stringify( this.canvas.toJSON() );

    $.post(
      '/create',
      {
        fabricObject: json,
        beforeSend: callback(null, 'Изображение обрабатывается'),
      },
      'json'
    ).done((data) => {
          callback(null, 'Изображение успешно отправлено, нажмите кнопку "ОК" для продолжения');
          this.upload(data.id);
        })
      .fail(function(jqxhr, textStatus, err) {
        console.log(jqxhr);
        callback(`Произошла ошибка. Попробуйте повторить действие.
          Status: ${err}`);
      });


  }

  upload(name) {
    const canvas = document.getElementById(this.id);

    canvas.toBlob((blob) => {
      const formdata = new FormData();
      formdata.append(name, blob);

      $.ajax({
        url: '/upload',
        type: 'post',
        data: formdata,
        processData: false,
        contentType: false,
      }).done((data) => {
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

  renderLast() {
    $.get({
      url: '/render',
      dataType: 'json'
    }).done((data) => {
      console.log(data);
      this.renderFromJson(data);
    }).fail(err => errHandler(err));
  }

  renderFromJson(data) {
    // const d = data instanceof Object ? data : JSON.parse(data);
    // console.log(d);
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
