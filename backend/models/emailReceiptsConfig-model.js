const mongoose = require('mongoose');
const mongoTenant = require('mongo-tenant');
const schema = mongoose.Schema;

const emailReceiptsConfigSchema = new schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        required: false,
        unique: false
    }  
})

emailReceiptsConfigSchema.plugin(mongoTenant);
const EmailReceiptsConfig = mongoose.model('emailReceiptsConfig', emailReceiptsConfigSchema);
module.exports = EmailReceiptsConfig;