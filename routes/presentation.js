const express = require('express');
const canvas_controller = require('../controllers/canvas');

const router = express.Router();

router.get('/', function(req, res) {
  res.render('presentation.hbs');
});

router.get('/confirmed', (req, res) => {
  const callback = (err, arr) => {
    if(err) return next(err);

    res.json(arr);
  }
  canvas_controller.canvas_get_confirmed(callback)
});

router.post('/next/:id', (req, res) => {
  const id = req.params.id;

  const callback = (err, el) => {
    if(err) return next(err);

    res.json(el);
  }

  canvas_controller.canvas_get_next_presentation_link(callback, id)
});

router.post('/next', (req, res) => {
  const callback = (err, el) => {
    if(err) return next(err);

    res.json(el);
  }

  canvas_controller.canvas_get_next_presentation_link(callback);
});

module.exports = router;
