// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config();
// console.log(process.env);
const express = require("express");
var cookieParser = require("cookie-parser");
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const app = express();

var db = require('./db');
var bookRoute = require('./routes/book.route');
var userRoute = require('./routes/user.route');
var transactionRoute = require('./routes/transaction.route');
var authRoute = require('./routes/auth.route');
var cartRoute = require('./routes/cart.route');

var apibookRoute = require('./api/routes/book.route');

var authMiddleware = require('./middlewares/auth.middleware');
var sessionMiddleware = require('./middlewares/session.middleware');

var port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html

//app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware);
app.use(express.static('./dist'));

app.use('/books', authMiddleware.setLocalUser, bookRoute);
app.use('/users', authMiddleware.requireAuth, userRoute);
app.use('/transactions', authMiddleware.requireAuth, transactionRoute);
app.use('/auth', authRoute);
app.use('/cart', cartRoute);

app.use('/api/books', apibookRoute);

app.get("/", (request, response) => {
  response.render('index');
});
// app.get('/', (req, res) => {
//   res.sendFile('index.html');
// })

// listen for requests :)
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});

