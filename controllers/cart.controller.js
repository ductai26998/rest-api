var Book = require('../models/book.model');
var User = require('../models/user.model');
var Session = require('../models/session.model');
var Transaction = require('../models/transaction.model');
// const shortid = require('shortid');

module.exports.get = async (request, response, next) => {
	var booksInCart = [];
	var cart = {};
	var userId = request.signedCookies.userId;
	var user = await User.findById(userId).lean();
	var sessionId = request.signedCookies.sessionId;
	var session = await Session.findById(sessionId).lean();
	if (!user) {
		Object.assign(cart, session.cart);
	} else {
		Object.assign(cart, user.cart);
	}

	for (var bookId in cart) {
		var book = await Book.findById(bookId).lean();
		
		if (book) {
			booksInCart.push(book);
		}
	}

	response.render("cart/index", {
		books: booksInCart
	});
}

module.exports.borrow = async (request, response, next) => {
	var cart = {};
	var userId = request.signedCookies.userId;
	var user = await User.findById(userId);
	var sessionId = request.signedCookies.sessionId;
	Object.assign(cart, user.cart);

	for (var bookId in cart) {
		var transaction = {
			userId: request.signedCookies.userId,
			bookId: bookId,
			isComplete: false
		};

		await Transaction.create(transaction);
	}
	var userUpdate = await User.findByIdAndUpdate(userId, {$set: {'cart': {}}});
	var sessionUpdate = await Session.findByIdAndUpdate(sessionId, {$set: {'cart': {}}});
	response.redirect('/books');
} 

module.exports.addToCart = async (request, response, next) => {
	var bookId = request.params.id;
	var sessionId = request.signedCookies.sessionId;
	var session = await Session.findById(sessionId).lean();
	var userId = request.signedCookies.userId;
	var user = await User.findById(userId).lean();

	if (!session.cart) {
		session.cart = {
			[bookId]: 1
		}
		console.log('data is ready', session);
		await Session.findByIdAndUpdate(sessionId, session).lean();
		console.log(await Session.findById(sessionId).lean());
	}

	var count = session.cart[bookId] || 0;

	if (!sessionId) {
		response.redirect('/books');
	}
	session.cart[bookId] = count + 1;
	await Session.findByIdAndUpdate(sessionId, session);
	if (user && user.cart) {
		Object.assign(user.cart, session.cart);
		await User.findByIdAndUpdate(userId, user);
	}

	response.redirect('/books');
	next();
}