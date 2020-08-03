var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name: String,
	phone: String,
	email: String,
	password: String,
	avatar: String,
	isAdmin: Boolean,
	wrongLoginCount: Number,
	cart: Array
});

var User = mongoose.model('User', userSchema, 'users');

module.exports = User;