var User = require('../models/user.model');

module.exports.requireAuth = async (request, response, next) => {
	var user = await User.findOne({_id: request.signedCookies.userId});

	if (!request.signedCookies.userId) {
		response.redirect('/auth/login');
		return;
	}


	if (!user) {
  		response.render('auth/login', {
  			errors: function() {
  				return ['User does not exist!'];
  			},
  			values: request.body
  		});
		return;
	}

	if (user.isAdmin !== true) {
		response.render('error/index');
	}

	response.locals.user = user;

	next();
}

module.exports.setLocalUser = async (request, response, next) => {
	var user = await User.findOne({_id: request.signedCookies.userId});

	response.locals.user = user;

	next();
}