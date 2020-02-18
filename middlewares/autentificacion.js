var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

/*===============================
* = VERIFICAR TOKEN  = MIDDLEWARE
* ===============================*/

exports.verificaToken = function(req, res, next) {
    /*Reviso el token de la misma manera que viene en el request*/
    var token = req.query.token;

    /*Hago la verificacion*/
    jwt.verify(token, SEED, (err, decoded) =>{
        if(err){
            return res.status(401).json({
                ok:false,
                mensaje: 'Token Incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        /*Si funciona, hago el next*/
         next();
        /*/!*res.status(200).json({
            ok:true,
            decoded: decoded /!*si funciona, vere lo que trae este decoded*!/!*!/
        });*/
    });
};

