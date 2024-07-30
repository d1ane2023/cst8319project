const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('express-async-handler');

exports.getContactForm = (req, res) => {
    res.render('user/contact_us', {
        user: req.user,
    });
};

exports.submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;

    const newMessage = new ContactMessage({
        name,
        email,
        phone,
        message
    });

    await newMessage.save();

    req.flash('success', 'Thank you for contacting us! We will get back to you soon.');
    res.redirect('/user/contact_us');
});

exports.viewContactMessages = asyncHandler(async (req, res) => {
    const messages = await ContactMessage.find().sort({ date: -1 });
    res.render('admin/contact_admin', {
        messages
    });
});

exports.toggleReadStatus = asyncHandler(async (req, res) => {
    const messageId = req.params.id;
    const message = await ContactMessage.findById(messageId);

    if (message) {
        message.isRead = !message.isRead;
        await message.save();
        req.flash('success', 'Message status updated successfully.');
    } else {
        req.flash('error', 'Message not found.');
    }

    res.redirect('/admin/contact_admin');
});

exports.toggleReplyStatus = asyncHandler(async (req, res) => {
    const messageId = req.params.id;
    const message = await ContactMessage.findById(messageId);

    if (message) {
        message.isReplied = !message.isReplied;
        await message.save();
        req.flash('success', 'Reply status updated successfully.');
    } else {
        req.flash('error', 'Message not found.');
    }

    res.redirect('/admin/contact_admin');
});

exports.deleteContactMessage = asyncHandler(async (req, res) => {
    const messageId = req.params.id;

    await ContactMessage.findByIdAndDelete(messageId);
    req.flash('success', 'Message deleted successfully.');

    res.redirect('/admin/contact_admin');
});
