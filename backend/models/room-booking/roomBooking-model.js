const mongoose = require('mongoose');
const mongoTenant = require('mongo-tenant');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = mongoose.Schema;

const roomBookingSchema = new schema({
    roomId: {
        type: schema.Types.ObjectId,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: true,
        unique: false
    },
    createdBy: {
        type: schema.Types.ObjectId,
        required: true,
        unique: false
    },
    contactNumber: {
        type: Number,
        required: true,
        unique: false
    },
    expectedAttendees: {
        type: Number,
        required: true,
        unique: false
    },
    start: {
        type: Date,
        required: true,
        unique: false
    },
    end: {
        type: Date,
        required: true,
        unique: false,
        index: { expires: '1y' }
    },
    createdDate: {
        type: Date,
        required: true,
        unique: false,
        default: Date.now
    },
    comments: {
        type: [String],
        required: false,
        unique: false,
        default: []
    },
    approved: {
        type: Number,
        required: true,
        unique: false
    }
});

roomBookingSchema.plugin(mongoosePaginate);
roomBookingSchema.plugin(mongoTenant);
const RoomBooking = mongoose.model('roomBooking', roomBookingSchema);
module.exports = RoomBooking;