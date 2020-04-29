'user strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DeviceSchema = Schema({
    device: String,
    ip: String,
    country: String,
    region: String,
    city: String,
    lat: Number,
    lon: Number,
    date: Date
});

module.exports = mongoose.model('Device', DeviceSchema);