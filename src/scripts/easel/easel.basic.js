class Easel {
  constructor({canvasId, config}) {
    this.id = canvasId || 'canvas';
    this.config = config;

    this.canvas = new fabric.Canvas(this.id, {
      isDrawingMode: true
    });

    this.canvas.freeDrawingBrush.color = this.config.brushColor || '#000000';
    this.canvas.freeDrawingBrush.width = parseInt(this.config.brushSize, 10) || 1;

    fabric.Object.prototype.transparentCorners = false;
  }


  clear() {
    this.canvas.clear();
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
      this.canvas.loadFromJSON(data, this.canvas.renderAll.bind(this.canvas));
    }).fail(err => errHandler(err));
  }

  resize(h, w) {
    return ((h, w) => {
      this.canvas.setHeight(h);
      this.canvas.setWidth(w);
      this.canvas.renderAll();
    })(h, w);
  }
}
