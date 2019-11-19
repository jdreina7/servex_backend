// ===================
//  ENVIROMENT
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ===================
//  Obtener el puerto 
// ===================

process.env.PORT = process.env.PORT || 3002;

// ===================
//  Obtener el puerto 
// ===================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/servex'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.ENV_DB = urlDB;