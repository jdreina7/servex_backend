const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let subcategoriesShema = new Schema({
    subcat_name: {
        type: String,
        index: true,
        required: [true, 'El nombre es Obligatorio']
    },
    subcat_description: {
        type: String
    },
    subcat_img: {
        type: String
    },
    subcat_category: { 
        type: Schema.Types.ObjectId,
        ref: 'Category',
        index: true
    },
    subcat_client: { 
        type: Schema.Types.ObjectId,
        ref: 'Client',
        index: true
    },
    subcat_created_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    subcat_state: {
        type: Boolean,
        default: true
    }
});


subcategoriesShema.index({subcat_name: 1, subcat_category: -1, subcat_client: -1}, { unique: true });
// subcategoriesShema.plugin(uniqueValidator, { message: '{PATH} debe de ser único, ya existe una categoria con nombre {VALUE} en la BD' });
module.exports = mongoose.model('Subcategory', subcategoriesShema)