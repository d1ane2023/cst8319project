const Testimonial = require('../models/testimonial');
const User = require('../models/user');

// Function to get approved testimonials
exports.getApprovedTestimonials = async (req, res) => {
    try {

        const testimonials = await Testimonial.find({ isApproved: true }).populate({
        path: 'user',
        select:'username photo'
        });
        res.render('user/testimonials', {

            testimonials: testimonials,
            user: req.user,
        });
    } catch (err) {
        req.flash('error', 'Server Error. Please try again later.');

        res.status(500).redirect('/user/testimonials');

    }
};

// Function to submit a new testimonial
exports.submitTestimonial = async (req, res) => {
    const { text } = req.body;
    const userId = req.user._id;

    try {
        const newTestimonial = new Testimonial({
            user: userId,
            text,
            isApproved: false, // New testimonials are not approved by default
        });

        await newTestimonial.save();

        req.flash('success', 'Testimonial submitted successfully! It will be reviewed shortly.');
        res.redirect('/user/testimonials');
    } catch (err) {
        req.flash('error', 'There was an error submitting your testimonial. Please try again.');
        res.redirect('/user/testimonials');

    }
};

// Function to get all testimonials
exports.getAllTestimonials = async (req, res) => {

	try {
	    const testimonials = await Testimonial.find().populate('user', 'username');
	    console.log('Fetched testimonials:', testimonials);
	    res.render('admin/testimonials_admin', {
		testimonials: testimonials,
		user: req.user,
	    });
	} catch (err) {
	    console.error('Error fetching testimonials:', err);
	    req.flash('error', 'Server Error. Please try again later.');
	    res.status(500).redirect('/admin/testimonials_admin');
	}
    };


// Function to approve a testimonial
exports.approveTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndUpdate(req.params.id, { isApproved: true });

        req.flash('success', 'Testimonial approved successfully.');
        res.redirect('/admin/testimonials_admin');
    } catch (err) {
        req.flash('error', 'Server Error. Please try again later.');
        res.status(500).redirect('/admin/testimonials_admin');

    }
};

// Function to unapprove a testimonial
exports.unapproveTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndUpdate(req.params.id, { isApproved: false });

        req.flash('success', 'Testimonial unapproved successfully.');
        res.redirect('/admin/testimonials_admin');
    } catch (err) {
        req.flash('error', 'Server Error. Please try again later.');
        res.status(500).redirect('/admin/testimonials_admin');

    }
};
