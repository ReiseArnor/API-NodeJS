'use strict'
var Project = require("../models/projects");
var fs = require("fs");
var path = require("path");
var jimp = require("jimp");
var Device = require("../models/device");
const iplocation = require("iplocation").default;

var controller = {

    test: function(req, res){
        return res.status(200).send({mensaje: "metodo test ejecutado!"});
    },

    saveProject: function(req, res){
        var project = new Project();
        var date = new Date();
        
        var params = req.body;
        project.titulo = params.titulo;
        project.tags = params.tags;
        project.contenido = params.contenido;
        project.up_date = date;
        project.img = null;
        project.by = params.by;

        project.save((err, projectStored)=>{
            if(err) return res.status(500).send({mensaje: 'error guardando!'});

            if(!projectStored) return res.status(404).send({mensaje: 'El Post no se guardo!'});

            return res.status(200).send({project: projectStored});
        });
    },

    getProject: function(req, res){
        var projectId = req.params.id;

        if(projectId == null) return res.status(404).send({mensaje: 'El projecto no existe'});

        Project.findById(projectId, (err, project)=>{
            if(err) return res.status(500).send({mensaje: 'Error al devolver los datos'});

            if(!project) return res.status(404).send({mensaje: 'El projecto no existe'});

            return res.status(200).send({project});
        })
    },

    getProjectList: function (req, res){
        Project.find({}).sort('-up_date').exec((err, list)=>{
            if(err) return res.status(500).send({mensaje: 'Error al devolver los datos'});

            if(!list) return res.status(404).send({mensaje: 'La lista de proyectos no existe'});

            return res.status(200).send({list, Project});
        })

        //guardar la info de localizacion y dispositivos de los visitantes
        var devices = new Device();
        devices.device = req.device.type;
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        devices.ip = ip;
        devices.date = new Date();

        iplocation(ip,[],(err, res)=> {
            if(err) {
                console.log(err);
            }else{
                devices.country = res.country,
                devices.region = res.region,
                devices.city = res.city,
                devices.lat = res.latitude,
                devices.lon = res.longitude;
                devices.save();
            }
        })
    },

    updateProject: function(req, res){
        var projectId = req.params.id;
        var update = req.body;

        Project.findByIdAndUpdate(projectId, update, {new:true}, (err, projectUpdated)=>{
            if(err) return res.status(500).send({mensaje: 'Error al actualizar los datos'});

            if(!projectUpdated) return res.status(404).send({mensaje: 'El proyecto no existe'});

            return res.status(200).send({project: projectUpdated});
        })
    },

    removeProject: function(req, res){
        var projectId = req.params.id;

        Project.findByIdAndRemove(projectId, (err, projectRemoved)=>{
            if(err) return res.status(500).send({mensaje: 'Error al borrarr los datos'});

            if(!projectRemoved) return res.status(404).send({mensaje: 'El proyecto no existe'});

            return res.status(200).send({project: projectRemoved});
        })
    },

    uploadImage: function(req, res){
        var projectId = req.params.id;
        var fileName = 'Imagen no subida...';

        if(req.files){
            var filePath = req.files.img.path;
            var fileSplit = filePath.split('/');
            let fileName = fileSplit[1];
            var fileExtSplit = fileName.split(".");
            var fileExt = fileExtSplit[1];

            if(fileExt == 'png' || fileExt == 'jpeg'){
                jimp.read(filePath)
                .then(img => {
                    return img
                    .resize(1280, 720) 
                    .quality(60)
                    .write(filePath); // save
                })
                .catch(err => {
                    console.error(err);
                });

                Project.findByIdAndUpdate(projectId, {img: fileName}, {new:true}, (err, projectUpdated)=>{
                    if(err) return res.status(500).send({mensaje: 'Error al actualizar los datos'});
        
                    if(!projectUpdated) return res.status(404).send({mensaje: 'El proyecto no existe'});
        
                    return res.status(200).send({project: projectUpdated, mensaje: 'success'});
                });
            }else{
                fs.unlink(filePath, (err)=>{
                    return res.status(200).send({mensaje: 'Extencion de imagen invalida!'});
                })
            }
            
        }else{
            return res.status(200).send({mensaje: fileName});
        }
    },
    
    getImage: function(req, res){
        var file = req.params.img;
        var path_file = './uploads/'+file;

        fs.exists(path_file, (exists)=>{
            if(exists) {
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(200).send({mensaje: 'No existe la imagen'});
            }
        })

    }
};

module.exports = controller;