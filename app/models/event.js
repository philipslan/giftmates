// app/models/event.js
var mongoose = require('mongoose');

// define schema for event models
var eventSchema = mongoose.Schema({
	name   		: String,		// event name
	orgs    	: Array,		// organization names
	admins 		: Array, 		// array of admin ID's (people that can edit)
	link   		: String,		// link to event on fb or other site (optional)
	desc			: String,		// event description
	hidden		: Boolean,	// public or privateevent

	location	: {					// location name and coordinates
		name		: String,
		coord  	: String,		// something to work with google maps? tbd
	},

	date			: {					// start and end times for the event
		start		: Date,
		end			: Date,
	},
});

module.exports = mongoose.model('Event', eventSchema);
