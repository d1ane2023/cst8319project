// authMiddleware.js
const ensureAuthenticated = (redirectUrl = '/login') => (req, res, next) => {
	if (req.isAuthenticated()) {
		console.log('User is authenticated');
	  return next(); // Proceed to next middleware or route handler
	}
	console.log('User is not authenticated, redirecting to', redirectUrl);
	res.redirect(redirectUrl); // Redirect to specified or default login page
      };

const ensureSuperAdmin = (redirectUrl = '/admin') => (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === 'super-admin') {
            return next();
        }
        res.redirect(redirectUrl);
    };
      
      module.exports = { ensureAuthenticated, ensureSuperAdmin};