var express = require('express');
var controller = require('../controllers/auth.controller');

var router = express.Router();

// https://expressjs.com/en/starter/basic-routing.html

router.post("/", controller.postLogin);

module.exports = router;