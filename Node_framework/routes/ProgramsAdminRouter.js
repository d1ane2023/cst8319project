const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/authMiddleware');
const programController = require('../controllers/programController');
const methodOverride = require('method-override'); // Require method-override

router.use(methodOverride('_method'));

// GET
router.get('/Programs_admin', ensureAuthenticated('/admin'), programController.ListProgram);

// POST
router.post('/Programs_admin', ensureAuthenticated('/admin'), programController.AddProgram);

// Custom update route using POST
router.post('/Programs_admin/update/:id', ensureAuthenticated('/admin'), programController.UpdateProgram);

// DELETE
router.delete('/Programs_admin/:id', ensureAuthenticated('/admin'), programController.DeleteProgram);

module.exports = router;