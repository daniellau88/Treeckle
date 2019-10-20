const mongoose = require('mongoose');
const mongoTenant = require('mongo-tenant');
const schema = mongoose.Schema;

const announcementSchema = new schema({
    creationDate: {
        type: Date,
        default: Date.now,
        required: true,
        unique: false
    },
    title: {
        type: String,
        required: true,
        unique: false
    },
    body: {
        type: String,
        required: true,
        unique: false
    },
    createdBy: {
        type: schema.Types.ObjectId,
        required: true,
        unique: false
    },
    expireAt: {
        type: Date,
        default: () => Date.now() + (3 * 24 * 60 * 60 * 1000),
        required: true,
        unique: false
    }
});

announcementSchema.index({ expireAt: 1}, { expireAfterSeconds: 0 });
announcementSchema.plugin(mongoTenant);
const Announcement = mongoose.model('announcement', announcementSchema);
module.exports = Announcement;