var Book = require('../models/book.model');
var User = require('../models/user.model');
var Session = require('../models/session.model');
var Transaction = require('../models/transaction.model');

module.exports.get = async (request, response) => {
  var transactions = await Transaction.find().lean();
  var users = await User.find().lean();
  var books = await Book.find().lean();
  var userLogin = await User.findById(request.signedCookies.userId).lean();
  var transactionUser = await Transaction.find({userId: request.signedCookies.userId}).lean();
  response.render('transactions/index', {
    transactionsShow: function(){
      if (userLogin.isAdmin === true) {
        return transactions;
      } else {
        return transactionUser;
      }
    },
    getUserById: function(userId) {
      for (var user of users) {
        if (user._id.toString() === userId) {
          return user;
        }
      }
    },
    getBookById: function(bookId) {
      for (var book of books) {
        if (book._id.toString() === bookId) {
          return book;
        }
      }
    }
  });
};

module.exports.create = async (request, response) => {
  var users = await User.find();
  var books = await Book.find();
  response.render("transactions/create", {
    users: users,
    books: books
  })
};

module.exports.postCreate = async (request, response) => {
  request.body.isComplete = false;
  await Transaction.create(request.body);
  response.redirect('/transactions');
};

module.exports.complete = async (request, response) => {
  var id = request.params.id;
  var error = '';
  var transactions = await Transaction.find();
  var users = await User.find();
  var books = await Book.find();
  for (var transaction of transactions) {
    if (transaction.id === id) {
      var currentTransaction = await Transaction.findById(id);
      if (currentTransaction.isComplete === true) {
        error = 'Transaction was completed !';
        response.render('transactions/index', {
          error: error,
          transactionsShow: function(){
              return transactions;
          },
          getUserById: function(userId) {
            for (var user of users) {
              if (user._id.toString() === userId) {
                return user;
              }
            }
          },
          getBookById: function(bookId) {
            for (var book of books) {
              if (book._id.toString() === bookId) {
                return book;
              }
            }
          }
        });
      }
      response.render('transactions/complete', {
        id: request.params.id
      });
      return;
    } else {
      error = 'Transaction is invalid !';
    }
  }
  if (error) {
    response.render('transactions/index', {
      error: error,
      transactionsShow: function(){
          return transactions;
      },
      getUserById: function(userId) {
        for (var user of users) {
          if (user._id.toString() === userId) {
            return user;
          }
        }
      },
      getBookById: function(bookId) {
        for (var book of books) {
          if (book._id.toString() === bookId) {
            return book;
          }
        }
      }
    });
  }
};

module.exports.postComplete = async (request, response) => {
  var id = request.params.id;
  var transactions = await Transaction.findByIdAndUpdate(id,{$set: {isComplete: request.body.isComplete}});

  response.redirect('/transactions');
};

