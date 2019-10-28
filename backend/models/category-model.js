const mongoose = require('mongoose');
const mongoTenant = require('mongo-tenant');
const schema = mongoose.Schema;

const categorySchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    upcomingEventCount: {
        type: Number,
        required: true,
        unique: false
    },
    subscribers: [{
        type: schema.Types.ObjectId,
        ref: 'user'
    }],
});

categorySchema.plugin(mongoTenant);
const Category = mongoose.model('category', categorySchema);
module.exports = Category;