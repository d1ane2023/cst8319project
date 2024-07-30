const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Admin = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['super-admin', 'admin'], default: 'admin' }
}, { timestamps: true });

Admin.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', Admin);
