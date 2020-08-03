var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
	_id: String,
}, { strict: false });

var Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;