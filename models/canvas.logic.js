const mongoose = require('mongoose');
const Canvas = require('../models/canvas.schema');
const msgs = require('../db/error-messages');
const fs = require('fs');


const create = (data, callback) => {
  Canvas.create(data, (err, instance) => {
    if(err) return callback(err);

    return callback(null, instance._id);
  });
}

const getById = (id, callback) => {
  Canvas.findById(id, (err, instance) => {
    if(err) return callback(err);

    return callback(null, instance);
  });
}

const get = (querry, sort, callback) => {
  const q = querry instanceof Object ? querry : {};

  Canvas.find(querry)
    .sort(sort)
    .select('_id created confirmed filePath')
    .exec(function(err, data) {
      if(err) return callback(err);


      const parsed = data.map(e => {
        return {
          id: e._id,
          created: e.created.toLocaleDateString(),
          confirmed: e.confirmed,
          path: e.filePath,
        }
      });

      return callback(null, parsed)
    });
}

const getAllUnconfirmed = callback => get({ 'confirmed': false }, { 'created': 1 }, callback);
const getAllConfirmed = callback => get({ 'confirmed': true }, { 'created': 1 }, callback);
const getAll = callback => get({}, { 'created': 1 }, callback);

const update = (instance, data, callback) => {
  instance.set(data);

  instance.save((err, updatedCanvas) => {
    if(err) return callback(err);

    return callback(null, updatedCanvas);
  })
}

const removeById = (id, callback) => {
  Canvas.findByIdAndRemove(id, (err, instance) => {
    if(err) return callback(err);

    const filePath = (instance instanceof Object) ? instance.filePath : null;

    if(filePath) {
      const relPath = __dirname + '/../www/' + filePath;

      fs.unlink(relPath, (err) => {
        if(err) {
          return callback(err);
        }
      });
    }

    return callback(null, instance ? instance._id : null);
  });
}

const getAndUpdate = (id, data, callback) => {
  getById(id, (err, instance) => {
    if(err) return callback(err);

    return update(instance, data, callback);
  });
}

const findLast = (field, callback) => {
  Canvas.findOne({}, {}, { sort: { [field] : -1 } }, (err, instance) => {
    if(err) return callback(err);

    return callback(null, instance);
  });
}

const findLastCreated = (callback) => findLast('created', callback);

const getFabricObject = (instance, callback) => {
  const obj = instance ? instance.fabricObject : null;
  const err = new Error(msgs.instanceNull, __filename);
  return obj ? callback(null, obj) : callback(err);
}

module.exports = {
  create, update, getAndUpdate, findLast, findLastCreated, getAll, getAllConfirmed, getAllUnconfirmed, getFabricObject, removeById
}
