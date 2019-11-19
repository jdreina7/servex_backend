const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user_model')
const _ = require('underscore')

const SEED_TOKEN = require('../config/seed').SEED;
const jwt = require('jsonwebtoken');

const app = express()

app.post('/', (req, res) => {

    let body = req.body;

    User.findOne({ usr_email: body.usr_email }, (err, userBD ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: "DB ERROR TRYING LOGIN THE USER!",
                errors: err
            });
        }

        if ( !userBD ) {
            return res.status(400).json({
                ok: false,
                message: "UPS!, WRONG EMAIL!",
                errors: err
            });
        }

        if ( userBD.usr_state === false ) {
            return res.status(403).json({
                ok: false,
                message: "FORBIDDEN - USER INACTIVE, CONTACT WITH THE ADMINISTRATOR SYSTEM",
                errors: err
            });
        }

        if ( !bcrypt.compareSync(body.usr_password, userBD.usr_password ) ) {
            return res.status(400).json({
                ok: false,
                message: "WRONG PASSWORD!",
                errors: err
            });
        }

        // Crear token
        var token = jwt.sign({ user: userBD }, SEED_TOKEN, { expiresIn: 14400 }); // 4 horas


        res.status(200).json({
            ok: true,
            mensaje: 'LOGIN SUCCESFULL!',
            user: userBD,
            id: userBD._id,
            token: token
        });

    });

})


module.exports = app;