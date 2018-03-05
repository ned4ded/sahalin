const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth.controller');


router.get('/', auth_controller.auth_login);

router.post('/', auth_controller.auth_process);

// router.post('/logout',);

module.exports = router;
