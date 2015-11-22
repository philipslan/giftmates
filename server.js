// server.js

// SET UP =====================================================================
var express = require('express');
var app = express();														// create app w/ express
var mongoose = require('mongoose'); 						// mongoose for mongoDB
var port = process.env.PORT || 7000; 						// set port
var passport = require('passport');
var flash = require('connect-flash');

// express modules
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');

// mongoose config
var configDB = require('./config/database');
mongoose.connect(configDB.url);

require('./config/passport')(passport);

// express config
app.use(express.static(__dirname + '/public'));	// set the static files location /public/img will be /img for users
app.use(morgan('dev'));													// print requests to console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public/views');

app.use(session({
	secret: 'billnye',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ROUTES =====================================================================
require('./app/routes.js')(app, passport);

// LISTEN (start app with node server.js) =====================================
app.listen(port);
console.log("App listening on port " + port);
