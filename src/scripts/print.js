(() => {
  const el = document.getElementById('printing');

  if(!el) return;

  const printer = () => {
    return window.print();
  };

  const reprintBtn = document.getElementById('print-btn');

  if($(el).data('printOnLoad')) printer();

  $(reprintBtn).click(printer);
})();
