// controllers/EventController.js
const Event = require('../models/event');

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching events' });
    }
};

// Create a new event
exports.createEvent = async (req, res) => {
    const { title, time, day, month, year } = req.body;

    if (!title || !time || !day || !month || !year) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const timePattern = /^\d{1,2}:\d{2} (AM|PM) - \d{1,2}:\d{2} (AM|PM)$/;
    if (!timePattern.test(time)) {
        return res.status(400).json({ success: false, message: 'Invalid time format' });
    }

    const newEvent = new Event({ title, time, day, month, year });

    try {
        await newEvent.save();
        res.status(201).json({ success: true, event: newEvent });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving event' });
    }
};
