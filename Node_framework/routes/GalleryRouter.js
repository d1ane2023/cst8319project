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

// Admin routes
router.get('/admin/gallery_admin', ensureAuthenticated('/admin'), (req, res) => {
	req.query.admin = true;
	galleryController.ListImages(req, res);
      });
router.post('/admin/gallery_admin', ensureAuthenticated('/admin'), upload.single('url'), galleryController.AddImage);
router.delete('/admin/gallery_admin/:id', ensureAuthenticated('/admin'), galleryController.DeleteImage);
router.put('/admin/gallery_admin/update/:id', ensureAuthenticated('/admin'), upload.single('url'), galleryController.UpdateImage);


// User routes
router.get('/user/gallery', galleryController.ListImages);

module.exports = router;
