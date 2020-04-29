'use strict'
var Usuario = require("../models/usuarios");
var passport = require("passport")

var controller = {

    saveUsuario: function(req, res){
        var usuario = new Usuario();
        var password;
        var params = req.body;

        usuario.nickname = params.nickname;
        password = params.password;
        usuario.email = params.email;
        usuario.age = params.age;
        usuario.reg_date = params.date;

        Usuario.find({"email":usuario.email}).exec((err, user)=>{
            if(err) return res.status(500).send({mensaje: 'Error buscando en la base de datos'});

            if(user.length>0) return res.status(200).send({mensaje: 'Este email ya está registrado! intenta con otro.'});

            if(user.length == 0){
                Usuario.find({"nickname":usuario.nickname}).exec((err, user)=>{
                    if(err) return res.status(500).send({mensaje: 'Error buscando en la base de datos'});

                    if(user.length>0) return res.status(200).send({mensaje: 'Este nick ya está registrado! intenta con otro.'});

                    if(user.length == 0){
                        usuario.setPassword(password);
                        
                        usuario.save((err, usuarioStored)=>{
                        if(err) return res.status(500).send({mensaje: 'Error guardando el usuario'});
            
                        if(!usuarioStored) return res.status(404).send({mensaje: 'El usuario no se pudo guardar'});

                        return res.status(200).send({usuario: "registrado!"});
                    });
                    }
                })
                
            }
        })
    },

    loginUser: function(req,res,next){
        passport.authenticate("local", function(err, user, info){
            var token;

            // error
            if (err) {
                res.status(404).send({mensaje: err});
                return;
            }
            // si encuentra el usuario
            if(user){
                token = user.generateJwt();
                user.salt = null;
                user.hash = null;
                res.status(200).send({"token" : token, "user": user});
            } else {
            // si NO encuentra el usuario
                res.status(401).send({mensaje: info});
            }
       })(req,res,next); 
     },

    getUsers: function async(req, res){
        Usuario.find({}).sort('-reg_date').exec((err, list)=>{
            if(err) return res.status(500).send({mensaje: 'Error al devolver los datos'});

            if(!list) return res.status(404).send({mensaje: 'La lista de usuarios no existe'});

            return res.status(200).send({list, Usuario});
        })
    }
}

module.exports = controller;