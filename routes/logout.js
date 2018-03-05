const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller');

router.get('/', auth_controller.auth_logout);

module.exports = router;
