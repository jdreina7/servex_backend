
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');

const Subcategory = require('../models/subcategory_model')
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
    Subcategory.find({ subcat_state: true })
        .populate('subcat_category', 'cat_name')
        .populate('subcat_created_by')
        .skip(from)
        .limit(to)
        .exec( (err, subcategories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            Subcategory.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    subcategories,
                    total: conteo
                });
            })

        })
})

// ================================
// CREAR UNA CATEGORIA
// ================================
app.post('/subcategory', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let mySubcategory = new Subcategory({
        subcat_name: body.subcat_name,
        subcat_description: body.subcat_description,
        subcat_img: body.subcat_featured_img,
        subcat_category: body.subcat_category,
        subcat_created_by: body.subcat_created_by,
    });

    mySubcategory.save( (err, categoryDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            subcategoria: categoryDB,
            usrLogin: req.userLogged
        });

    });

})

// ===============================================
// Obtener una Subcategoria
// ===============================================
app.get('/:id', auth.verifyToken, (req, res) => {

    var id = req.params.id;

    console.log('Este es el Id que llega para filtrar la subcategoria: '+id);

    Subcategory.findById(id)
        .where()
        .exec((err, subcategoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la subcategoria',
                    errors: err
                });
            }

            if (!subcategoria) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La subcategoria con el id ' + id + ' no existe.',
                    errors: { message: 'No existe una subcategoria con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                subcategoria: subcategoria

            });
        });
});

// ================================
// ACTUALIZAR UNA CATEGORIA
// ================================
app.put('/subcategory/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['subcat_name', 'subcat_description', 'subcat_img', 'subcat_category', 'subcat_created_by'] );

	Subcategory.findByIdAndUpdate( id, body, {new: true}, (err, subcategoryDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            subcategoria: subcategoryDB2,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UNA CATEGORIA
// ================================
app.delete('/subcategory/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    Subcategory.findByIdAndRemove( id, (err, cateDeleted) => {
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
                    message: 'Subcategoria no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            subcategoria: cateDeleted
        });
    })


    // Actualizar el estado: BORRADO LOGICO

	// Subcategory.findByIdAndUpdate( id, {subcat_state: false}, {new: true}, (err, catDeleted2) => {
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
    //                 message: 'Subcategoria no existe en la BD'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         subcategoria: catDeleted2,
    //         usrLogin: req.userLogged
    //     });
    // })

})


// ================================
// OBTENER TODAS LAS SUBCATEGORIAS DE UNA CATEGORIA
// ================================
app.get('/allsubcategories/:id', function (req, res) {

    var id = req.params.id;
    
    // El finde recibe 2 argumentos, el primero es la condicion de busqueda, y el segundo, es los campos exactos que necesitamos devolver
    // Pero no es obligatorio, si deseamos realizar una busqueda general lo podemos dejar asi .find({})
    // User.find({ usr_state: true }, 'usr_role usr_name usr_last_name usr_email usr_img usr_country usr_city usr_gender usr_joined usr_birthday usr_last_activity usr_state')
    Subcategory.find({ subcat_category: id }, 'subcat_name')
        .exec( (err, subcategories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            // User.countDocuments({ usr_state: true }, (err, conteo) => {
            Subcategory.countDocuments( (err, conteo) => {
                res.json({
                    ok: true,
                    subcategories,
                    total: conteo
                });
            })

        })
})

module.exports = app;