const mongoose = require('mongoose');
const User = require('../models/user.model');

exports.get = (id, callback) => {
  return User.findById(id, (err, user) => {
    if(err) callback(err);
    return callback(null, user);
  });
}

exports.create = (data, callback) => {
  return User.create(data, (err, user) => {
    if(err) callback(err);
    return callback(null, user);
  });
}
