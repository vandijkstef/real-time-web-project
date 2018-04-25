require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');

const mongUrl = `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASS}@ds155699.mlab.com:55699/${process.env.MONGODB}`;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
	src: path.join(__dirname, 'public'),
	dest: path.join(__dirname, 'public'),
	indentedSyntax: false, // true = .sass and false = .scss
	sourceMap: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'oiVaidvE93',
	store: new MongoStore({
		url: mongUrl
	}),
	saveUninitialized: true,
	resave: false
}));

const UserStore = require('./scripts/UserStore.js');
app.use(function(req, res, next) {
	if (req.session.user) {
		// Make the user available in all templates
		res.locals.user = req.session.user;
		// Also, provide the full user list for chat interaction
		const userStore = new UserStore();
		userStore.GetAll({}, (users) => {
			res.locals.users = users;
			next();
		});
	} else {
		next();
	}
});

app.use('/', require('./routes/index'));
app.use('/repo', require('./routes/repos'));
app.use('/login', require('./routes/login'));
app.use('/profile', require('./routes/profile'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
