const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/authMiddleware');
const galleryController = require('../controllers/imageController');
const multer = require('multer');
const methodOverride = require('method-override');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.use(methodOverride('_method'));

// GET
router.get('/gallery_admin', ensureAuthenticated('/admin'), galleryController.ListImages);

// POST
router.post('/gallery_admin', ensureAuthenticated('/admin'), upload.single('url'), galleryController.AddImage);

// DELETE
router.delete('/gallery_admin/:id', ensureAuthenticated('/admin'), galleryController.DeleteImage);

// PUT (or POST) for update
router.put('/gallery_admin/update/:id', ensureAuthenticated('/admin'), upload.single('url'), galleryController.UpdateImage);

module.exports = router;
