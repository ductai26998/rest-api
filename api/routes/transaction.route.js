var express = require('express');
var controller = require('../controllers/transaction.controller');

var router = express.Router();

router.get("/", controller.get);

router.post("/", controller.postCreate);

router.patch("/:id", controller.postComplete);

module.exports = router;