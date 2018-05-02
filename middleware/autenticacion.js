var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verificaToken = function(req, res, next) {
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

        req.usuario = decoded.usuario;

        next();
    });
}