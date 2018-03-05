const express = require('express');
const router = express.Router();
const canvas_controller = require('../controllers/canvas.controller');


router.get('/', function (res, req, next) {
  return canvas_controller.canvas_index(res, req, next);
});

module.exports = router;
