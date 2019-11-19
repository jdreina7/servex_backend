
const express = require('express')

const User = require('../models/user_model')
const Client = require('../models/client_model')
const Category = require('../models/category_model')
const Subcategory = require('../models/subcategory_model')
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
            searchCategory( busqueda, regex ),
            searchSubcategory( busqueda, regex ),
            searchProduct( busqueda, regex )

        ])
        .then( respuestas => {
            // console.log(respuestas);
            res.json({
                ok: true,
                users: respuestas[0],
                clients: respuestas[1],
                categories: respuestas[2],
                subcategories: respuestas[3],
                products: respuestas[4]
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

    function searchCategory(busqueda, regex) {
        return new Promise( ( resolve, reject ) => {
            Category.find({ cat_name: regex })
                .exec((err, categories) => {
                if ( err ) {
                    reject('Error al ejecutar la búsqueda de categorias', err);
                } else {
                    resolve( categories );
                }
            })
        })
    }

    function searchSubcategory(busqueda, regex) {
        return new Promise( ( resolve, reject ) => {
            Subcategory.find({ subcat_name: regex })
                .populate('subcat_category') 
                .populate('subcat_client')
                .exec((err, subcategories) => {
                if ( err ) {
                    reject('Error al ejecutar la búsqueda de subcategorias', err);
                } else {
                    resolve( subcategories );
                }
            })
        })
    }

    function searchProduct(busqueda, regex) {
        return new Promise( ( resolve, reject ) => {
            Product.find({ prod_name: regex })
                .populate('prod_category')
                .populate('prod_client')
                .populate('prod_subcategory')
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