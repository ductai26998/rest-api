var Book = require('../models/book.model');
var User = require('../models/user.model');

var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'ductai26998', 
  api_key: '744596793339385', 
  api_secret: '_jqie405YJR-Jct1XSBwKkbUUy8' 
});

module.exports.get = async (request, response) => {

  var user = await User.findById(request.signedCookies.userId);

  var books = await Book.find();

  response.render('books/index', {
    isAdmin: function() {
      if (!user || user.isAdmin !== true) {
        return false;
      }
      return true;
    },
    // page: page,
    books: books,
    getCoverUrl: function(url) {
      if (url.indexOf('http') === 0) {
        return url;
      }
      return '/' + url;
    }
  });
};

module.exports.search = async (request, response) => {
  var user = await User.find({id: request.signedCookies.userId});
  var q = request.query.q;
  var books = await Book.find();
  var matchedBooks = books.filter(function(book) {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  response.render('books/index', {
    isAdmin: function() {
      if (!user || user.isAdmin !== true) {
        return false;
      }
      return true;
    },
    books: matchedBooks,
    getCoverUrl: function(url) {
      if (url.indexOf('http') === 0) {
        return url;
      }
      return '/' + url;
    }
  });
};

module.exports.create = (request, response) => {
  response.render('books/create');
};

module.exports.postCreate = async (request, response) => {
  if (!request.file) {
    request.body.cover = "updates/avt.jpg";
  } else {
    request.body.cover = request.file.path.split("\\").slice(1).join("/");
    cloudinary.uploader.upload(request.body.cover, function(error, result) {
      console.log(result, error)
    });
  }

  await Book.create(request.body);
  response.redirect('/books');
};

module.exports.delete = async (request, response) => {
  await Book.deleteOne({_id: request.params.id});
  response.redirect('/books');
};

module.exports.update = (request, response) => {
  response.render('books/update', {id: request.params.id});
};

module.exports.postUpdate = async (request, response) => {
  var bookId = request.params.id;
  var book = await Book.findByIdAndUpdate(bookId, request.body);
  response.redirect('/books');
}