const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriesShema = new Schema({
    cat_name: {
        type: String,
        unique: true,
        uniqueCaseInsensitive: true,
        required: [true, 'El nombre es Obligatorio']
    },
    cat_description: {
        type: String,
        required: [true, 'Por favor introduzca una descripción de la categoría']
    },
    cat_img: {
        type: String
    },
    cat_support_subcategories: {
        type: Boolean,
        default: true,
        required: [true, 'Es necesario que deina si esta Categoria manejará subcategorias']
    },
    cat_created_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    cat_state: {
        type: Boolean,
        default: true
    }
});

categoriesShema.plugin(uniqueValidator, { message: '{PATH} debe de ser único, ya existe una categoria con nombre {VALUE} en la BD' });
module.exports = mongoose.model('Category', categoriesShema)