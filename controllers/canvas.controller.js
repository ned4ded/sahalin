const Canvas = require('../models/canvas.model');
const formidable = require('formidable');
const util = require('util');
const fs = require('fs');

exports.canvas_create = (req, res, next) => {
  const data = {
    fabricObject : req.body.fabricObject,
    filePath: '',
    confirmed: true,
  }

  Canvas.create(data, (err, canvas) => {
    if(err) {
      next(err);
    };

    return res.json({ id: canvas._id });
  });
}

exports.canvas_upload = (req, res, next) => {
  const form = new formidable.IncomingForm();
  var id, path;

  form.encoding = 'utf-8';

  const staticFolder = '/uploads';

  form.uploadDir = __dirname + '/../www' + staticFolder;

  form.on('error', function(err) {
        next(err);
    });

  form.on('fileBegin', function(field, file) {
    id = field;
    path = staticFolder + '/' + field + '.png';
    file.path = form.uploadDir + "/" + field + '.png';
  });

  form.on('end', function() {
    const callback = (err, canvas) => {
      if(err) next(err);

      res.json({ path: canvas.filePath });
    };

    canvas_update(id, { filePath: path }, callback);
  });
}

const canvas_update = (id, data, callback) => {

  Canvas.findById(id, function (err, canvas) {
  if (err) return callback(err);

  canvas.set(data);

  canvas.save(function (err, updatedCanvas) {
    if (err) return callback(err);
    callback(null, updatedCanvas);
  });
});
}

exports.module = {
  canvas_update,
}

exports.canvas_send = (req, res) => {
  Canvas.findOne({}, {}, { sort: { 'created' : -1 } }, function(err, img) {
    if(err) {
      res.json(false);
      next(err);
    };

    return res.json(img.fabricObject);
  });
}

exports.canvas_index = (req, res) => {
  res.render('index.hbs');
}
