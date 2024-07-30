const Program = require('../models/program');
const User = require('../models/user');

exports.AddProgram = async (req, res) => {
	try {
		const { title, quote, date, description, category } = req.body;

		// Check for duplicate program title
		const existingProgram = await Program.findOne({ title });
		if (existingProgram) {
			req.flash('error', 'A program with this title already exists.');

			return res.redirect('/admin/Programs_admin');

		}

		const newProgram = new Program({
			title,
			quote,
			date,
			description,
			category,
		});
		await newProgram.save();

		req.flash('success', 'Program added successfully.');

		res.redirect('/admin/Programs_admin');
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).redirect('/admin/Programs_admin');

	}
};

exports.ListProgram = async (req, res) => {
	try {
		// Fetch all programs from the database
		const programs = await Program.find().populate('registrations', 'username email');

		// Render the view with the programs data
		res.render('admin/programs_admin', {
			programs: programs,
			user: req.user,
		});
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).send('Server Error');
	}
};

exports.UpdateProgram = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, quote, date, description, category } = req.body;

		const program = await Program.findById(id);
		if (!program) {
			req.flash('error', 'Program not found.');
			return res.status(404).send('Program not found');
		}

		program.title = title;
		program.quote = quote;
		program.date = date;
		program.description = description;
		program.category = category;

		await program.save();

		req.flash('success', 'Program updated successfully.');

		res.redirect('/admin/Programs_admin');
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).redirect('/admin/Programs_admin');

	}
};

exports.DeleteProgram = async (req, res) => {
	try {
		const { id } = req.params;
		// Find program by ID and delete it
		await Program.findByIdAndDelete(id);

		req.flash('success', 'Program deleted successfully.');

		res.redirect('/admin/Programs_admin');
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).redirect('/admin/Programs_admin');

	}
};

exports.enrollInProgram = async (req, res) => {
	try {
		const programId = req.params.id;
		const userId = req.user._id;

		const program = await Program.findById(programId);

		if (program) {
			if (program.registrations.length < program.quote) {
				if (!program.registrations.includes(userId)) {
					program.registrations.push(userId);
					program.quote -= 1; // Decrease the quote
					await program.save();
					req.flash('success', 'Enrolled in program successfully.');
				} else {
					req.flash('error', 'You have already enrolled in this program.');
				}
			} else {
				req.flash('error', 'Enrollment limit reached for this program.');
			}
		}

		res.redirect('/user/Programs');
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');

		res.status(500).redirect('/user/Programs');

	}
};

exports.quitProgram = async (req, res) => {
	try {
		const programId = req.params.id;
		const userId = req.user._id;

		const program = await Program.findById(programId);

		if (program) {
			const index = program.registrations.indexOf(userId);
			if (index !== -1) {
				program.registrations.splice(index, 1);
				program.quote += 1; // Increase the quote
				await program.save();
				req.flash('success', 'Quit the program successfully.');
			} else {
				req.flash('error', 'You are not enrolled in this program.');
			}
		}


		res.redirect('/user/Programs');
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).redirect('/user/Programs');

	}
};

exports.forceQuitProgram = async (req, res) => {
	try {
		const programId = req.params.programId;
		const userId = req.params.userId;

		const program = await Program.findById(programId);

		if (program) {
			const index = program.registrations.indexOf(userId);
			if (index !== -1) {
				program.registrations.splice(index, 1);
				program.quote += 1; // Increase the quote
				await program.save();
				req.flash('success', 'User has been removed from the program.');
			} else {
				req.flash('error', 'User is not enrolled in this program.');
			}
		}


		res.redirect('/admin/Programs_admin');
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).redirect('/admin/Programs_admin');

	}
};

exports.listProgramsForUser = async (req, res) => {
	try {
		const programs = await Program.find();
		let userPrograms = [];

		if (req.user) {
			userPrograms = await Program.find({ registrations: req.user._id });
		}

		res.render('user/programs', {
			programs: programs,
			user: req.user,
			userPrograms: userPrograms
		});
	} catch (error) {
		console.error(error);
		req.flash('error', 'Server Error. Please try again later.');
		res.status(500).send('Server Error');
	}
};
