var express = require('express');

var controller = require('../controllers/book.controller');

var router = express.Router();


// https://expressjs.com/en/starter/basic-routing.html
router.get("/", controller.get);

router.post('/', controller.postCreate);

router.delete("/:id", controller.delete);

router.patch('/:id', controller.postUpdate);

module.exports = router;
