const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const auth = (login, password, cb) => {
  User.findOne({ username: login })
    .exec(function (err, user) {
      if(err) {
        return cb(err);
      } else if(!user) {
        const err = new Error('User not found.');
        err.status = 401;
        return cb(err);
      }

      bcrypt.compare(password, user.password, function(err, result) {
        if( result == true) {
          return cb(null, user);
        } else {
          return cb();
        }
      });
    });
}

exports.auth_login = (req, res) => {
  res.render('login.hbs');
}

exports.auth_process = (req, res, next) => {
  const login = req.body.login;
  const password = req.body.password;

  if(login && password) {
    auth(login, password, function(error, user) {
      if(error || !user) {
        const err = new Error('Wrong login or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/');
      }
    })
  }
}

exports.auth_logout = (req, res, next) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
}
