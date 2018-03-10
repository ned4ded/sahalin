const express = require('express');
const canvas_controller = require('../controllers/canvas');
const router = express.Router();

router.get('/', function(req, res, next) {
  const isAll = req.query.confirmed;

  const callback = (err, arr) => {
    if(err) return next(err);

    res.render('moderate.hbs', { canvas: arr, all: isAll });
  }

  if(isAll) {
    canvas_controller.canvas_get_all(callback);
  } else {
    canvas_controller.canvas_get_unconfirmed(callback);
  }
});

router.get('/confirm/:id', canvas_controller.canvas_confirm);

router.get('/unconfirm/:id', canvas_controller.canvas_unconfirm);

module.exports = router;
