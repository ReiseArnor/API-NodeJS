'use strict'

var controller = {
    ready: function(req, res){
        return res.status(200).send({message:"Todo bien hasta ahora..."});
    }
}

module.exports = controller;