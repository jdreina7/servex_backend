const SEED_TOKEN = require('../config/seed').SEED;
const jwt = require('jsonwebtoken');


// ================================
// VERIFICAR EL TOKEN
// ================================

exports.verifyToken = function (req, res, next) {

    var _token = req.query.token;

    jwt.verify(_token, SEED_TOKEN, ( err, decoded ) => {
        if ( err ) {
            return res.status(401).json({
                ok: false,
                message: "TOKEN INVÁLIDO: REINICIE SESIÓN",
                errors: err
            });
        }

        req.userLogged = decoded.user;

        next();

        // res.status(200).json({
        //     ok: false,
        //     deco: decoded
        // });
    })

}

