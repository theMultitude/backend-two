const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true
  },
  note: [mongoose.Schema.ObjectId],
});

module.exports = mongoose.model('Tag', TagSchema);
