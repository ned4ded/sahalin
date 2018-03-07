const easel = new Easel({
  canvasId: 'canvas',
  config: {
    brushColor: '#000000',
    brushSize: 10,
  }
});

const els = {
  frame: document.getElementById('frame'),
  popup: document.getElementById('popup'),
  load: document.getElementById('load'),
  clear: document.getElementById('clear'),
  save: document.getElementById('save'),
  popupClose:  document.getElementById('close'),
  frameCurtain:  document.getElementById('curtain'),
  msgBox: document.getElementById('msgBox'),
  msgHeading: document.getElementById('msgHeading'),
};

(function() {

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
    save: () => easel.save(addMsg),
    load: () => easel.renderLast(),
  }


  handlers.resize();

  $( window ).resize( handlers.resize );

  $( els.clear ).click( handlers.clear );

  $( els.save ).click( () => animateCurtain({
    forward: {
      before: ableSaveBtn,
      after: [showPopup, handlers.save],
    },
    reverse: {
      before: showPopup,
    }
  }));

  $( els.popupClose ).click( () => showPopup({
    reverse: {
      after: () => animateCurtain({
        reverse: {
          after: [handlers.clear, ableSaveBtn],
        }
      }),
    }
  }));

  $( els.load ).click( function(ev) {
    ev.preventDefault();
    handlers.load();
  });


})();
