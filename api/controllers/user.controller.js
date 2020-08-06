var User = require('../../models/user.model');
var bcrypt = require('bcrypt');

module.exports.get = async (request, response) => {
  var users = await User.find().lean();
  response.json(users);
};

module.exports.postCreate = async (request, response) => {
  request.body.isAdmin = "false";
  request.body.cart = {};
  var hashedPassword = await bcrypt.hash(request.body.password, 10)
  request.body.password = hashedPassword;
  var user = await User.create(request.body);
 
  response.json(user);
};

module.exports.postProfile = async(request, response) => {
  var userId = request.params.id;
  var user = await User.findByIdAndUpdate(userId, request.body);

  response.json(user);
};
