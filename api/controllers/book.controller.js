var Book = require('../../models/book.model');
var User = require('../../models/user.model');

module.exports.get = async (request, response) => {
  var books = await Book.find();

  response.json(books);
};

module.exports.postCreate = async (request, response) => {
  var book = await Book.create(request.body);
  response.json(book);
};

module.exports.delete = async (request, response) => {
  var book = await Book.deleteOne({_id: request.params.id});
  response.json(book);
};

module.exports.postUpdate = async (request, response) => {
  var bookId = request.params.id;
  var book = await Book.findByIdAndUpdate(bookId, request.body);
  response.json(book);
}