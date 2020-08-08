var Session = require('../models/session.model');
var User = require('../models/user.model');
var shortid = require('shortid');

module.exports = async (request, response, next) => {
	var session = await Session.findById(request.signedCookies.sessionId).lean();
	var user = await User.findById(request.signedCookies.userId).lean();

	if (!request.signedCookies.sessionId) {
		var sessionId = shortid.generate();
		response.cookie("sessionId", sessionId, {
	    signed: true
	  });

	  await Session.create({
	  	_id: sessionId
	  });
	}
	if (user && user.isAdmin === false) {
		response.locals.cartId = user._id;
		response.locals.numberBookInCart = Object.keys(user.cart).length;
	} else if (session && session.cart) {
		response.locals.cartId = session._id;
		response.locals.numberBookInCart = Object.keys(session.cart).length;
	}

	next();
}
