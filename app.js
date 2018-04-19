require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');

// const mongo = require('mongodb');
// const mongoClient = mongo.MongoClient;
const mongUrl = 'mongodb://localhost:27017/';

// mongoClient.connect(url, (err, db) => {
// 	if (err) throw err;
// 	const dbo = db.db('mydb');
// 	dbo.collection('anotherone').insertOne({
// 		data: 'object'
// 	}, (err, res) => {
// 		if (err) throw err;
// 		console.log('inserted', res);
// 		db.close();
// 	});
// });

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

app.use('/', require('./routes/index'));
app.use('/repo', require('./routes/repos'));
app.use('/login', require('./routes/login'));
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
