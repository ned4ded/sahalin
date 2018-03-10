const User = require('../models/user.schema');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const msgs = require('../db/error-messages').messages;

passport.use(new Strategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: msgs.wrongLogin }); }

      bcrypt.compare(password, user.password, function (err, result) {
          if(err) { return done(err) };
          if(!result) return done(null, false, { message: msgs.wrongPassword })

          return done(null, user)
      });
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findOne({ _id: id }, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

exports.auth_login = (req, res, next) => {
  const errors = req.flash('error');
  const error = errors.length > 0 ? errors[0] : null;

  res.render('login.hbs', { error });
}

exports.auth_process = function(req, res, next) {
  return passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
}

exports.auth_logout = (req, res) => {
  req.logout();
  res.redirect('/');
}
