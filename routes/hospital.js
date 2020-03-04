var express = require('express');

var mdAutentification = require('../middlewares/autentificacion');

var app = express();

var Hospital = require('../models/hospital');


/*Para probar que la conexión esta funcionando*/
/*app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});*/

/*===============================
* = OBTENER TODOS LOS HOSPITALES = GET
* ===============================*/
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    /*No especifico los campos, porque quiero que los muestre todos*/
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje: 'Error Cargando Hospitales',
                        errors: err
                    });
                }
                Hospital.count({}, (err, conteo) =>{
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });
            });
});

/*/!*===============================
* = ACTUALIZAR HOSPITAL  = PUT
* ===============================*!/*/
app.put('/:id', mdAutentification.verificaToken, (req , res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id , (err, hospital) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: {message: 'no existe un hospital con ese ID'}
            });
        }

        /*Mantenimiento*/
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});


/*===============================
* = CREAR UN NUEVO HOSPITAL  = POST
* ===============================*/

app.post('/', mdAutentification.verificaToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Hospital',
                errors: err
            });
        }
        // /!*Si todo lo hace correctamente, quiero un estatus 200*!/
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

/*===============================
* = BORRAR UN HOSPITAL POR EL ID = DELETE
* ===============================*/
app.delete('/:id', mdAutentification.verificaToken,(req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if(!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: {message:'No existe un hospital con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});



module.exports = app;
