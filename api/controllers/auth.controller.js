var bcrypt = require('bcrypt');
var Book = require('../../models/book.model');
var User = require('../../models/user.model');
var Session = require('../../models/session.model');

module.exports.postLogin = async (request, response) => {
	var email = request.body.email;
	var password = request.body.password;
  var user = await User.findOne({email: email});
  var sessionId = request.signedCookies.sessionId;
  var session = await Session.findOne({_id: sessionId});

  const match = await bcrypt.compare(password, user.password);

  if (user.cart) {
    Object.assign(user.cart, session.cart);
  }
  await User.findOneAndUpdate({email: email}, {$set: {cart: user.cart}});

  response.json(user);
};


