
const express = require('express')

const User = require('../models/user_model')
const Client = require('../models/client_model')
const Product = require('../models/product_model')

const app = express()

// ================================
// BUSQUEDA GENERAL
// ================================
app.get('/all/:search', (req, res) => {

    let busqueda = req.params.search;
    var regex = new RegExp(busqueda, 'i');

    Promise.all(
        [
            searchUsers( busqueda, regex ),
            searchClient( busqueda, regex ),
            searchProduct( busqueda, regex )
        ])
        .then( respuestas => {
            // console.log(respuestas);
            res.json({
                ok: true,
                users: respuestas[0],
                clients: respuestas[1],
                products: respuestas[2]
            });
        });

    

    function searchUsers(busqueda, regex) {
        return new Promise( ( resolve, reject ) => {
            User.find()
            .or( [{ usr_name: regex }, { usr_email: regex } ])
            .exec( (err, users) => {
                if ( err ) {
                    reject('Error al ejecutar la búsqueda de usuarios', err);
                } else {
                    resolve( users );
                }
            })
        })
    }

    function searchClient(busqueda, regex) {
        return new Promise( ( resolve, reject ) => {
            Client.find()
                .or([{ client_name: regex }, { client_bussiness_name: regex }])
                .exec((err, clients) => {
                if ( err ) {
                    reject('Error al ejecutar la búsqueda de clientes', err);
                } else {
                    resolve( clients );
                }
            })
        })
    }

    function searchProduct(busqueda, regex) {
        return new Promise( ( resolve, reject ) => {
            Product.find({ product_name: regex })
            .populate('product_created_by')
            .exec((err, products) => {
                if ( err ) {
                    reject('Error al ejecutar la búsqueda de los productos', err);
                } else {
                    resolve( products );
                    // console.log('entro al product y devolvio: ' + product );
                }
            })
            
        })
    }


})

module.exports = app;