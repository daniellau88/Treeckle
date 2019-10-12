const mongoose = require('mongoose');
const schema = mongoose.Schema;

const roomBookingSchema = new schema({
    roomId: {
        type: schema.Types.ObjectId,
        required: true,
        unique: true 
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
    startDate: {
        type: Date,
        required: true,
        unique: false
    },
    endDate: {
        type: Date,
        required: true,
        unique: false
    },
    approved: {
        type: Boolean,
        required: true,
        unique: false
    }
});

const RoomBooking = mongoose.model('roomBooking', roomBookingSchema);
module.exports = RoomBooking;