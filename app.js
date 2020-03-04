/*Requires*/
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

/*Inicializar variables*/
var app = express();

/*Body-Parser*/
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*Importar Rutas*/
var appRoutes = require('./routes/app');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

/*Conexión a la base de datos*/
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
    if ( error) throw error;

    console.log('Base de datos: \x1b[32m%s\x1b[0m' , 'online');
});

//server index config
/*var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));*/

/*Rutas*/
/*AHORA LA RUTA LA MOVI EL APP.JS DE LA CARPETA ROUTES*/
app.use('/imagenes', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

/*Escuchar Peticiones*/
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m' , 'online');
});
