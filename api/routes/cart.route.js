var express = require('express');
var controller = require('../controllers/cart.controller');

var router = express.Router();

router.get('/:id', controller.get);

router.post('/:id', controller.addToCart);

module.exports = router;