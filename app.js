// Required
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

//Conexión a BBDD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a BBDD \x1b[32m%s\x1b[0m', 'mongodb://localhost:27017/hospitalDB');
});

// Rutas
app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        mensaje: 'Todo bien colegui.'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express corriendo en \x1b[32m%s\x1b[0m', 3000);
});