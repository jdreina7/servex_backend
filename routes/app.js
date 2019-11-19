const express = require('express')
var cors = require('cors');
const app = express()

// CORS
app.use( function( req, res, next ) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	next();
});


app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Rutas principal correcto!'
    });
})

module.exports = app;
