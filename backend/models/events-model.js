const mongoose = require('mongoose');
const mongoTenant = require('mongo-tenant');
const schema = mongoose.Schema;

const eventSchema = new schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: false,
        unique: false
    },
    categories: {
        type: [String],
        required: false,
        unique: false
    },
    capacity: {
        type: Number,
        required: false,
        unique: false
    },
    organizedBy: {
        type: String,
        required: false,
        unique: false
    },
    createdBy: {
        type: schema.Types.ObjectId,
        required: false,
        unique: false
    },
    posterPath: {
        type: String,
        required: false,
        unique: true
    },
    venue: {
        type: String,
        required: false,
        unique: false
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: false,
        unique: false
    },
    eventDate: {
        type: Date,
        required: false,
        unique: false
    },
    signupsAllowed: {
        type: Boolean,
        required: false,
        unique: false
    },
    attendees: {
        type: [schema.Types.ObjectId],
        required: false,
        unique: false
    }
});

eventSchema.plugin(mongoTenant);
const Event = mongoose.model('event', eventSchema);
module.exports = Event;