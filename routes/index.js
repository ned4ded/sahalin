const express = require('express');
const router = express.Router();
const canvas_controller = require('../controllers/canvas');


router.get('/', function (res, req, next) {
  return canvas_controller.canvas_index(res, req, next);
});

router.post('/create', canvas_controller.canvas_add);

router.post('/upload', canvas_controller.canvas_upload);

router.get('/delete/:id', canvas_controller.canvas_delete);

module.exports = router;
