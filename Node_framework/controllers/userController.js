const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const Program = require('../models/program');
const Testimonial = require('../models/testimonial');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/user_profile_photo/');
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

exports.register = [
    body("username")
        .trim()
        .isLength({ min: 1, max: 10 })
        .withMessage("Username must be between 1 and 10 characters")
        .escape()
        .withMessage("Username must be specified")
        .isAlphanumeric()
        .withMessage("Username has non-alphanumeric characters"),
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            req.flash('error', errorMessages);
            return res.redirect('/register');
        } else {
            User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function (err, user) {
                if (err) {
                    req.flash('error', err.message);
                    return res.redirect('/register');
                }
                req.flash('success', 'You are registered and can now log in.');
                return res.redirect("/login");
            });
        }
    })
];

// Update Profile Photo and Biography
exports.updatePhotoBiography = [
    upload.single('photo'), // Middleware to handle file upload
    body('biography').trim().escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', 'Invalid input');
            return res.redirect('/user/userinfo');
        }

        const user = await User.findById(req.user._id);
        if (req.file) {
            user.photo = path.join('user_profile_photo/', req.file.filename);
        }
        if (req.body.biography) {
            user.biography = req.body.biography;
        }
        await user.save();
        req.flash('success', 'Profile updated successfully');
        res.redirect('/user/userinfo');
    })
];

// Update Contact Info
exports.updateContactInfo = [
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('firstName').trim().isLength({ min: 1 }).escape(),
    body('lastName').trim().isLength({ min: 1 }).escape(),
    body('phone').optional({ checkFalsy: true }).trim().escape(),
    body('address').optional({ checkFalsy: true }).trim().escape(),
    body('city').optional({ checkFalsy: true }).trim().escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', 'Invalid input');
            return res.redirect('/user/userinfo');
        }

        const user = await User.findById(req.user._id);
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        if (req.body.phone) {
            user.phone = req.body.phone;
        }
        if (req.body.address) {
            user.address = req.body.address;
        }
        if (req.body.city) {
            user.city = req.body.city;
        }
        await user.save();
        req.flash('success', 'Contact info updated successfully');
        res.redirect('/user/userinfo');
    })
];

// Update Password
exports.updatePassword = [
    body('oldPassword').isLength({ min: 6 }).withMessage('Old password must be at least 6 characters'),
    body('password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', 'Invalid input');
            return res.redirect('/user/userinfo');
        }

        const user = await User.findById(req.user._id);
        user.authenticate(req.body.oldPassword, async (err, authenticatedUser, passwordErr) => {
            if (err || !authenticatedUser) {
                req.flash('error', 'Old password is incorrect');
                return res.redirect('/user/userinfo');
            }

            await user.setPassword(req.body.password);
            await user.save();

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                req.flash('success', 'Password updated successfully');
                res.redirect('/user/userinfo');
            });
        });
    })
];

exports.logout = (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return console.log(err);
		}
		res.redirect('/');
	});
}

// Get Users with Pagination
exports.getUsers = asyncHandler(async (req, res, next) => {
	const page = parseInt(req.query.page) || 1; // Default to page 1
	const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 users per page
    
	const totalUsers = await User.countDocuments();
	const users = await User.find()
	    .skip((page - 1) * pageSize)
	    .limit(pageSize)
	    .select('username firstName lastName email phone address city biography photo createdAt');
    
	res.render('admin/Users_admin', {
	    users: users,
	    totalUsers: totalUsers,
	    totalPages: Math.ceil(totalUsers / pageSize),
	    currentPage: page,
	    pageSize: pageSize,
	    user: req.user,
	});
    });

exports.getUserInfoAdmin = asyncHandler(async (req, res, next) => {
	const userId = req.params.id;

    console.log('Fetching data for user ID:', userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found for ID:', userId);
            req.flash('error', 'User not found.');
            return res.status(404).send('User not found');
        }
        console.log('User found:', user);

        const programs = await Program.find({ registrations: userId }).select('title date description category');
        console.log('Programs found for user:', programs);

        const testimonials = await Testimonial.find({ user: userId }).populate('user', 'username');
        console.log('Testimonials found for user:', testimonials);

        res.render('admin/userinfo_admin', {
            user: user,
            programs: programs,
            testimonials: testimonials
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        req.flash('error', 'Server Error. Please try again later.');
        res.status(500).send('Server Error');
    }
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;

    try {
        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            req.flash('error', 'User not found.');
            return res.status(404).send('User not found');
        }

        // Remove user from all programs and increase the quote
        const programs = await Program.find({ registrations: userId });
        for (const program of programs) {
            program.registrations.pull(userId);
            program.quote += 1; // Increase the quote by 1
            await program.save();
        }

        // Delete user's testimonials
        await Testimonial.deleteMany({ user: userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        req.flash('success', 'User deleted successfully.');
        res.redirect('/admin/Users_admin');
    } catch (error) {
        console.error('Error deleting user:', error);
        req.flash('error', 'Server Error. Please try again later.');
        res.status(500).send('Server Error');
    }
});