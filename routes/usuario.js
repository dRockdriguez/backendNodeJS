// Required
var express = require('express');
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middleware/autenticacion');

// Inicializar variables
var app = express();

// Rutas
app.get('/', (request, response, next) => {
    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error obteniendo usuarios',
                        errors: err
                    });
                }
                return response.status(200).json({
                    ok: true,
                    Usuarios: usuarios
                });
            });
});


// Creamos middleware, verificar token
/*app.use('/', (request, response, next) => {
    var token = request.query.token;
    //var token = jwt.sign({ usuario: us }, SEED, { expiresIn: 14400 }); // 4 horas

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return response.status(401).json({
                ok: false,
                mensaje: 'Incorrect Token!',
                errors: err
            });
        }

        next();
    });
});
*/
app.post('/', mdAutenticacion.verificaToken, (request, response, next) => {
    var body = request.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error creando el usuario',
                errors: err
            });
        }
        return response.status(201).json({
            ok: true,
            body: usuarioGuardado
        });
    });

});

app.put('/:id', mdAutenticacion.verificaToken, (request, response, next) => {
    var id = request.params.id;
    var usuario = new Usuario({});
    Usuario.findById(id, (err, us) => {
        if (err) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error',
                errors: err
            });
        }
        if (!us) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error, el usuario  no se encuentra: ' + id,
                errors: { message: 'No existe usuario con id ' + id }
            });
        }

        var body = request.body;
        us.nombre = body.nombre;
        us.email = body.email;
        us.role = body.role;

        us.save((err, usuarioGuardado) => {
            if (err) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';

            return response.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

app.delete('/:id', mdAutenticacion.verificaToken, (request, response, next) => {
    var id = request.params.id;

    Usuario.findByIdAndRemove(id, (err, us) => {
        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!us) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error, el usuario  no se encuentra: ' + id,
                errors: { message: 'No existe usuario con id ' + id }
            });
        }

        return response.status(200).json({
            ok: true,
            usuario: us
        });
    })
});



module.exports = app;