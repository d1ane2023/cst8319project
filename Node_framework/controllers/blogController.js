const Blog = require('../models/blog');

exports.addBlog = async (req, res) => {
	try {
		const { subject, text } = req.body;
		const newBlog = new Blog({ subject, text });
		await newBlog.save();
		req.flash('success', 'Blog added successfully.');

		res.redirect('/admin/blog_admin');
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).redirect('/admin/blog_admin');

	}
};

exports.updateBlog = async (req, res) => {
	try {
		const { id } = req.params;
		const { subject, text } = req.body;
		const blog = await Blog.findById(id);
		if (!blog) {
			req.flash('error', 'Blog not found.');

			return res.status(404).redirect('/admin/blog_admin');

		}
		blog.subject = subject;
		blog.text = text;
		await blog.save();
		req.flash('success', 'Blog updated successfully.');

		res.redirect('/admin/blog_admin');
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).redirect('/admin/blog_admin');

	}
};

exports.deleteBlog = async (req, res) => {
	try {
		const { id } = req.params;
		await Blog.findByIdAndDelete(id);
		req.flash('success', 'Blog deleted successfully.');

		res.redirect('/admin/blog_admin');
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).redirect('/admin/blog_admin');

	}
};

exports.getBlogs = async (req, res) => {
	try {
		const blogs = await Blog.find().sort({ date: -1 });

		const template = req.path === '/admin/blog_admin' ? 'admin/blog_admin' : 'user/blogs';

		res.render(template, { blogs, user: req.user});
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');

		res.status(500).redirect('/admin/blog_admin');

	}
};

exports.getBlogById = async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id);
		if (!blog) {
			req.flash('error', 'Blog not found.');

			return res.status(404).redirect('/user/blogs');
		}
		res.render('user/blog_detail', { blog, user: req.user, success: req.flash('success'), error: req.flash('error') });
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).redirect('/user/blogs');

	}
};
