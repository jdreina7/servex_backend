
const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Client = require('../models/client_model')

var auth = require('../middlewares/auth');
//const SEED_TOKEN = require('../config/seed').SEED;
const jwt = require('jsonwebtoken');

const app = express()

// ================================
// OBTENER TODOS LOS CLIENTES
// ================================
app.get('/', function (req, res) {

    let flag = req.query.desde;
    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);
    
    // El finde recibe 2 argumentos, el primero es la condicion de busqueda, y el segundo, es los campos exactos que necesitamos devolver
    // Pero no es obligatorio, si deseamos realizar una busqueda general lo podemos dejar asi .find({})
    // Client.find({ client_state: true }, 'client_role client_name client_last_name client_email client_img client_country client_city client_gender client_joined client_birthday client_last_activity client_state')
    if (flag) {
        Client.find({})
        .skip(from)
        .limit(to)
        .exec( (err, clients) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            // Client.countDocuments({ client_state: true }, (err, conteo) => {
            Client.countDocuments( (err, conteo) => {
                res.json({
                    ok: true,
                    clients,
                    total: conteo
                });
            })

        })
    } else {
        Client.find({})
        .exec( (err, clients) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            // Client.countDocuments({ client_state: true }, (err, conteo) => {
            Client.countDocuments( (err, conteo) => {
                res.json({
                    ok: true,
                    clients,
                    total: conteo
                });
            })

        })
    }
})

// ===============================================
// Obtener un cliente
// ===============================================
app.get('/:id',  (req, res) => {

    var id = req.params.id;

    console.log('Este es el Id que llega para filtrar el cliente: '+id);

    Client.findById(id)
        .where()
        .exec((err, cliente) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el cliente',
                    errors: err
                });
            }

            if (!cliente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El cliente con el id ' + id + ' no existe.',
                    errors: { message: 'No existe un cliente con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                cliente: cliente

            });
        });
});



// ================================
// CREAR UN CLIENTE
// ================================
app.post('/client', function (req, res) {
    let body = req.body;
    
    let myClient = new Client({
        client_name: body.client_name,
        client_last_name: body.client_last_name,
        client_bussiness_name: body.client_bussiness_name,
        client_description: body.client_description,
        client_email: body.client_email,
        client_logo: body.client_logo,
        client_state: body.client_state
    });

    myClient.save( (err, clientDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            cliente: clientDB,
        });

    });

})


// ================================
// ACTUALIZAR UN CLIENTE
// ================================
app.put('/client/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['client_name', 'client_last_name', 'client_email', 'client_description', 'client_bussiness_name', 'client_logo', 'client_state'] );

	Client.findByIdAndUpdate( id, body, { new: true }, (err, clientDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            cliente: clientDB2
        });
    })
})

// ================================
// ELIMINAR/INACTIVAR UN CLIENTE
// ================================
app.delete('/client/:id', function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    // Client.findByIdAndRemove( id, (err, clientDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if(!clientDeleted) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no existe en la BD'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         cliente: clientDeleted
    //     });
    // })


    // Actualizar el estado: BORRADO LOGICO
    let delete2 = {
        client_state: false
    };
	Client.findByIdAndUpdate( id, {client_state: false}, {new: true}, (err, clientDeleted2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!clientDeleted2) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            cliente: clientDeleted2,
            clientLogin: req.clientLogged
        });
    })

})

// ================================
// ACTIVAR UN CLIENTE INACTIVADO
// ================================
app.put('/activateClient/:id', function (req, res) {
    let id = req.params.id;
    
    Client.findByIdAndUpdate( id, {client_state: true}, {new: true}, (err, clientActivated) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!clientActivated) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            cliente: clientActivated
        });
    })
})

module.exports = app;