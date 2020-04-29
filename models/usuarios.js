'user strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var UsuarioSchema = Schema({
    nickname: String,
    email: String,
    age: Number,
    reg_date: Date,
    hash: String,
    salt: String,
});

UsuarioSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  };

UsuarioSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
  };

UsuarioSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    id: this._id,
    email: this.email,
    nickname: this.nickname,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.SECRET); // NUNCA MANTENER EL SECRETO EN EL CODIGO!
};

module.exports = mongoose.model('Usuario', UsuarioSchema);