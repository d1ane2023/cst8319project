// AdminRouter.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, ensureSuperAdmin } = require('../utils/authMiddleware');
const methodOverride = require('method-override'); // Require method-override
const programController = require('../controllers/programController');
const userController = require('../controllers/userController');
const contactController = require('../controllers/contactController');
const adminController = require('../controllers/adminController');

router.use(methodOverride('_method'));

// Admin Pages
// GET
router.get('/admin/Users_admin', ensureAuthenticated('/admin'), userController.getUsers);
router.get('/admin/Users_admin/:id/programs', ensureAuthenticated('/admin'), userController.getUserInfoAdmin);
router.delete('/admin/Users_admin/:id', ensureAuthenticated('/admin'), userController.deleteUser); 

router.get('/admin/contact_admin', ensureAuthenticated('/admin'), contactController.viewContactMessages);
router.post('/admin/contact_messages/:id/toggle_read', ensureAuthenticated('/admin'), contactController.toggleReadStatus);
router.post('/admin/contact_messages/:id/toggle_reply', ensureAuthenticated('/admin'), contactController.toggleReplyStatus);
router.delete('/admin/contact_messages/:id', ensureAuthenticated('/admin'), contactController.deleteContactMessage);

router.get('/admin/adminUserManagement', ensureSuperAdmin('/admin'), adminController.getAdminUsers);
router.get('/admin/addAdminUser', ensureSuperAdmin('/admin'), (req, res) => {
    res.render('admin/addAdminUser', { user: req.user });
});
router.post('/admin/addAdminUser', ensureSuperAdmin('/admin'), adminController.addAdminUser);
router.get('/admin/editAdminUser/:id', ensureSuperAdmin('/admin'), adminController.editAdminUser);
router.put('/admin/editAdminUser/:id', ensureSuperAdmin('/admin'), adminController.updateAdminUser);
router.delete('/admin/deleteAdminUser/:id', ensureSuperAdmin('/admin'), adminController.deleteAdminUser);

router.get('/admin', (req, res) => {
  res.render('admin/admin_login', {
    title: 'Admin',
    error: null
  });
});

// POST
router.post('/admin', (req, res, next) => {
	passport.authenticate('admin-local', function (err, admin, info) {
	    if (err) {
		console.error('Error during authentication:', err);
		return next(err);
	    }
	    if (!admin) {
		console.log('Admin not found or incorrect password');
		return res.render('/admin/admin_login', { title: "Admin", error: info.message });
	    }
	    req.logIn(admin, function (err) {
		if (err) {
		    console.error('Error during login:', err);
		    return next(err);
		}
		console.log('Admin logged in successfully');
		return res.redirect('/admin/Users_admin');
	    });
	})(req, res, next);
    });

module.exports = router;
