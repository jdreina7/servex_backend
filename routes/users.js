
const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const User = require('../models/user_model')

var auth = require('../middlewares/auth');
//const SEED_TOKEN = require('../config/seed').SEED;
const jwt = require('jsonwebtoken');

const app = express()

// ================================
// OBTENER TODOS LOS USUARIOS
// ================================
app.get('/', function (req, res) {

    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);
    
    // El finde recibe 2 argumentos, el primero es la condicion de busqueda, y el segundo, es los campos exactos que necesitamos devolver
    // Pero no es obligatorio, si deseamos realizar una busqueda general lo podemos dejar asi .find({})
    // User.find({ usr_state: true }, 'usr_role usr_name usr_last_name usr_email usr_img usr_country usr_city usr_gender usr_joined usr_birthday usr_last_activity usr_state')
    User.find({}, 'usr_role usr_name usr_last_name usr_email usr_img usr_state')
        .skip(from)
        .limit(to)
        .exec( (err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            // User.countDocuments({ usr_state: true }, (err, conteo) => {
            User.countDocuments( (err, conteo) => {
                res.json({
                    ok: true,
                    users,
                    total: conteo
                });
            })

        })
})

// ===============================================
// Obtener un usuario
// ===============================================
app.get('/:id', (req, res) => {

    var id = req.params.id;

    console.log('Este es el Id que llega para filtrar el usuario: '+id);

    User.findById(id)
        .where()
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el usuario',
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario con el id ' + id + ' no existe.',
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuario

            });
        });
});


// ================================
// CREAR UN USUARIO
// ================================
app.post('/user',  function (req, res) {
    let body = req.body;
    
    let myUser = new User({
        usr_name: body.usr_name,
        usr_last_name: body.usr_last_name,
        usr_email: body.usr_email,
        usr_password: bcrypt.hashSync(body.usr_password, bcrypt.genSaltSync(10)),
        usr_img: body.usr_img,
        usr_img_top: body.usr_img_top,
        usr_role: body.usr_role,
        usr_state: body.usr_state
    });

    myUser.save( (err, usrDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usrDB,
            usrLogin: req.userLogged
        });

    });

})


// ================================
// ACTUALIZAR UN USUARIO
// ================================
app.put('/user/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['usr_name', 'usr_last_name', 'usr_email', 'usr_birthday', 'usr_img', 'usr_img_top', 'usr_role','usr_state'] );

	User.findByIdAndUpdate( id, body, { new: true }, (err, usrDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usrDB2,
            usrLogin: req.userLogged
        });
    })
})

// ================================
// ACTUALIZAR CONTRASEÑA DE USUARIO
// ================================
app.put('/userPass/:id', function (req, res) {
    let id = req.params.id;
    let pass1 = req.body.usr_password1;
    let pass2 = req.body.usr_password2;

	User.findById( id, (err, usrDB3) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !bcrypt.compareSync(pass1, usrDB3.usr_password ) ) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas - password",
                errors: err
            });
        } else {
            usrDB3.usr_password = bcrypt.hashSync(pass2, bcrypt.genSaltSync(10));
            usrDB3.save();

            res.json({
                ok: true,
                usuario: usrDB3,
                message: "Contraseña actualizada correctamente",
                usrLogin: req.userLogged
            });
        }

    })
})

// ================================
// ELIMINAR/INACTIVAR UN USUARIO
// ================================
app.delete('/user/:id', function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    // User.findByIdAndRemove( id, (err, userDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if(!userDeleted) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no existe en la BD'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: userDeleted
    //     });
    // })


    // Actualizar el estado: BORRADO LOGICO
    let delete2 = {
        usr_state: false
    };
	User.findByIdAndUpdate( id, {usr_state: false}, {new: true}, (err, userDeleted2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!userDeleted2) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            usuario: userDeleted2,
            usrLogin: req.userLogged
        });
    })

})

// ================================
// ACTIVAR UN USUARIO INACTIVADO
// ================================
app.put('/activateUser/:id', function (req, res) {
    let id = req.params.id;
    
    User.findByIdAndUpdate( id, {usr_state: true}, {new: true}, (err, usrActivated) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!usrActivated) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usrActivated,
            usrLogin: req.userLogged
        });
    })
})

module.exports = app;