const mongoose = require('mongoose');
require('mongoose-type-email');
const passportLocalMongoose = require('passport-local-mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },    
    name: {
        type: String,
        required: true,
        unique: false
    },
    salt: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true,
        unique: true
    },
    permissionLevel: {
        type: Number,
        required: true,
        unique: false
    },
    participatedEventsIds: {
        type: [schema.Types.ObjectId],
        required: true,
        unique: false
    },
    subscribedCategories: {
        type: [String],
        required: true,
        unique: false
    },
    profilePicPath: {
        type: String,
        required: true,
        unique: false
    }
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('user', userSchema);
module.exports = User;