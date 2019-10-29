const mongoose = require('mongoose');
const mongoTenant = require('mongo-tenant');
const schema = mongoose.Schema;

const roomSchema = new schema ({
    name: {
        type: String,
        required: true,
        unique: false
    },
    category: {
        type: String,
        required: true,
        unique: false
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
    },
    contactName: {
        type: String,
        required: false,
        unique: false
    },
    contactEmail: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: false
    },
    contactNumber: {
        type: Number,
        required: false,
        unique: false
    },
    checklist: {
        type: [String],
        required: false,
        unique: false,
        default: []
    },
    placeholderText: {
        type: String,
        required: false,
        unique: false,
        default: "Briefly describe the purpose of this booking ..."
    }
});

roomSchema.plugin(mongoTenant);
const Room = mongoose.model('room', roomSchema);
module.exports = Room;