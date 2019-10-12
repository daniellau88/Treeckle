const mongoose = require('mongoose');
const schema = mongoose.Schema;

const roomSchema = {
    name: {
        type: String,
        required: true,
        unique: true
    },
    recommendedCapacity: {
        type: Number,
        required: true,
        unique: false
    },
    createdBy: {
        type: schema.Types.ObjectId,
        required: true,
        unique: false
    }
};

const Room = mongoose.model('room', roomSchema);
module.exports = Room;