const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

const { ensureAuthenticated } = require('../utils/authMiddleware');

// Admin routes

router.get('/admin/blog_admin', ensureAuthenticated('/admin'), blogController.getBlogs);
router.post('/admin/blog_admin', ensureAuthenticated('/admin'), blogController.addBlog);
router.put('/admin/blog_admin/:id', ensureAuthenticated('/admin'), blogController.updateBlog);
router.delete('/admin/blog_admin/:id', ensureAuthenticated('/admin'), blogController.deleteBlog);



// User routes
router.get('/user/blog', blogController.getBlogs);
router.get('/user/blog/:id', blogController.getBlogById);

module.exports = router;
