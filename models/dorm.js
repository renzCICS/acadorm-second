const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dormSchema = new Schema ({
    dorm_id: {
        type: Number,
        required: true
    },
    owner_id: {
        type: Number,
        required: true
    },
    dorm_name: {
        type: String,
        required: true
    },
    uni: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sharing: {
        type: Number,
        required: true
    },
    bedroom: {
        type: Number,
        required: true
    },
    bath: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    dorm_photos: {
        data: [Buffer],
        contentType: String
        // required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Dorm = mongoose.model('dorm', dormSchema);
module.exports = Dorm;