const express = require('express');
const router = express.Router();
const canvas_controller = require('../controllers/canvas.controller');


router.get('/', function (res, req, next) {
  return canvas_controller.canvas_index(res, req, next);
});

router.post('/create', canvas_controller.canvas_create);

router.post('/upload', canvas_controller.canvas_upload);

router.get('/render', canvas_controller.canvas_send);

module.exports = router;
