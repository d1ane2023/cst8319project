const Admin = require('../models/admin');

// Get Admin Users
exports.getAdminUsers = async (req, res) => {
    try {
        const admins = await Admin.find({});
        res.render('admin/adminUserManagement', { admins, user: req.user, currentPage: 1, totalPages: 1, pageSize: 10 });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Add Admin User
exports.addAdminUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
            req.flash('error', 'Admin with this username already exists');
            return res.redirect('/admin/addAdminUser');
        }

        const admin = new Admin({ username, role: 'admin' }); // Ensure role is always set to 'admin'
        await Admin.register(admin, password);
        req.flash('success', 'Admin user created successfully');
        res.redirect('/admin/adminUserManagement');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Edit Admin User
exports.editAdminUser = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        res.render('admin/editAdminUser', { admin, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Update Admin User
exports.updateAdminUser = async (req, res) => {
    try {
        const { password } = req.body;
        const admin = await Admin.findById(req.params.id);
        if (password) {
            await admin.setPassword(password);
        }
        await admin.save();
        req.flash('success_msg', 'Admin user updated successfully');
        res.redirect('/admin/adminUserManagement');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Delete Admin User
exports.deleteAdminUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            req.flash('error_msg', 'You cannot delete yourself!');
            return res.redirect('/admin/adminUserManagement');
        }
        await Admin.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Admin user deleted successfully');
        res.redirect('/admin/adminUserManagement');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
