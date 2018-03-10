const errHandler = (err) => {
  const errHeading = err.status + ': ' + err.statusText;
  const errContent = err.responseText;

  return console.log(errHeading + ' ' + errContent);
}
