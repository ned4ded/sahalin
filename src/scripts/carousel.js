class Presentation {
  constructor() {
    this.getNextImg(0, acc => {
      if(!acc.length) return;

      this.carousel(acc);
    }, 3);
  }

  getNextImg(id, cb, count) {
    var acc = [];

    const rec = (id, cb, failure) => {
      const path = id ? '/presentation/next/' + id : '/presentation/next';

      return $.post(path, 'json').done(data => {
        acc = [ ...acc, data ];

        if(acc.length >= count) {
          return cb(acc);
        };

        return rec(data.id, cb);
      }).fail(data => {
        if(failure > 3) return cb(acc);

        rec(id, cb, failure ? failure + 1 : 1);
      });
    }

    rec(id, cb);
  }

  carousel(data) {
    if(!data || !data.length) return;
    const curEl = document.getElementById('carousel-current');
    const nextEl = document.getElementById('carousel-next');
    const animDur = 2000;

    const rec = (arr) => {
      const [cur, ...rest] = arr;
      const [next] = rest;

      const updatePath = (el, e) => {
        const path = el.path;
        const attr = "background-image: url('" + path + "')";
        e.setAttribute('style', attr);
      }

      updatePath(cur, curEl);
      updatePath(next, nextEl);

      curEl.classList.add('animate');
      nextEl.classList.add('animate');


      setTimeout(() => {
        nextEl.classList.remove('animate');
        curEl.classList.remove('animate');
        updatePath(next, curEl);
        updatePath(cur, nextEl);

        setTimeout(() => {
          const last = rest.find((e, i) => i === (rest.length - 1));
          const lastId = last ? last.id : 0;

          this.getNextImg(lastId, acc => {
            if(!acc.length) return;

            const newArr = [...rest, ...acc];
            rec(newArr);
          }, 1);
        }, animDur);
      }, 5000);
    }

    rec(data);
  }
}

new Presentation();
