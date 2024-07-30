const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/authMiddleware');
const programController = require('../controllers/programController');
const methodOverride = require('method-override'); // Require method-override

router.use(methodOverride('_method'));

// Admin routes
// GET
router.get('/admin/Programs_admin', ensureAuthenticated('/admin'), programController.ListProgram);

// POST
router.post('/admin/Programs_admin', ensureAuthenticated('/admin'), programController.AddProgram);

// Custom update route using POST
router.put('/admin/Programs_admin/update/:id', ensureAuthenticated('/admin'), programController.UpdateProgram);

// DELETE
router.delete('/admin/Programs_admin/:id', ensureAuthenticated('/admin'), programController.DeleteProgram);

// Force a user to quit a program
router.post('/admin/Programs_admin/force_quit/:programId/:userId', ensureAuthenticated('/admin'), programController.forceQuitProgram);

// User routes
// 
router.get('/user/Programs', programController.listProgramsForUser);

// Enroll in a program
router.post('/user/programs/enroll/:id', ensureAuthenticated('/login'), programController.enrollInProgram);

// Quit a program
router.post('/user/programs/quit/:id', ensureAuthenticated('/login'), programController.quitProgram);

module.exports = router;