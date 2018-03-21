const canvas = require('../models/canvas.logic');
const msgs = require('../db/error-messages');
const formidable = require('formidable');
const fs = require('fs');

exports.canvas_add = (req, res, next) => {
  const data = {
    fabricObject : req.body.fabricObject,
    filePath: '',
    confirmed: true,
  }

  canvas.create(data, (err, id) => {
    if(err) return next(err);

    res.json({ id });
  });
}

exports.canvas_confirm = (req, res, next) => {
  const id = req.params.id;
  const referer = req.get('Referrer');

  const callback = (err, instance) => {
    if(err) return next(err);

    return res.redirect(referer);
  };

  canvas.getAndUpdate(id, { confirmed: true }, callback);
}

exports.canvas_unconfirm = (req, res, next) => {
  const id = req.params.id;
  const referer = req.get('Referrer');

  const callback = (err, instance) => {
    if(err) return next(err);

    return res.redirect(referer);
  };

  canvas.getAndUpdate(id, { confirmed: false }, callback);
}

exports.canvas_upload = (req, res, next) => {
  const form = new formidable.IncomingForm();
  var id, path;

  form.encoding = 'utf-8';

  form.keepExtensions = true;

  const staticFolder = '/uploads';

  form.uploadDir = __dirname + '/../www' + staticFolder;

  form.on('error', function(err) {
        next(err);
        res.status(500);
        return;
    });

  form.on('fileBegin', function(field, file) {
    id = field;
    path = staticFolder + '/' + field + '.png';
    file.path = form.uploadDir + "/" + field + '.png';
  });

  form.on('progress', function(res, exp) {
    // console.log('resieved: ' + res);
    // console.log('expected: ' + exp + '\n');
  });

  form.on('aborted', function() {

  });

  form.parse(req, function(err, fields, files) {

  });

  form.on('end', function() {
    const callback = (err, instance) => {
      if(err) return next(err);

      res.json({ path: 'moderate/confirm/' + instance._id });
    };

    canvas.getAndUpdate(id, { filePath: path }, callback);
  });
}

exports.canvas_index = (req, res) => {
  res.render('index.hbs');
}

exports.canvas_delete = (req, res, next) => {
  const id = req.params.id;
  const referer = req.get('Referrer');


  const callback = (err, id) => {
    if(err) return next(err);

    return res.redirect(referer);
  }

  canvas.removeById(id, callback);
}

exports.canvas_get_unconfirmed = (cb) => {
  const callback = (err, list) => {
    if(err) return cb(err);

    return cb(null, list);
  };

  canvas.getAllUnconfirmed(callback);
}

exports.canvas_get_all = (cb) => {
  const callback = (err, list) => {
    if(err) return cb(err);

    return cb(null, list);
  };

  canvas.getAll(callback);
}

exports.canvas_get_confirmed = (cb) => {
  const callback = (err, list) => {
    if(err) return cb(err);

    return cb(null, list);
  };

  canvas.getAllConfirmed(callback);
}

exports.canvas_get_next_presentation_link = (cb, id) => {
  const callback = (err, list) => {
    if(err) return cb(err);

    if(id) {
      const i = list.findIndex(e => e.id.toString() === id);

      return cb(null, (i === -1 || (!list[i + 1])) ? list[0] : list[i + 1]);
    }

    return cb(null, list[0]);
  };

  canvas.getAllConfirmed(callback);
}
