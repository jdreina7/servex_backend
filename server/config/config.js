// ===================
//  ENVIROMENT
// ===================
GLOBAL_ENV = process.env.NODE_ENV || 'dev';


// ===================
//  Obtener el puerto 
// ===================

ENV_PORT = process.env.PORT || 3002;

// ===================
//  Obtener el puerto 
// ===================

let urlDB;

if (GLOBAL_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/servex'
} else {
    urlDB = process.env.MONGO_URI
}

ENV_DB = urlDB;