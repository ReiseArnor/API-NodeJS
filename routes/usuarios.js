'use strict'

var express = require("express");
var usuarioController = require("../controllers/usuarios");
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.SECRET // NUNCA MANTENER EL SECRETO EN EL CODIGO!
});


var router = express.Router();

router.post('/reguser', usuarioController.saveUsuario);
router.get('/getusers',auth ,usuarioController.getUsers);
router.post('/loguser',usuarioController.loginUser);

module.exports = router;

