var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv').config();
const passport = require('passport');
const { passportConfig } = require('./utils/passport');
const db = require('./utils/db');
const { createDefaultAdmin } = require('./utils/adminUtils');
const flash = require('connect-flash');


const Routes = require('./routes/Router');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session middleware
const SESSION_SECRET = process.env.SESSION_SECRET

app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 10, // 10 min
		},
	})
);

// Middleware to set flash messages in response locals
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null; 
	console.log('Flash messages:', res.locals.success, res.locals.error); // Debug
	next();
  });

db.conn();

app.use(passport.initialize());
app.use(passport.session());

passportConfig();


app.use(Routes);


// Hardcode default admin
createDefaultAdmin();

app.use(Routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
