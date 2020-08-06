var Book = require('../../models/book.model');
var User = require('../../models/user.model');
var Session = require('../../models/session.model');
var Transaction = require('../../models/transaction.model');

module.exports.get = async (request, response) => {
  var transactions = await Transaction.find().lean();
  response.json(transactions);
};

module.exports.postCreate = async (request, response) => {
  request.body.isComplete = false;
  var transaction = await Transaction.create(request.body);
  response.json(transaction);
};

module.exports.postComplete = async (request, response) => {
  var id = request.params.id;
  var transaction = await Transaction.findByIdAndUpdate(id,{$set: {isComplete: request.body.isComplete}});

  response.json(transaction);
};

