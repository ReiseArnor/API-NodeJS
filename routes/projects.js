'use strict'

var express = require("express");
var projectController = require("../controllers/projects");

var router = express.Router();

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart({uploadDir: './uploads'});
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.SECRET // NUNCA MANTENER EL SECRETO EN EL CODIGO!
});

router.post('/save-project', auth, projectController.saveProject);
router.get('/project/:id?', projectController.getProject);
router.get('/projectlist', projectController.getProjectList);
router.put('/projectupdate/:id', auth, projectController.updateProject);
router.delete('/projectdelete/:id', auth, projectController.removeProject);
router.post('/upload/:id', multipartMiddleware, auth, projectController.uploadImage);
router.get('/get-img/:img', projectController.getImage);

module.exports = router;