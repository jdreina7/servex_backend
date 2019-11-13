const express = require('express')
const fileUpload = require('express-fileupload');
//var cors = require('cors');

var Productos = require('../models/product_model');

var fs = require('fs');
const app = express()

// default options
//app.use(cors());
app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colecciones
    var coleccionesValidas = ['products'];
    if ( coleccionesValidas.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: "Tipo de coleccion no valida"
        });
    }

    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            message: "No se han seleccionado ningun comprimido para subir",
            err: "Not ZIP Files"
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.img;
    var nombre_cortado = archivo.name.split('.');
    var extension = nombre_cortado[nombre_cortado.length -1];

    // Unicas extensiones válidas
    var extensionesValidas = ['zip', 'ZIP'];

    if (extensionesValidas.indexOf(extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: "Extensión inválida",
            err: "Solo se permiten extenciones ZIP"
        });
    }

    // Nombre de img personalido
    var nombre_archivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    // Mover a un path temporal
    var path = `./server/files/products/${ nombre_archivo }`;

    archivo.mv( path, err => { 
        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: "ERROR AL MOVER EL ARCHIVO",
                errors: err
            });
        }

        uploadByType( id, nombre_archivo, res );

    });

    function uploadByType( id, nombreArchivo, res ) {
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

            console.log(product.prod_file);

            var pathViejo = './server/files/products/' + product.prod_file;

            // console.log('el path viejo es: ' + pathViejo+'espaciopegado');

            // Si existe una img anterior, la elimina
            if ( product.prod_file ) {
                if ( fs.existsSync( pathViejo ) ) {
                    fs.unlink( pathViejo, (err, eliminado) => {
                        if ( err ) {
                            return res.status(500).json({
                                ok: false,
                                message: "ERROR AL REEMPLAZAR EL ZIP YA EXISTENTE DEL PRODUCTO "+pathViejo,
                                errors: err
                            });
                        }
                    });
                    // console.log('PASO LA ACTUALIZACION DE LA IMG EXISTENTE DEL USUARIO');
                } else {
                    return res.status(500).json({
                        ok: false,
                        message: "EL ARCHIVO O RUTA A ACTUALIZAR NO EXISTE, POR FAVOR VERIFIQUELA "+pathViejo,
                        errors: err
                    });
                }

            }

            product.prod_file = nombreArchivo;

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
                    mensaje: 'Archivo ZIP actualizado correctamente en le producto!',
                    productUpdated
                });
            });

        })
    }

})

module.exports = app;
