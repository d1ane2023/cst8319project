const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Testimonial = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    isApproved: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Testimonial', Testimonial);
