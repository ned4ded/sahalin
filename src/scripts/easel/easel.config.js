(function() {
  const canvasId = 'canvas';

  if(!document.getElementById(canvasId)) return;

  const els = {
    frame: document.getElementById('frame'),
    popup: document.getElementById('popup'),
    load: document.getElementById('load'),
    clear: document.getElementById('clear'),
    undo: document.getElementById('undo'),
    save: document.getElementById('save'),
    popupClose:  document.getElementById('close'),
    frameCurtain:  document.getElementById('curtain'),
    msgBox: document.getElementById('msgBox'),
    msgHeading: document.getElementById('msgHeading'),
  };

  const easel = new Easel({
    canvasId: 'canvas',
    config: {
      brushColor: '#000000',
      brushSize: 10,
    }
  });

  if(!easel) console.log('no easel');

  const frameHeight = () => els.frame.clientHeight;
  const frameWidth = () => els.frame.clientWidth;

  const addMsg = (err, msg) => {
    if(err) {
      $( els.msgHeading ).text('Ошибка!');
      $( els.msgBox ).text(err);
    } else {
      $( els.msgHeading ).text('Успешно!');
      $( els.msgBox ).text(msg);
    }
  }

  const handlers = {
    resize: () => easel.resize(frameHeight(), frameWidth()),
    clear: () => easel.clear(),
    load: () => easel.renderLast(),
    undo: cb => easel.renderLastState(cb),
    hasHistory: () => easel.hasHistory(),
    listenState: cb => easel.listenState(cb),
    clearHistory: () => easel.clearHistory(),
    getState: () => easel.getState(),
    getBlob: cb => easel.getBlob(cb),
    upload: name => handlers.getBlob((b) => {
      const formdata = new FormData();
      formdata.append(name, b);

      $.ajax({ url: '/upload', type: 'post', data: formdata, processData: false, contentType: false,})
        .done((data) => {
          // console.log(data);
        });
    }),
    save: () => {
      const json = handlers.getState();

      $.post('/create', {
        fabricObject: json,
        beforeSend: addMsg(null, 'Изображение обрабатывается'),
      }, 'json')
        .done(data => {
          const id = data.id;

          addMsg(null, 'Изображение успешно отправлено, нажмите кнопку "ОК" для продолжения');
          handlers.upload(data.id);
        });
    },

  }

  handlers.resize();

  $( window ).resize( handlers.resize );

  $( els.clear ).click( handlers.clear );

  $( els.save ).click( () => animateCurtain(els.frameCurtain, {
    forward: {
      before: () => ableSaveBtn(els.save),
      after: [() => showPopup(els.popup), handlers.save, handlers.clearHistory],
    },
    reverse: {
      before: () => showPopup(els.popup),
    }
  }));

  $( els.popupClose ).click( () => showPopup(els.popup, {
    reverse: {
      after: () => animateCurtain(els.frameCurtain, {
        reverse: {
          after: [handlers.clear, () => ableSaveBtn(els.save)],
        }
      }),
    }
  }));

  $( els.load ).click( function(ev) {
    ev.preventDefault();
    handlers.load();
  });

  const historyCallback = () => {
    if(!handlers.hasHistory()) {
      els.undo.setAttribute('disabled', true);
    } else {
      els.undo.removeAttribute('disabled');
    }
  }

  handlers.listenState(historyCallback);

  $( els.undo ).click( () => handlers.undo(historyCallback) );
})();
