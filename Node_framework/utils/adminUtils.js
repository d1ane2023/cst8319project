const Admin = require('../models/admin');

const createDefaultAdmin = async () => {
    try {
        const admin = await Admin.findOne({ username: 'admin' });
        if (!admin) {
            const newAdmin = new Admin({ username: 'admin', role: 'super-admin'});
            await Admin.register(newAdmin, '1234');
            console.log('Default admin created successfully');
        } else {
            console.log('Default admin already exists');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

module.exports = { createDefaultAdmin };