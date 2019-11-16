
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');

const Product = require('../models/product_model')
const app = express()

// ================================
// OBTENER TODOS LOS PRODUCTOS
// ================================
app.get('/', function (req, res) {

    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);
    
    // El finde recibe 2 argumentos, el primero es la condicion de busqueda, y el segundo, es los campos exactos que necesitamos devolver
    // Pero no es obligatorio, si deseamos realizar una busqueda general lo podemos dejar asi .find({})
    Product.find({ prod_state: true })
        .populate('prod_client')
        .populate('prod_category')
        .populate('prod_subcategory')
        .populate('prod_created_by')
        .skip(from)
        .limit(to)
        .exec( (err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            Product.countDocuments({ prod_state: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    products,
                    total: conteo
                });
            })

        })
})

// ================================
// CREAR UN PRODUCTO
// ================================
app.post('/product', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let myProduct = new Product({
        prod_name: body.name,
        prod_description: body.description,
        prod_img: body.img,
        prod_file: body.file,
        prod_client: body.client,
        prod_category: body.category,
        prod_subcategory: body.subcategory,
        prod_created_by: body.created_by,
        prod_state: body.state,
    });

    myProduct.save( (err, productDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productDB,
            usrLogin: req.userLogged
        });

    });

})


// ================================
// ACTUALIZAR UN PRODUCTO
// ================================
app.put('/product/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['prod_name','prod_description','prod_img','prod_file','prod_client','prod_category','prod_subcategory'] );

	Product.findByIdAndUpdate( id, body, {new: true}, (err, productDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productDB2,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UN PRODUCTO
// ================================
app.delete('/product/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    // Product.findByIdAndRemove( id, (err, userDeleted) => {
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
    //         producto: userDeleted
    //     });
    // })


    // Actualizar el estado: BORRADO LOGICO

	Product.findByIdAndUpdate( id, {prod_state: false}, {new: true}, (err, prodDeleted2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!prodDeleted2) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            producto: prodDeleted2,
            usrLogin: req.userLogged
        });
    })

})

module.exports = app;