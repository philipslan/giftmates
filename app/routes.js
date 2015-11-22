// app/routes.js

// load models and resources
var Event = require('./models/event');
var User = require('./models/user');

module.exports = function(app, passport){
//// VIEWS --------------------------------------------------------------------
	// home page
	app.get('/', function(req, res) {
		if (req.isAuthenticated()) {
			res.redirect('/calendar');
		} else {
			res.render('index.html', {
				user: req.user,
			});
		}
	});

	// create
	app.get('/create', isLoggedIn, function(req, res) {
		res.render('index.html', {
			user: req.user
		});
	});


	// create2 (date select)
	app.get('/create2', isLoggedIn, function(req, res) {
		res.render('index.html', {
			user: req.user
		});
	});

	// calendar
	app.get('/calendar', isLoggedIn, function(req, res) {
		res.render('index.html', {
			user: req.user
		});
	});

	// confirm
	app.get('/confirm', isLoggedIn, function(req, res) {
		res.render('index.html', {
			user: req.user
		});
	});

	//history
	app.get('/history', isLoggedIn, function(req, res) {
		res.render('index.html', {
			user: req.user
		});
	});

	//edit
	app.get('/edit', isLoggedIn, function(req, res) {
		res.render('index.html', {
			user: req.user
		});
	});

	app.get('/account', isLoggedIn, function(req, res) {
		res.render('index.html', {
			user: req.user
		});
	});

//// AUTHENTICATION -----------------------------------------------------------
	// login
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/calendar',
		failureRedirect: '/',
		failureFlash: true,
	}));

	// register
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/calendar',
		failureRedirect: '/',
		failureFlash: true
	}));

	app.get('/register', function(req, res) {
		res.render('index.html', {
			user: req.user
		});
	});

	// logout
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});


//// API ----------------------------------------------------------------------
	// retrieve all events
	app.get('/api/events', isLoggedIn, function(req, res) {
		// user mongoose to get all events
		Event.find({'hidden':false},function(err, events) {
			// If there is an error, send the error
			if (err) {
				res.send(err);
			}
			else{
				res.json(events);
			}
		});
	});

	app.get('/api/eventsall', isLoggedIn, function(req, res) {
		// user mongoose to get all events
		Event.find(function(err, events) {
			// If there is an error, send the error
			if (err) {
				res.send(err);
			}
			else{
				res.json(events);
			}
		});
	});

	// Retrieve all events 7 days from now
	app.get('/api/events/date/week/:date', isLoggedIn, function(req, res) {
		// Create date stuff
		var now = new Date(req.params.date);
		var end = new Date(now);
		end.setDate(end.getDate() + 7);

		console.log(now);
		console.log(end);

		Event.find({'date.start': {$gte: now, $lt: end}, 'hidden': false}, null, {sort: { "date.start": 1, "date.end": 1 }},
			function(err, events){
				if (err)
					res.send(err);
				res.json(events);
			});
	});

		// Retrieve all events between range
	app.get('/api/events/date/month/:date/:date1', isLoggedIn, function(req, res) {
		// Create date stuff
		var start = new Date(req.params.date);
		var end = new Date(req.params.date1);
		console.log(start);
		console.log(end);

		Event.find({'date.start': {$gte: start, $lt: end}, 'hidden': false}, null, {sort: { "date.start": 1, "date.end": 1 }},
			function(err, events){
				if (err)
					res.send(err);
				res.json(events);
			});
	});

	// Retrieves all events with the same org
	app.post('/api/events/org', isLoggedIn, function(req, res) {
		User.findOne({'_id':req.user.id},
			function (err, user){
				if (err)
					res.send(err);
				var orgName = user.orgName
				findOrg(orgName);
			});
		function findOrg (org) {
			Event.find({'orgs': { $all: [org] } },
				function (err, events ){
					if (err)
						res.send(err);
					res.json(events);
			});
		}
	});

	app.post('/api/events/org/date', isLoggedIn, function(req, res) {
		User.findOne({'_id':req.user.id},
			function (err, user){
				if (err)
					res.send(err);
				var orgName = user.orgName
				findOrg(orgName);
			});
		function findOrg (org) {
			var date = new Date();
			Event.find({'orgs': { $all: [org] }, 'date.end': {$gte: date}},
				function (err, events ){
					if (err)
						res.send(err);
					res.json(events);
			});
		}
	});

	app.put('/api/events/update', function(req, res) {
		Event.findOneAndUpdate({'admins': { $all: [String(req.user.id)] }, '_id': req.body[1] }, req.body[0],
			function (err, events ){
				if (err) {
					res.send(err);
				}else{
					res.send(200);
				}
				console.log(events);
		});
	});

	// create an event
	app.post('/api/events', isLoggedIn, function(req, res) {
		console.log(req.body);
		console.log(req.user);
		Event.create({
			name			: req.body.name,
			orgs			: [req.user.orgName],
			admins		: [req.user.id],
			link			: req.body.link,
			desc			: req.body.desc,
			hidden 		: req.body.hidden,

			location	: {
				name		: req.body.location.name,
				coord		: req.body.location.coord
			},
			date		 	: {
				start		: req.body.date.start,
				end 		: req.body.date.end
			}

		}, function(err, event) {
			if (err) {
				res.send(err);
			}else{
				res.send(200);
			}
		});
	});

	// delete an event
	app.delete('/api/events/:event_id', isLoggedIn, function(req, res) {
		Event.remove({
			_id: req.params.event_id,
			'admins': { $all: [String(req.user.id)] }
		}, function(err, event) {
			if (err) {
				res.send(err);
			}

			Event.find(function(err, events) {
				if (err) {
					res.send(err);
				}
				res.json(events);
			});
		});
	});

	// Debugging only, delete all events
	// remove this when we are done
	app.delete('/api/events/clear/all', isLoggedIn, function(req, res){
		Event.remove({
		}, function(err){
			res.send("Everything is dead");
			});
	});

//// UserAPI ----------------------------------------------------------------------
	app.get('/api/users', isLoggedIn, function(req, res) {
		if (req.user.id == "5567852a3102c5bf3f1c52ad") {
			// user mongoose to get all events
		User.find(function(err, users) {
				// If there is an error, send the error
				if (err) {
					res.send(err);
				}
				else{
					res.json(users);
				}
			});
		}
	});
		
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}
