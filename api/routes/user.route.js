var express = require('express');

var controller = require('../controllers/user.controller');

var router = express.Router();

// https://expressjs.com/en/starter/basic-routing.html
router.get("/", controller.get);

router.post('/', controller.postCreate);

router.patch('/:id', controller.postProfile);

module.exports = router;
