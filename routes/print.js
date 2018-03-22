const express = require('express');
const canvas_controller = require('../controllers/canvas');
const router = express.Router();

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const referer = req.get('Referrer');

  const callback = (err, instance) => {

    if(err) return next(err);

    return res.render('print.hbs', { instance, referer });
  }

  return canvas_controller.canvas_get_by_id(id, callback);
});

module.exports = router;
