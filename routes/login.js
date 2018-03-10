const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/authentication');

router.get('/', auth_controller.auth_login);

router.post(
  '/',
  auth_controller.auth_process,
  function(req, res) {
    res.redirect('/home');
  });

module.exports = router;
