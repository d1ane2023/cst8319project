const LocalStrategy = require("passport-local/lib").Strategy;
const passport = require('passport');
const User = require('../models/user');
const Admin = require('../models/admin');

module.exports.passportConfig = () => {
	// User Strategy
	passport.use('user-local', new LocalStrategy(User.authenticate()));
	passport.use('admin-local', new LocalStrategy(Admin.authenticate()));
    
	passport.serializeUser((user, done) => {
	    console.log('Serializing user:', user);
	    done(null, user.id);
	});
    
	passport.deserializeUser(async (id, done) => {
	    try {
		let user = await User.findById(id).exec();
		if (user) {
		    console.log('Deserialized user:', user);
		    return done(null, user);
		} else {
		    let admin = await Admin.findById(id).exec();
		    console.log('Deserialized admin:', admin);
		    return done(null, admin);
		}
	    } catch (err) {
		console.error('Error during deserialization:', err);
		return done(err);
	    }
	});
    };