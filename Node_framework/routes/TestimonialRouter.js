const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/authMiddleware');
const testimonialController = require('../controllers/testimonialController');

// User
// Route to get approved testimonials
router.get('/user/testimonials', testimonialController.getApprovedTestimonials);

// Route to submit a new testimonial
router.post('/user/testimonials', ensureAuthenticated('/login'), testimonialController.submitTestimonial);

// Admin
// Route to get all testimonials
router.get('/admin/testimonials_admin', ensureAuthenticated('/admin'), testimonialController.getAllTestimonials);

// Route to approve a testimonial
router.post('/admin/testimonials_admin/approve/:id', ensureAuthenticated('/admin'), testimonialController.approveTestimonial);

// Route to unapprove a testimonial
router.post('/admin/testimonials_admin/unapprove/:id', ensureAuthenticated('/admin'), testimonialController.unapproveTestimonial);

module.exports = router;
