const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller');
const ensureLogin = require('connect-ensure-login');
const isLoggedIn = (req, res, next) => ensureLogin.ensureLoggedIn()(req, res, next);


router.get('/', auth_controller.auth_login);

router.post(
  '/',
  auth_controller.auth_process,
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;
