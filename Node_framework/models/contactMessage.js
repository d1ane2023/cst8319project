const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactMessageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isReplied: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
