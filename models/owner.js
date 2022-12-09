const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema ({
    owner_id: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean
    },
    owner_name: {
        type: String,
 
    },
    phone: {
        type: String,
 
    },
    facebook: {
        type: String,
 
    },
    viber: {
        type: String,
    
    },
    prefer_comm: {
        type: String,
    },
    owner_photo: {
        data: [Buffer],
        contentType: String
    }
});

const Owner = mongoose.model('owner', ownerSchema);
module.exports = Owner;