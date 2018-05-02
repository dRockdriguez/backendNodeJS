// Required
var express = require('express');
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Inicializar variables
var app = express();

app.post('/', (request, response) => {
    var body = request.body;

    Usuario.findOne({ email: body.email }, (err, us) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error login',
                errors: err
            });
        }
        if (!us) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, us.password)) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password'
            });
        }

        // Creamos token
        var token = jwt.sign({ usuario: us }, SEED, { expiresIn: 14400 }); // 4 horas
        us.password = ':)';
        return response.status(200).json({
            ok: true,
            mensaje: 'Login correcto',
            usuario: us,
            id: us.id,
            token: token
        });
    });
});

module.exports = app;