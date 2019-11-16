const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let categoryClientShema = new Schema({
    
    catcli_category: { 
        type: Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
        required: [true, 'Es necesario que ingrese la categoria']
    },
    catcli_client: { 
        type: Schema.Types.ObjectId,
        ref: 'Client',
        index: true
    },
    catcli_created_by: { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    catcli_state: {
        type: Boolean,
        default: true
    }
});


categoryClientShema.index({catcli_category: 1, catcli_client: -1}, { unique: true });
// subcategoriesShema.plugin(uniqueValidator, { message: '{PATH} debe de ser único, ya existe una categoria con nombre {VALUE} en la BD' });
module.exports = mongoose.model('CategoryClient', categoryClientShema)