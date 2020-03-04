var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// var SEED = require('../config/config').SEED;

var mdAutentication = require('../middlewares/autentificacion');

var app = express();

var Usuario = require('../models/usuario');

/*===============================
* = OBTENER TODOS LOS USUARIOS =
* ===============================*/
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
        (err, usuarios) => {
        if(err){
            return res.status(500).json({
                ok:false,
                mensaje: 'Error Cargando Usuarios',
                errors: err
            });
        }

        Usuario.count({}, (err, conteo) =>{
            res.status(200).json({
                ok: true,
                usuarios: usuarios,
                total: conteo
            });
        });
    });
});


/*===============================
* = ACTUALIZAR USUARIO  =
* ===============================*/
app.put('/:id', mdAutentication.verificaToken, (req , res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id , (err, usuario) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: {message: 'no existe un usuario con ese ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email= body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Usuario',
                    errors: err
                })
            }
/*Cuando se guarde la contraseña, no saldra la encriptacion de la misma, si no que saldra la carita*/
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});


/*===============================
* = CREAR UN NUEVO USUARIO  = POST
* ===============================*/
app.post('/', mdAutentication.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        /*Si todo lo hace correctamente, quiero un estatus 200*/
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });
});

/*===============================
* = BORRAR UN USUARIO POR EL ID =
* ===============================*/
app.delete('/:id', mdAutentication.verificaToken,(req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        /*Si no viene un usuario*/
        if(!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {message:'No existe un usuario con ese ID'}
            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});



module.exports = app;
