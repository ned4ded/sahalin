

const getImgs = () => {
  return $.get('/presentation/confirmed', 'json').done((data) => {
    carousel(data);
  });
}

const carousel = (data) => {
  if(!data || !data.length) return;

  const rec = (arr) => {
    const [cur, ...rest] = arr;
    if(!cur) return rec(data);
    const path = cur.path;

    const el = document.getElementById('carousel');

    const attr = "background-image: url('" + path + "')";

    el.setAttribute('style', attr);

    setTimeout(() => {
      rec(rest);
    }, 5000);
  }

  rec(data);
}

getImgs();
