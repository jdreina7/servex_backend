const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    prod_name: {
        type: String,
        required: [true, 'El nombre es Obligatorio']
    },
    prod_description: {
        type: String,
        required: [true, 'Por favor introduzca una descripción del producto']
    },
    prod_img: {
        type: String
    },
    prod_file: {
        type: String
    },
    prod_client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        index: true,
        required: [true, 'El cliente es obligatorio']
    },
    prod_category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
        required: [true, 'La categoria es obligatoria']
    },
    prod_subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
        index: true
    },
    prod_created_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    prod_state: {
        type: Boolean,
        default: true
    }
});

productSchema.index({prod_name: 1, prod_client: -1, prod_category: -1, prod_subcategory: -1}, { unique: true });
module.exports = mongoose.model('Product', productSchema)