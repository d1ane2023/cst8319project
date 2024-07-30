const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Program = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    quote: {
        type: Number,  // Using quote as the limit of enrollment
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        enum: ['online', 'in-person', 'outreach'],
        required: true,
    },
    registrations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Program', Program);

