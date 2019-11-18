
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');

const CatCliSub = require('../models/categoryClientSubcategory_model')
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
    CatCliSub.find({ catclisub_state: true })
        .populate('catclisub_category')
        .populate('catclisub_client', 'client_bussiness_name')
        .populate('catclisub_subcategory')
        .skip(from)
        .limit(to)
        .exec( (err, catclisub) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            CatCliSub.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    catclisub,
                    total: conteo
                });
            })

        })
})

// ================================
// CREAR UNA CATEGORIA
// ================================
app.post('/catclisub', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let myCatCli = new CatCliSub({
        catclisub_category: body.catclisub_category,
        catclisub_client: body.catclisub_client,
        catclisub_subcategory: body.catclisub_subcategory,
        catclisub_created_by: body.catclisub_created_by,
    });

    myCatCli.save( (err, catcliDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            catclisub: catcliDB,
            usrLogin: req.userLogged
        });

    });

})

// ===============================================
// Obtener por la categoria
// ===============================================
app.get('/category/:id', auth.verifyToken, (req, res) => {

    var id = req.params.id;

    console.log('Este es el Id que llega para filtrar la catclisub: '+id);

    CatCliSub.find({ catclisub_category: id })
        .populate('catclisub_category')
        .populate('catclisub_client', 'client_bussiness_name')
        .populate('catclisub_subcategory')
        .where()
        .exec((err, catclisub) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la categoria de catclisub',
                    errors: err
                });
            }

            if (!catclisub) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La categoria con el id ' + id + ' no existe en la relacion catclisub.',
                    errors: { message: 'No existe una categoria con ese ID en catclisub' }
                });
            }

            CatCliSub.countDocuments({ catclisub_category: id }, (err, conteo) => {
                if (conteo > 0) {
                    res.json({
                        ok: true,
                        catclisub: catclisub,
                        total: conteo
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'La categoria con el id ' + id + ' no existe en la relacion catclisub.',
                        errors: { message: 'No existe una categoria con ese ID en catclisub' }
                    });
                }
                
            })
        });
});


// ===============================================
// Obtener por el cliente
// ===============================================
app.get('/client/:id', auth.verifyToken, (req, res) => {

    var id = req.params.id;

    console.log('Este es el Id que llega para filtrar la catclisub: '+id);

    CatCliSub.find({ catclisub_client: id })
        .populate('catclisub_category')
        .populate('catclisub_client', 'client_bussiness_name')
        .populate('catclisub_subcategory')
        .where()
        .exec((err, catcli2) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el cliente de catclisub',
                    errors: err
                });
            }

            if (!catcli2) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El cliente con el id ' + id + ' no existe en la relacion catclisub.',
                    errors: { message: 'No existe un client con ese ID en catclisub' }
                });
            }

            CatCliSub.countDocuments({ catclisub_client: id }, (err, conteo) => {
                if (conteo > 0) {
                    res.json({
                        ok: true,
                        catclisub: catcli2,
                        total: conteo
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El cliente con el id ' + id + ' no existe en la relacion catclisub.',
                        errors: { message: 'No existe un client con ese ID en catclisub' }
                    });
                }
                
            })
            
        });
});


// ===============================================
// Obtener por la subcategory
// ===============================================
app.get('/subcategory/:id', auth.verifyToken, (req, res) => {

    var id = req.params.id;

    console.log('Este es el Id que llega para filtrar la catclisub: '+id);

    CatCliSub.find({ catclisub_subcategory: id })
        .populate('catclisub_category')
        .populate('catclisub_client', 'client_bussiness_name')
        .populate('catclisub_subcategory')
        .where()
        .exec((err, catsub2) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la subcategoria de catclisub',
                    errors: err
                });
            }

            if (!catsub2) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La subcategoria con el id ' + id + ' no existe en la relacion catclisub.',
                    errors: { message: 'No existe una subcategoria con ese ID en catclisub' }
                });
            }

            CatCliSub.countDocuments({ catclisub_subcategory: id }, (err, conteo) => {
                if (conteo > 0) {
                    res.json({
                        ok: true,
                        catclisub: catsub2,
                        total: conteo
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'La subcategoria con el id ' + id + ' no existe en la relacion catclisub.',
                        errors: { message: 'No existe una subcategoria con ese ID en catclisub' }
                    });
                }
                
            })
            
        });
});


// ===============================================
// Obtener por el cliente y la categoria
// ===============================================
app.get('/client/:id/category/:id2', auth.verifyToken, (req, res) => {

    var idClient = req.params.id;
    var idCategory = req.params.id2;

    CatCliSub.find({catclisub_client: idClient, catclisub_category: idCategory})
        .populate('catclisub_category')
        .populate('catclisub_client')
        .populate('catclisub_subcategory')
        .exec((err, catsub2) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la subcategoria de catclisub',
                    errors: err
                });
            }

            if (!catsub2) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La subcategoria con el id no existe en la relacion catclisub.',
                    errors: { message: 'No existe una subcategoria con ese ID en catclisub' }
                });
            }

            res.json({
                ok: true,
                catclisub: catsub2
            });
            
        });
});


// ================================
// ACTUALIZAR UNA CATEGORIA
// ================================
app.put('/catclisub/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['catclisub_category', 'catclisub_client', 'catclisub_subcategory'] );

	CatCliSub.findByIdAndUpdate( id, body, {new: true}, (err, nawcatcliDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!nawcatcliDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe esta relacion en la DB.',
                errors: { message: 'No existen registros con ese ID en catclisub' }
            });
        }

        res.json({
            ok: true,
            catclisub: nawcatcliDB,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UNA CATEGORIA
// ================================
app.delete('/catclisub/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    CatCliSub.findByIdAndRemove( id, (err, cateDeleted) => {
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
                    message: 'Relacion categoria-cliente-subcategoria no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            catclisub: cateDeleted
        });
    })

})



module.exports = app;