'use strict'

var express = require("express");
var messageController = require("../controllers/message");
var router = express.Router();

router.get('/ready', messageController.ready)

module.exports = router