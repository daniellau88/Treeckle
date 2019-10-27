const mongoose = require('mongoose');
const schema = mongoose.Schema;
const constants = require('../../config/constants');

const permissionSchema = new schema({
        role: {
            type: String,
            required: true,
            unique: true
        },
       accountCreationRequest: {
           type: Map,
           of: Boolean
       },
       accounts: {
           type: Map,
           of: Boolean
       },
       roomsManagement: {
           type: Map,
           of: Boolean
       },
       bookingRequestsManagement: {
           type: Map,
           of: Boolean
       },
       emailReceiptsConfig: {
           type: Map,
           of: Boolean
       },
       eventInstances: {
           type: Map,
           of: Boolean
       },
       eventEngagement: {
           type: Map,
           of: Boolean
       }
});

const Permissions = mongoose.model('permissions', permissionSchema);

const configurePermissions = async () => {
    const admin = new Permissions({
        role: constants.roles.Admin,
        accountCreationRequest: {},
        accounts: {},
        roomsManagement: {},
        bookingRequestsManagement: {},
        emailReceiptsConfig: {},
        eventInstances: {},
        eventEngagement: {}
    });

    const organiser = new Permissions({
        role: constants.roles.Organiser,
        accountCreationRequest: {},
        accounts: {},
        roomsManagement: {},
        bookingRequestsManagement: {},
        emailReceiptsConfig: {},
        eventInstances: {},
        eventEngagement: {}
    });

    const resident = new Permissions({
        role: constants.roles.Resident,
        accountCreationRequest: {},
        accounts: {},
        roomsManagement: {},
        bookingRequestsManagement: {},
        emailReceiptsConfig: {},
        eventInstances: {},
        eventEngagement: {}
    });

    try {
        //Admin configuration
        admin.accountCreationRequest.set("create", true);
        admin.accountCreationRequest.set("read", true);
        admin.accountCreationRequest.set("update", true);
        admin.accountCreationRequest.set("delete", true);

        admin.accounts.set("create", false);
        admin.accounts.set("readSelf", true);
        admin.accounts.set("read", true);
        admin.accounts.set("update", true);
        admin.accounts.set("updateSelf", true);
        admin.accounts.set("delete", true);

        admin.roomsManagement.set("create", true);
        admin.roomsManagement.set("read", true);
        admin.roomsManagement.set("update", true);
        admin.roomsManagement.set("delete", true);

        admin.bookingRequestsManagement.set("create", true);
        admin.bookingRequestsManagement.set("read", true);
        admin.bookingRequestsManagement.set("readSelf", true);
        admin.bookingRequestsManagement.set("updateSelf", true);
        admin.bookingRequestsManagement.set("update", true);
        admin.bookingRequestsManagement.set("delete", true);

        admin.emailReceiptsConfig.set("create", true);
        admin.emailReceiptsConfig.set("read", true);
        admin.emailReceiptsConfig.set("update", true);
        admin.emailReceiptsConfig.set("delete", false);

        admin.eventInstances.set("create", true);
        admin.eventInstances.set("readSelf", true);
        admin.eventInstances.set("read", true);
        admin.eventInstances.set("updateSelf", true);
        admin.eventInstances.set("update", true);
        admin.eventInstances.set("deleteSelf", true);
        admin.eventInstances.set("delete", true);

        admin.eventEngagement.set("create", true);
        admin.eventEngagement.set("read", true);
        admin.eventEngagement.set("update", true);
        admin.eventEngagement.set("delete", false);

        //Organiser configuration
        organiser.accountCreationRequest.set("create", false);
        organiser.accountCreationRequest.set("read", false);
        organiser.accountCreationRequest.set("update", false);
        organiser.accountCreationRequest.set("delete", false);

        organiser.accounts.set("create", false);
        organiser.accounts.set("readSelf", true);
        organiser.accounts.set("read", false);
        organiser.accounts.set("update", false);
        organiser.accounts.set("updateSelf", true);
        organiser.accounts.set("delete", false);

        organiser.roomsManagement.set("create", false);
        organiser.roomsManagement.set("read", true);
        organiser.roomsManagement.set("update", false);
        organiser.roomsManagement.set("delete", false);

        organiser.bookingRequestsManagement.set("create", true);
        organiser.bookingRequestsManagement.set("read", false);
        organiser.bookingRequestsManagement.set("readSelf", true);
        organiser.bookingRequestsManagement.set("updateSelf", true);
        organiser.bookingRequestsManagement.set("update", false);
        organiser.bookingRequestsManagement.set("delete", false);

        organiser.emailReceiptsConfig.set("create", false);
        organiser.emailReceiptsConfig.set("read", false);
        organiser.emailReceiptsConfig.set("update", false);
        organiser.emailReceiptsConfig.set("delete", false);

        organiser.eventInstances.set("create", true);
        organiser.eventInstances.set("readSelf", true);
        organiser.eventInstances.set("read", false);
        organiser.eventInstances.set("updateSelf", true);
        organiser.eventInstances.set("update", false);
        organiser.eventInstances.set("deleteSelf", true);
        organiser.eventInstances.set("delete", false);

        organiser.eventEngagement.set("create", false);
        organiser.eventEngagement.set("read", true);
        organiser.eventEngagement.set("update", true);
        organiser.eventEngagement.set("delete", false);

        //Resident configuration
        resident.accountCreationRequest.set("create", false);
        resident.accountCreationRequest.set("read", false);
        resident.accountCreationRequest.set("update", false);
        resident.accountCreationRequest.set("delete", false);

        resident.accounts.set("create", false);
        resident.accounts.set("readSelf", true);
        resident.accounts.set("read", false);
        resident.accounts.set("update", false);
        resident.accounts.set("updateSelf", true);
        resident.accounts.set("delete", false);

        resident.roomsManagement.set("create", false);
        resident.roomsManagement.set("read", true);
        resident.roomsManagement.set("update", false);
        resident.roomsManagement.set("delete", false);

        resident.bookingRequestsManagement.set("create", true);
        resident.bookingRequestsManagement.set("read", false);
        resident.bookingRequestsManagement.set("readSelf", true);
        resident.bookingRequestsManagement.set("updateSelf", true);
        resident.bookingRequestsManagement.set("update", false);
        resident.bookingRequestsManagement.set("delete", false);

        resident.emailReceiptsConfig.set("create", false);
        resident.emailReceiptsConfig.set("read", false);
        resident.emailReceiptsConfig.set("update", false);
        resident.emailReceiptsConfig.set("delete", false);

        resident.eventInstances.set("create", false);
        resident.eventInstances.set("readSelf", false);
        resident.eventInstances.set("read", false);
        resident.eventInstances.set("updateSelf", false);
        resident.eventInstances.set("update", false);
        resident.eventInstances.set("deleteSelf", false);
        resident.eventInstances.set("delete", false);

        resident.eventEngagement.set("create", false);
        resident.eventEngagement.set("read", true);
        resident.eventEngagement.set("update", true);
        resident.eventEngagement.set("delete", false);

        await admin.save();
        await organiser.save();
        await resident.save();
        console.log("Permissions updated.");
    } catch (error) {
        await Permissions.deleteMany();
        await admin.save();
        await organiser.save();
        await resident.save();
        console.log("Permissions loaded.");
    }
}

module.exports = { configurePermissions, Permissions } ;