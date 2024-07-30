const Image = require('../models/image');
const fs = require('fs');
const path = require('path');

exports.AddImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    const tempPath = req.file.path;
    
    const newImage = new Image({
      title,
      description,
      url: ''  // Temporarily set to an empty string
    });

    const savedImage = await newImage.save();

    const newFilename = `${savedImage._id}${path.extname(req.file.originalname)}`;
    const newPath = path.join('public/uploads/', newFilename);

    // Rename the file
    fs.rename(tempPath, newPath, (err) => {
      if (err) throw err;

      // Update the image URL in the database
      savedImage.url = `/uploads/${newFilename}`;
      savedImage.save();

      // Add success message
      req.flash('success', 'Image added successfully.');
      
      // Redirect to the gallery_admin page after adding an image
      res.redirect('/admin/gallery_admin');
    });

  } catch (error) {
    console.error(error);
    req.flash('error', 'Server Error. Please try again.');

    res.status(500).redirect('/admin/gallery_admin');

  }
};

exports.ListImages = async (req, res) => {
  try {
    const images = await Image.find();
    if (req.query.admin) {

      res.render('admin/gallery_admin', { images: images, user: req.user });
    } else {
      res.render('user/gallery', { images: images, user: req.user });

    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'Server Error. Please try again.');

    res.status(500).redirect(req.query.admin ? '/admin/gallery_admin' : '/user/gallery');

  }
};

exports.DeleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    
    if (!image) {
      req.flash('error', 'Image not found.');

      return res.status(404).redirect('/admin/gallery_admin');

    }

    const imagePath = path.join(__dirname, '..', 'public', image.url);

    // Delete the file from the file system
    fs.unlink(imagePath, async (err) => {
      if (err) {
        console.error(err);
        req.flash('error', 'Server Error. Please try again.');

        return res.status(500).redirect('/admin/gallery_admin');

      }

      // Delete the image from the database
      await Image.findByIdAndDelete(id);

      // Add success message
      req.flash('success', 'Image deleted successfully.');
      
      // Redirect to the gallery_admin page after deleting an image
      res.redirect('/admin/gallery_admin');
    });

  } catch (error) {
    console.error(error);
    req.flash('error', 'Server Error. Please try again.');

    res.status(500).redirect('/admin/gallery_admin');

  }
};

exports.UpdateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const image = await Image.findById(id);
    if (!image) {
      req.flash('error', 'Image not found.');

      return res.status(404).redirect('/admin/gallery_admin');

    }
    
    image.title = title;
    image.description = description;
    
    if (req.file) {
      // Delete the old file
      const oldImagePath = path.join(__dirname, '..', 'public', image.url);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error(err);
      });
    
      // Update with new file
      const newFilename = `${image._id}${path.extname(req.file.originalname)}`;
      const newPath = path.join('public/uploads/', newFilename);
      fs.rename(req.file.path, newPath, (err) => {
        if (err) throw err;
        image.url = `/uploads/${newFilename}`;
      });
    }
    
    await image.save();
    
    // Add success message
    req.flash('success', 'Image updated successfully.');
    
    // Redirect to the gallery_admin page after updating an image

    res.redirect('/admin/gallery_admin');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Server Error. Please try again.');
    res.status(500).redirect('/admin/gallery_admin');

  }
};
