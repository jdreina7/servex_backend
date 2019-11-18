require('./config/config');
var cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
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



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas
var appRoutes = require('./routes/app');
var appLogin = require('./routes/login');
var appUsers = require('./routes/users');
var appClients = require('./routes/clients');
var appCategories = require('./routes/categories');
var appCatCli = require('./routes/categoryClient');
var appCatCliSub = require('./routes/categoryClientSubcategory');
var appSubcategories = require('./routes/subcategories');
var appProducts = require('./routes/products');
var appSearch = require('./routes/search');
var appUploads = require('./routes/upload');
var appFiles = require('./routes/files');
var appimages = require('./routes/images');

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
app.use( '/images', appimages );

app.use('/', appRoutes );


mongoose.connect(ENV_DB,{ useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

	if (err) throw err;

	console.log("DB Online!");
});

app.listen(ENV_PORT, () => {
	console.log(`Server runing in ${ENV_PORT} port`);
});