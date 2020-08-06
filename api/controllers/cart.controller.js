var Book = require('../../models/book.model');
var User = require('../../models/user.model');
var Session = require('../../models/session.model');
var Transaction = require('../../models/transaction.model');
// const shortid = require('shortid');

module.exports.get = async (request, response, next) => {
	var cart = {};
	var userId = request.signedCookies.userId;
	var user = await User.findOne({id: userId});
	var sessionId = request.signedCookies.sessionId;
	var session = await Session.findOne({id: sessionId});
	if (!user) {
		Object.assign(cart, session.cart);
	} else {
		Object.assign(cart, user.cart);
	}

	response.json(cart);
}

module.exports.addToCart = async (request, response) => {
	var bookId = request.params.id;
	var sessionId = request.signedCookies.sessionId;
	var session = await Session.findOne({_id: sessionId}).lean();
	var check = false;
	if (!session.cart) {
		session.cart = {
			[bookId]: 1
		}
		await Session.findByIdAndUpdate(sessionId, session).lean();
	}

	var count = session.cart[bookId];

	session.cart[bookId] = count + 1;
	await Session.findByIdAndUpdate(sessionId, session);

	response.json(session);
}