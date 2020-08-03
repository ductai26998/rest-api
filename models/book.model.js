var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
	title: String,
	cover: String
});

var Book = mongoose.model('Book', bookSchema, 'books');

module.exports = Book;