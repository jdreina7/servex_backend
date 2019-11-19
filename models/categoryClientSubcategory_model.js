const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let categoryClientSubcategoryShema = new Schema({
    
    catclisub_category: { 
        type: Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
        required: [true, 'Es necesario que ingrese la categoria']
    },
    catclisub_client: { 
        type: Schema.Types.ObjectId,
        ref: 'Client',
        index: true,
        required: [true, 'Es necesario que ingrese la cliente']
    },
    catclisub_subcategory: { 
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
        index: true,
        required: [true, 'Es necesario que ingrese la subcategoria']
    },
    catclisub_created_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    catclisub_state: {
        type: Boolean,
        default: true
    }
});


categoryClientSubcategoryShema.index({catclisub_category: 1, catclisub_client: -1, catclisub_subcategory: -1}, { unique: true });
// subcategoriesShema.plugin(uniqueValidator, { message: '{PATH} debe de ser único, ya existe una categoria con nombre {VALUE} en la BD' });
module.exports = mongoose.model('CategoryClientSubcategory', categoryClientSubcategoryShema)