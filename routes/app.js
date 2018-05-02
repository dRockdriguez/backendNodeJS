// Required
var express = require('express');

// Inicializar variables
var app = express();

// Rutas
app.get('/', (request, response, next) => {
    response.status(200).json({
        ok: true,
        mensaje: 'Todo bien colegui.'
    });
});

module.exports = app;