const express = require('express')
const fileUpload = require('express-fileupload');
//var cors = require('cors');
var Usuario = require('../models/user_model');
var Cliente = require('../models/client_model');
var Categoria = require('../models/category_model');
var Subcategoria = require('../models/subcategory_model');
var Productos = require('../models/product_model');
var path 	= require('path');

var fs = require('fs');
const app = express()

// default options
//app.use(cors());
app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colecciones
    var coleccionesValidas = ['categories', 'users', 'clients', 'products', 'subcategories'];
    if ( coleccionesValidas.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: "Tipo de coleccion no valida"
        });
    }

    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            message: "No se han seleccionado imagenes para subir",
            err: "Not Images"
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.img;
    var nombre_cortado = archivo.name.split('.');
    var extension = nombre_cortado[nombre_cortado.length -1];

    // Unicas extensiones válidas
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'JPG', 'PNG', 'JPEG'];

    if (extensionesValidas.indexOf(extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: "Extensión inválida",
            err: "Solo se permiten extenciones PNG, JPG o JPEG"
        });
    }

    // Nombre de img personalido
    var nombre_archivo = `${ tipo }-${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Mover a un path temporal
    // var path = `./server/server/server/uploads/${ tipo }/${ nombre_archivo }`;
    var path = __dirname + `./uploads/${ tipo }/${ nombre_archivo }`;

    console.log('EL dirname Juan: ' + __dirname);
    console.log('EL path Juan: ' + path);

    archivo.mv( path, err => { 
        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: "ERROR AL MOVER EL ARCHIVO",
                errors: err
            });
        }

        uploadByType( tipo, id, nombre_archivo, res );

    });

    function uploadByType( tipo, id, nombreArchivo, res ) {
        if ( tipo === 'users') {
            Usuario.findById(id, (err, user) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR EN EL SERVIDOR "+id,
                        errors: err
                    });
                }

                if (user === null) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO AL USUARIO "+id,
                        errors: "No existe el id "+ id +" o está errado: " + err
                    });
                }

                console.log(user.usr_img);

                // var pathViejo = './server./uploads/users/' + user.usr_img; =========OJO DESCOMENTAR ESTA LINEA PARA LOCAL
                var pathViejo = __dirname + './uploads/users/' + user.usr_img;

                // console.log('el path viejo es: ' + pathViejo+'espaciopegado');

                // Si existe una img anterior, la elimina
                if ( user.usr_img ) {
                    if ( fs.existsSync( pathViejo ) ) {
                        fs.unlink( pathViejo, (err, eliminado) => {
                            if ( err ) {
                                return res.status(500).json({
                                    ok: false,
                                    message: "ERROR AL REEMPLAZAR LA IMG YA EXISTENTE DEL USUARIO "+pathViejo,
                                    errors: err
                                });
                            }
                        });
                        // console.log('PASO LA ACTUALIZACION DE LA IMG EXISTENTE DEL USUARIO');
                    } else {
                        return res.status(500).json({
                            ok: false,
                            message: "LA IMG O RUTA A ACTUALIZAR NO EXISTE, POR FAVOR VERIFIQUELA "+pathViejo,
                            errors: err
                        });
                    }

                }

                user.usr_img = nombreArchivo;

                user.save( (err, userUpdated ) => {

                    try {
                        if ( err ) {
                            return res.status(500).json({
                                ok: false,
                                message: "ERROR AL INTENTAR ACTUALIZAR LA IMG DEL USUARIO "+user.usr_name,
                                errors: err
                            });
                        } else {
                            return res.status(200).json({
                                ok: true,
                                mensaje: 'Imagen de usuario actualizada correctamente',
                                userUpdated
                            });
                        }
                    } catch (error) {
                        return res.status(500).json({
                            ok: false,
                            message: "GUARDANDO - ERROR EN EL SERVIDOR "+user.usr_name,
                            errors: error
                        });
                    }

                });

            })
        }

        if ( tipo === 'clients') {
            Cliente.findById(id, (err, client) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR EN EL SERVIDOR "+id,
                        errors: err
                    });
                }

                if (client === null) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO AL CLIENTE "+id,
                        errors: "No existe el id "+ id +" o está errado: " + err
                    });
                }

                console.log(client.client_logo);

                // var pathViejo = './server./uploads/clients/' + client.client_logo;
                var pathViejo = '/uploads/clients/' + client.client_logo;

                // console.log('el path viejo es: ' + pathViejo+'espaciopegado');

                // Si existe una img anterior, la elimina
                if ( client.client_logo ) {
                    if ( fs.existsSync( pathViejo ) ) {
                        fs.unlink( pathViejo, (err, eliminado) => {
                            if ( err ) {
                                return res.status(500).json({
                                    ok: false,
                                    message: "ERROR AL REEMPLAZAR LA IMG YA EXISTENTE DEL USUARIO "+pathViejo,
                                    errors: err
                                });
                            }
                        });
                        // console.log('PASO LA ACTUALIZACION DE LA IMG EXISTENTE DEL USUARIO');
                    } else {
                        return res.status(500).json({
                            ok: false,
                            message: "LA IMG O RUTA A ACTUALIZAR NO EXISTE, POR FAVOR VERIFIQUELA "+pathViejo,
                            errors: err
                        });
                    }

                }

                client.client_logo = nombreArchivo;

                client.save( (err, clientUpdated ) => {

                    try {
                        if ( err ) {
                            return res.status(500).json({
                                ok: false,
                                message: "ERROR AL INTENTAR ACTUALIZAR LA IMG DEL CLIENTE "+client.client_name,
                                errors: err
                            });
                        } else {
                            return res.status(200).json({
                                ok: true,
                                mensaje: 'Imagen de cliente actualizada correctamente',
                                clientUpdated
                            });
                        }
                    } catch (error) {
                        return res.status(500).json({
                            ok: false,
                            message: "GUARDANDO - ERROR EN EL SERVIDOR "+client.client_name,
                            errors: error
                        });
                    }

                });

            })
        }

        if ( tipo === 'categories') {
            Categoria.findById(id, (err, category) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO LA CATEGORIA "+id,
                        errors: err
                    });
                }

                if (category === null) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO LA CATEGORIA "+id,
                        errors: "No existe el id "+ id +" o está errado: " + err
                    });
                }

                console.log(category.cat_img);

                // var pathViejo = './server./uploads/categories/' + category.cat_img;
                var pathViejo = './uploads/categories/' + category.cat_img;

                // console.log('el path viejo es: ' + pathViejo+'espaciopegado');

                // Si existe una img anterior, la elimina
                if ( category.cat_img ) {
                    if ( fs.existsSync( pathViejo ) ) {
                        fs.unlink( pathViejo, (err, eliminado) => {
                            if ( err ) {
                                return res.status(500).json({
                                    ok: false,
                                    message: "ERROR AL REEMPLAZAR LA IMG YA EXISTENTE DE LA CATEGORIA "+pathViejo,
                                    errors: err
                                });
                            }
                        });
                        // console.log('PASO LA ACTUALIZACION DE LA IMG EXISTENTE DEL USUARIO');
                    } else {
                        return res.status(500).json({
                            ok: false,
                            message: "LA IMG O RUTA A ACTUALIZAR NO EXISTE, POR FAVOR VERIFIQUELA "+pathViejo,
                            errors: err
                        });
                    }

                }

                category.cat_img = nombreArchivo;

                category.save( (err, categoryUpdated ) => {

                    if ( err ) {
                        return res.status(500).json({
                            ok: false,
                            message: "ERROR AL INTENTAR ACTUALIZAR LAS IMGS DE LA ENTRADA "+category.cat_name,
                            errors: err
                        });
                    }
                    
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagenes de entrada actualizadas correctamente',
                        categoryUpdated
                    });
                });

            })
            
        }

        if ( tipo === 'subcategories') {
            Subcategoria.findById(id, (err, subcategory) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO LA SUBCATEGORIA "+id,
                        errors: err
                    });
                }

                if (subcategory === null) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO LA SUBCATEGORIA "+id,
                        errors: "No existe el id "+ id +" o está errado: " + err
                    });
                }

                console.log(subcategory.subcat_img);

                // var pathViejo = './server./uploads/subcategories/' + subcategory.subcat_img;
                var pathViejo = './uploads/subcategories/' + subcategory.subcat_img;

                // console.log('el path viejo es: ' + pathViejo+'espaciopegado');

                // Si existe una img anterior, la elimina
                if ( subcategory.subcat_img ) {
                    if ( fs.existsSync( pathViejo ) ) {
                        fs.unlink( pathViejo, (err, eliminado) => {
                            if ( err ) {
                                return res.status(500).json({
                                    ok: false,
                                    message: "ERROR AL REEMPLAZAR LA IMG YA EXISTENTE DE LA SUBCATEGORIA "+pathViejo,
                                    errors: err
                                });
                            }
                        });
                        // console.log('PASO LA ACTUALIZACION DE LA IMG EXISTENTE DEL USUARIO');
                    } else {
                        return res.status(500).json({
                            ok: false,
                            message: "LA IMG O RUTA A ACTUALIZAR NO EXISTE, POR FAVOR VERIFIQUELA "+pathViejo,
                            errors: err
                        });
                    }

                }

                subcategory.subcat_img = nombreArchivo;

                subcategory.save( (err, subcategoryUpdated ) => {

                    if ( err ) {
                        return res.status(500).json({
                            ok: false,
                            message: "ERROR AL INTENTAR ACTUALIZAR LAS IMGS DE LA ENTRADA "+subcategory.subcat_name,
                            errors: err
                        });
                    }
                    
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagenes de entrada actualizadas correctamente',
                        subcategoryUpdated
                    });
                });

            })
            
        }

        if ( tipo === 'products') {
            Productos.findById(id, (err, product) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO EL PRODUCTO "+id,
                        errors: err
                    });
                }

                if (product === null) {
                    return res.status(500).json({
                        ok: false,
                        message: "ERROR BUSCANDO EL PRODUCTO "+id,
                        errors: "No existe el id "+ id +" o está errado: " + err
                    });
                }

                console.log(product.prod_img);

                // var pathViejo = './server./uploads/products/' + product.prod_img;
                var pathViejo = './uploads/products/' + product.prod_img;

                // console.log('el path viejo es: ' + pathViejo+'espaciopegado');

                // Si existe una img anterior, la elimina
                if ( product.prod_img ) {
                    if ( fs.existsSync( pathViejo ) ) {
                        fs.unlink( pathViejo, (err, eliminado) => {
                            if ( err ) {
                                return res.status(500).json({
                                    ok: false,
                                    message: "ERROR AL REEMPLAZAR LA IMG YA EXISTENTE DE LA SUBCATEGORIA "+pathViejo,
                                    errors: err
                                });
                            }
                        });
                        // console.log('PASO LA ACTUALIZACION DE LA IMG EXISTENTE DEL USUARIO');
                    } else {
                        return res.status(500).json({
                            ok: false,
                            message: "LA IMG O RUTA A ACTUALIZAR NO EXISTE, POR FAVOR VERIFIQUELA "+pathViejo,
                            errors: err
                        });
                    }

                }

                product.prod_img = nombreArchivo;

                product.save( (err, productUpdated ) => {

                    if ( err ) {
                        return res.status(500).json({
                            ok: false,
                            message: "ERROR AL INTENTAR ACTUALIZAR LAS IMGS DE LA ENTRADA "+product.prod_name,
                            errors: err
                        });
                    }
                    
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagenes de entrada actualizadas correctamente',
                        productUpdated
                    });
                });

            })
            
        }
    }

})

module.exports = app;
