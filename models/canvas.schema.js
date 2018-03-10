const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CanvasSchema = new Schema({
  confirmed: Boolean,
  fabricObject: {},
  filePath: String,
  created: {
        type: Date,
        default: Date.now
      },
});

module.exports = mongoose.model('Canvas', CanvasSchema);
