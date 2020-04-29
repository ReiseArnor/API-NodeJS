'use strict'

//require("dotenv").config();
var mongoose = require("mongoose");
var app = require("./app");
var port;

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB)
        .then(()=> {
            console.log("Conectado a la DB");
            var server = app.listen(process.env.PORT || 5000, ()=> {
                port = server.address().port;
                console.log("servidor activo en puerto:", port);
            })

        }).catch((error)=>{
            console.log(error);
        });