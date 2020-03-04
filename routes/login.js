var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');


/*Metodo de login*/
app.post('/', (req,res) => {

    var body = req.body;

    Usuario.findOne({email: body.email},(err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error al buscar Usuarios',
                errors: err
            });
        }

        if(!usuarioDB){
            res.status(400).json({
                ok: true,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if( bcrypt.compareSync(body.password, usuarioDB.password) ) {
            res.status(400).json({
                ok: true,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        /*Crear un Token*/
        usuarioDB.password = '(:'; //Esto es para no mandar la pass en el token

        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400});

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });
});

module.exports = app;
