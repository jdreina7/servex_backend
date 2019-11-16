
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');

const CatCli = require('../models/categoryClient_model')
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
    CatCli.find({ catcli_state: true })
        .populate('catcli_category', 'cat_name')
        .populate('catcli_client', 'client_bussiness_name')
        .skip(from)
        .limit(to)
        .exec( (err, catcli) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            CatCli.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    catcli,
                    total: conteo
                });
            })

        })
})

// ================================
// CREAR UNA CATEGORIA
// ================================
app.post('/catcli', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let myCatCli = new CatCli({
        catcli_category: body.catcli_category,
        catcli_client: body.catcli_client,
        catcli_created_by: body.catcli_created_by,
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
            catcli: catcliDB,
            usrLogin: req.userLogged
        });

    });

})

// ===============================================
// Obtener por la categoria
// ===============================================
app.get('/category/:id', auth.verifyToken, (req, res) => {

    var id = req.params.id;

    console.log('Este es el Id que llega para filtrar la catcli: '+id);

    CatCli.find({ catcli_category: id })
        .populate('catcli_category', 'cat_name')
        .populate('catcli_client', 'client_bussiness_name')
        .where()
        .exec((err, catcli) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la categoria de catcli',
                    errors: err
                });
            }

            if (!catcli) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La categoria con el id ' + id + ' no existe en la relacion catcli.',
                    errors: { message: 'No existe una categoria con ese ID en catcli' }
                });
            }

            CatCli.countDocuments({ catcli_category: id }, (err, conteo) => {
                if (conteo > 0) {
                    res.json({
                        ok: true,
                        catcli: catcli,
                        total: conteo
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'La categoria con el id ' + id + ' no existe en la relacion catcli.',
                        errors: { message: 'No existe una categoria con ese ID en catcli' }
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

    console.log('Este es el Id que llega para filtrar la catcli: '+id);

    CatCli.find({ catcli_client: id })
        .populate('catcli_category', 'cat_name')
        .populate('catcli_client', 'client_bussiness_name')
        .where()
        .exec((err, catcli2) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar el cliente de catcli',
                    errors: err
                });
            }

            if (!catcli2) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El cliente con el id ' + id + ' no existe en la relacion catcli.',
                    errors: { message: 'No existe un client con ese ID en catcli' }
                });
            }

            CatCli.countDocuments({ catcli_client: id }, (err, conteo) => {
                if (conteo > 0) {
                    res.json({
                        ok: true,
                        catcli: catcli2,
                        total: conteo
                    });
                } else {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El cliente con el id ' + id + ' no existe en la relacion catcli.',
                        errors: { message: 'No existe un client con ese ID en catcli' }
                    });
                }
                
            })
            
        });
});


// ================================
// ACTUALIZAR UNA CATEGORIA
// ================================
app.put('/catcli/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['catcli_category', 'catcli_client'] );

	CatCli.findByIdAndUpdate( id, body, {new: true}, (err, nawcatcliDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            catcli: nawcatcliDB,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UNA CATEGORIA
// ================================
app.delete('/catcli/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    CatCli.findByIdAndRemove( id, (err, cateDeleted) => {
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
                    message: 'Relacion categoria-cliente no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            catcli: cateDeleted
        });
    })

})



module.exports = app;