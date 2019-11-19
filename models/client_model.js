const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let clientSchema = new Schema({
    client_name: {
        type: String
    },
    client_last_name: {
        type: String
    },
    client_bussiness_name: {
        type: String,
        unique: true,
        required: [true, 'La razon social es Obligatoria']
    },
    client_description: {
        type: String
    },
    client_email: {
        type: String,
    },
    client_logo: {
        type: String
    },
    client_state: {
        type: Boolean,
        default: true
    }
});

clientSchema.methods.toJSON = function() {
    let client = this;
    let clientObject = client.toObject();
    delete clientObject.client_password;

    return clientObject;
}
clientSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único, ya existe un registro de {VALUE} en la BD' });
module.exports = mongoose.model('Client', clientSchema)