const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Image = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String
      },
      url: {
        type: String,
        unique: true
      },
    }, {
      timestamps: true
});

module.exports = mongoose.model('Image', Image)