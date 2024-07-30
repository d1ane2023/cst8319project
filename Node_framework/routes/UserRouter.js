const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../utils/authMiddleware');
const userController = require('../controllers/userController');
const programController = require('../controllers/programController');
const contactController = require('../controllers/contactController');

// GET
router.get('/', (req, res) => {
	res.render('index', {
		user: req.user
	});
});

router.get('/about', (req, res) => {
	res.render('user/about', {
		user: req.user
	});
});

router.get('/user/contact_us', contactController.getContactForm);
router.post('/user/contact_us', contactController.submitContactForm);

router.get('/login', (req, res) => {
	res.render('user/login', {
		title: 'Login',
	});
});

router.get('/register', (req, res) => {
	res.render('user/register', {
		title: 'Home',
		errors: undefined,
	});
});

router.get('/user/userinfo', ensureAuthenticated('/login'), (req, res) => {
	res.render('user/userinfo', { title: 'My', user: req.user });
});

router.get('/logout', userController.logout);
router.post('/logout', userController.logout);

// POST
router.post('/login', (req, res, next) => {
	passport.authenticate('user-local', function (err, user, info) {
		if (err) { return next(err); }
		if (!user) {
			return res.render('user/login', { title: "login", error: info.message });
		}
		req.logIn(user, function (err) {
			if (err) { return next(err); }
			return res.render('index', {
				user: user
			});
		});
	})(req, res, next);
});

router.post('/register', userController.register);

// Update user information
router.post('/user/update-photo-biography', ensureAuthenticated('/login'), userController.updatePhotoBiography);
router.post('/user/update-contact-info', ensureAuthenticated('/login'), userController.updateContactInfo);
router.post('/user/update-password', ensureAuthenticated('/login'), userController.updatePassword);

module.exports = router;