
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');

const Category = require('../models/category_model')
const app = express()

// ================================
// OBTENER TODOS LAS CATEGORIAS
// ================================
app.get('/', function (req, res) {

    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);
    
    // El finde recibe 2 argumentos, el primero es la condicion de busqueda, y el segundo, es los campos exactos que necesitamos devolver
    // Pero no es obligatorio, si deseamos realizar una busqueda general lo podemos dejar asi .find({})
    Category.find({ cat_state: true })
        .skip(from)
        .limit(to)
        .exec( (err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            Category.countDocuments({ cat_state: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categories,
                    total: conteo
                });
            })

        })
})

// ================================
// CREAR UNA CATEGORIA
// ================================
app.post('/category', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let myCategory = new Category({
        cat_name: body.cat_name,
        cat_description: body.cat_description,
        cat_img: body.cat_featured_img,
        cat_support_subcategories: body.cat_support_subcategories,
        cat_created_by: body.cat_created_by,
        cat_state: body.cat_state,
    });

    myCategory.save( (err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoryDB,
            usrLogin: req.userLogged
        });

    });

})


// ================================
// ACTUALIZAR UNA CATEGORIA
// ================================
app.put('/category/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['cat_name', 'cat_description', 'cat_img', 'cat_support_subcategories', 'cat_created_by'] );

	Category.findByIdAndUpdate( id, body, {new: true}, (err, categoryDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoryDB2,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UNA CATEGORIA
// ================================
app.delete('/category/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    Category.findByIdAndRemove( id, (err, cateDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!cateDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            categoria: cateDeleted
        });
    })


    // Actualizar el estado: BORRADO LOGICO

	// Category.findByIdAndUpdate( id, {cat_state: false}, {new: true}, (err, catDeleted2) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if(!catDeleted2) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Categoria no existe en la BD'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         categoria: catDeleted2,
    //         usrLogin: req.userLogged
    //     });
    // })

})

module.exports = app;