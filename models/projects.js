'user strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectSchema = Schema({
    img: String,
    titulo: String,
    tags: String,
    contenido: String,
    by: String,
    up_date: Date
});

module.exports = mongoose.model('Project', ProjectSchema);