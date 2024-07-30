// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/authMiddleware');
const EventController = require('../controllers/eventController');

router.get('/api/events', EventController.getAllEvents);
router.post('/api/events', EventController.createEvent);
router.get('/user/calendar', (req, res) => {
	res.render('user/calendar', {
		user: req.user
	});
});

router.get('/admin/calendar_admin', ensureAuthenticated('/admin'), (req, res) => {
  res.render('admin/calendar_admin');
});

module.exports = router;
