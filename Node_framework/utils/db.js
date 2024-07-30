const mongoose = require('mongoose');
const Image = require('../models/image');
const Program = require('../models/program');
const Blog = require('../models/blog')
const Testimonial = require('../models/testimonial');
const uri = "mongodb+srv://nadadhyanaweb2024:bBstY6L8t5yhGNxW@team4.aslylhv.mongodb.net/?retryWrites=true&w=majority&appName=Team4";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const conn = () => {
	mongoose.connect(uri, clientOptions);
	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
		console.log('db connection success!')
	});
    Image.init();
	Program.init();
	Blog.init();
	Testimonial.init();
}
module.exports = {
	conn: conn
}