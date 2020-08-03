var Book = require('../models/book.model');
var User = require('../models/user.model');
var Session = require('../models/session.model');
var Transaction = require('../models/transaction.model');
// const shortid = require('shortid');

module.exports.get = async (request, response, next) => {
	var booksInCart = [];
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

	for (var bookId in cart) {
		var book = await Book.findOne({id: bookId})
		booksInCart.push(book);
	}

	response.render("cart/index", {
		books: booksInCart
	});
}

module.exports.borrow = async (request, response, next) => {
	var cart = {};
	var userId = request.signedCookies.userId;
	var user = await User.findOne({id: userId});
	Object.assign(cart, user.cart);

	for (var bookId in cart) {
		var transaction = {
			userId: request.signedCookies.userId,
			bookId: bookId,
			isComplete: false
		};

		await Transaction.create(transaction);
	}
	await User.cart.remove({});
	response.redirect('/books');
} 

module.exports.addToCart = async (request, response, next) => {
	var bookId = request.params.id;
	var sessionId = request.signedCookies.sessionId;
	var session = await Session.findOne({_id: sessionId}).lean();
	var check = false;
	if (!session.cart) {
		session.cart = {
			[bookId]: 1
		}
		console.log('data is ready', session);
		await Session.findByIdAndUpdate(sessionId, session).lean();
		console.log(await Session.findById(sessionId).lean());
	}

	var count = session.cart[bookId];

	if (!sessionId) {
		response.redirect('/books');
	}
	session.cart[bookId] = count + 1;
	await Session.findByIdAndUpdate(sessionId, session);

	response.redirect('/books');
	next();
}