const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Blog = new Schema({
	subject: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model('Blog', Blog)