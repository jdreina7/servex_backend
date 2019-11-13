const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')

app.get('/:tipo/:imgs', (req, res) => {

    var tipo = req.params.tipo;
    var imgs = req.params.imgs;

    var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
    var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${imgs}`);


    if ( fs.existsSync( pathImage ) ) {
        res.sendFile(pathImage);
    } else {
        res.sendFile(pathNoImage);
    }
})

module.exports = app;
