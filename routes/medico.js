var express = require('express');

var mdAutentification = require('../middlewares/autentificacion');

var app = express();

var Medico = require('../models/medico');


/*===============================
* = OBTENER TODOS LOS MEDICOS = GET
* ===============================*/
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    /*No especifico los campos, porque quiero que los muestre todos*/
    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if(err){
                    return res.status(500).json({
                        ok:false,
                        mensaje: 'Error Cargando Medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) =>{
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
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

    Medico.findById(id , (err, medico) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Médico',
                errors: err
            });
        }

        if(!medico){
            return res.status(400).json({
                ok: false,
                mensaje: 'El Médico con el id ' + id + ' no existe',
                errors: {message: 'no existe un médico con ese ID'}
            });
        }

        /*Mantenimiento*/
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar médico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});


/*===============================
* = CREAR UN NUEVO HOSPITAL  = POST
* ===============================*/

app.post('/', mdAutentification.verificaToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Médico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

/*===============================
* = BORRAR UN HOSPITAL POR EL ID = DELETE
* ===============================*/
app.delete('/:id', mdAutentification.verificaToken,(req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if(!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese ID',
                errors: {message:'No existe un medico con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});



module.exports = app;
