require(__dirname + '/config/config');
var path = require('path');
var cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

// CORS
// app.use( function( req, res, next ) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Credentials", true);
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
// 	next();
// });

app.use(cors());


__dirname = path.resolve(path.dirname(''));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.use(express.static(__dirname + '/server/files/products')); local
app.use(express.static(__dirname + '/files/products'));
app.use(express.static(__dirname + '/uploads'));


// Importar rutas
var appRoutes = require(__dirname + '/routes/app');
var appLogin = require(__dirname + '/routes/login');
var appUsers = require(__dirname + '/routes/users');
var appClients = require(__dirname + '/routes/clients');
var appCategories = require(__dirname + '/routes/categories');
var appCatCli = require(__dirname + '/routes/categoryClient');
var appCatCliSub = require(__dirname + '/routes/categoryClientSubcategory');
var appSubcategories = require(__dirname + '/routes/subcategories');
var appProducts = require(__dirname + '/routes/products');
var appSearch = require(__dirname + '/routes/search');
var appUploads = require(__dirname + '/routes/upload');
var appFiles = require(__dirname + '/routes/files');
var appFile = require(__dirname + '/routes/file');
var appimages = require(__dirname + '/routes/images');

// Routes
app.use( '/login', appLogin );
app.use( '/users', appUsers );
app.use( '/clients', appClients );
app.use( '/categories', appCategories );
app.use( '/catcli', appCatCli );
app.use( '/catclisub', appCatCliSub );
app.use( '/subcategories', appSubcategories );
app.use( '/products', appProducts );
app.use( '/search', appSearch );
app.use( '/uploads', appUploads );
app.use( '/files', appFiles );
app.use( '/file', appFile );
app.use( '/images', appimages );


app.use('/', appRoutes );

mongoose.connection.openUri(process.env.ENV_DB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

// mongoose.connect(ENV_DB,{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {

	if (err) throw err;

	console.log("DB Online!");
});

app.listen(process.env.PORT, () => {
	console.log(`Server runing in ${process.env.PORT} port`);
});