const mongoose = require('mongoose');

require('./user.js');
require('./image.js')

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required:true
  },
  // image: imageSchema,
  // user: {
  //   type: mongoose.Schema.ObjectId, ref: "User"
  // }
});

module.exports = mongoose.model('Note', NoteSchema);
