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
    residence: {
        type: String,
        required: true,
        unique: false
    },
    role: {
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
    participatedEventsIds: [{
        type: schema.Types.ObjectId,
        ref: 'event'
    }],
    subscribedCategories: {
        type: [String],
        required: false,
        unique: false
    },
    profilePic: {
        type: Buffer,
        required: true,
        unique: false,
        index: false
    }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email', session: false });
const User = mongoose.model('user', userSchema);
module.exports = User;