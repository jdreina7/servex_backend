const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ROLE_ADMIN', 'ROLE_SUPER', 'ROLE_CONSULT'],
    message: '{VALUE} no es un role permitido'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    usr_name: {
        type: String,
        required: [true, 'El nombre es Obligatorio']
    },
    usr_last_name: {
        type: String,
        required: [true, 'El Apellido es Obligatorio']
    },
    usr_email: {
        type: String,
        unique: true,
        required: [true, 'El correo es Obligatorio']
    },
    usr_password: {
        type: String,
        required: [true, 'El password es Obligatorio']
    },
    usr_img: {
        type: String
    },
    usr_role: {
        type: String,
        default: 'ROLE_CONSULT',
        enum: validRoles
    },
    usr_state: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function() {
    let usr = this;
    let usrObject = usr.toObject();
    delete usrObject.usr_password;

    return usrObject;
}
userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único, ya existe un email {VALUE} en la BD' });
module.exports = mongoose.model('User', userSchema)