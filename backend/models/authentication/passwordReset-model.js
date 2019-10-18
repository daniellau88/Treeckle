const mongoose = require('mongoose');
const schema = mongoose.Schema;

const passwordResetSchema = new schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: false
    },
    uniqueURIcomponent: {
        type: String,
        required: true,
        unique: true
    },
    expiry: {
        type: Date,
        required: true,
        unique: false
    }
});

const PasswordReset = mongoose.model('passwordReset', passwordResetSchema);
module.exports = PasswordReset;