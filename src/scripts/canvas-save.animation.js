
  const anDelay = 10000;
  const anDur = 500;

  function handleCallbacks(callbacks) {
    if(!callbacks) return;

    if(callbacks instanceof Array) {
      if(!callbacks.length) return;
      const [ first, ...last ] = callbacks;

      first();

      return handleCallbacks(last);
    }

    return callbacks();
  }

  function ableSaveBtn()  {
    if(els.save.hasAttribute('disabled')) {
      els.save.removeAttribute('disabled');
    } else {
      els.save.setAttribute('disabled', true)
    }
  };

  function animateCurtain({ forward, reverse }) {
    const frc = $( els.frameCurtain );

    if(frc.hasClass('shown')) {
      if(reverse && reverse.before) handleCallbacks(reverse.before);

      frc.animate({
        width: '0%',
      }, anDur, function() {
        if(reverse && reverse.after) handleCallbacks(reverse.after);
        frc.removeClass('shown');
      })

    } else {
      if(forward && forward.before) handleCallbacks(forward.before);
      frc.animate({
        width: '100%',
      }, anDur, function() {
        frc.addClass('shown');
        if(forward && forward.after) handleCallbacks(forward.after);
      });
    }
  }

  function showPopup({ forward, reverse } = {}) {
    const pu = $( els.popup );

    if(pu.hasClass('shown')) {
      if(reverse && reverse.before) handleCallbacks(reverse.before);

      pu.animate({
        opacity: 0,
      }, 200, function() {
        if(reverse && reverse.after) handleCallbacks(reverse.after);
        pu.removeClass('shown');
        pu.hide();
      })

    } else {
      pu.show();
      if(forward && forward.before) handleCallbacks(forward.before);
      pu.animate({
        opacity: 1,
      }, 200, function() {
        pu.addClass('shown');
        if(forward && forward.after) handleCallbacks(forward.after);
      });
    }
  }
