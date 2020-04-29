'use strict'

var express = require("express");
var bodyParser = require("body-parser");
var device = require("express-device");
var app = express();
var session = require("express-session");
require('./config/passport');
var passport = require('passport');
var MongoDBStore = require('connect-mongodb-session')(session);

/// store de sesiones
var store = new MongoDBStore({
    uri: process.env.MONGODB, // NUNCA MANTENER LA INFORMACION DE LA CONEXION A LA BASE DE DATOS EN EL CODIGO
    collection: 'sessions'
  });
/// si hay error en la store
store.on('error', function(error) {
console.log(error);
});

//archivos de rutas
var project_routes = require("./routes/projects");
var usuarios_routes = require("./routes/usuarios");
var message_routes = require("./routes/message");

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({ 
    secret: process.env.SECRET, //NUNCA MANTENER EL SECRETO EN EL CODIGO
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 semana
    },
    store: store,
    resave: true,
    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(device.capture());

//Config
app.set('trust proxy', true);

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Origin, Content-Type, X-Auth-Token, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Rutas
app.use("/api", project_routes);
app.use("/api", usuarios_routes);
app.use("/api", message_routes);


module.exports = app;