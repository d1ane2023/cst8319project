const express = require('express');
const router = express.Router();
const adminRouter = require('./AdminRouter');
const blogRouter = require('./BlogRouter');
const galleryRouter = require('./GalleryRouter');
const programsRouter = require('./ProgramsRouter');
const userRouter = require('./UserRouter');
const testimonialRouter = require('./TestimonialRouter');
const eventRouter = require('./EventRouter');

router.use('/', adminRouter); // Use ProgramsRouter for related routes
router.use('/', blogRouter); // Use ProgramsRouter for related routes
router.use('/', galleryRouter); // Use ProgramsRouter for related routes
router.use('/', programsRouter); // Use ProgramsRouter for related routes
router.use('/', userRouter); // Use ProgramsRouter for related routes
router.use('/', testimonialRouter); // Use testimonialRouter for related routes
router.use('/', eventRouter);


module.exports = router;