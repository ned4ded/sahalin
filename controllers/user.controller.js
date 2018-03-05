const User = require('../models/user.model');

exports.getUser = (id) => {
  return User.findOne(id);
}
