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
       accountsAll: {
           type: Map,
           of: Boolean
       },
       accountsSelf: {
           type: Map,
           of: Boolean
       },
       RoomsManagement: {
           type: Map,
           of: Boolean
       },
       BookingRequestsManagement: {
           type: Map,
           of: Boolean
       },
       emailReceiptsConfig: {
           type: Map,
           of: Boolean
       }
});

const Permissions = mongoose.model('permissions', permissionSchema);

const configurePermissions = async () => {
    const admin = new Permissions({
        role: constants.roles.Admin,
        accountCreationRequest: {},
        accountsAll: {},
        accountsSelf: {},
        RoomsManagement: {},
        BookingRequestsManagement: {},
        emailReceiptsConfig: {}
    });

    const organiser = new Permissions({
        role: constants.roles.Organiser,
        accountCreationRequest: {},
        accountsAll: {},
        accountsSelf: {},
        RoomsManagement: {},
        BookingRequestsManagement: {},
        emailReceiptsConfig: {}
    });

    const resident = new Permissions({
        role: constants.roles.Resident,
        accountCreationRequest: {},
        accountsAll: {},
        accountsSelf: {},
        RoomsManagement: {},
        BookingRequestsManagement: {},
        emailReceiptsConfig: {}
    });

    try {
        //Admin configuration
        admin.accountCreationRequest.set("create", true);
        admin.accountCreationRequest.set("read", true);
        admin.accountCreationRequest.set("update", true);
        admin.accountCreationRequest.set("delete", true);

        admin.accountsAll.set("create", false);
        admin.accountsAll.set("read", true);
        admin.accountsAll.set("update", true);
        admin.accountsAll.set("delete", true);

        admin.accountsSelf.set("create", false);
        admin.accountsSelf.set("read", true);
        admin.accountsSelf.set("update", true);
        admin.accountsSelf.set("delete", false);

        admin.RoomsManagement.set("create", true);
        admin.RoomsManagement.set("read", true);
        admin.RoomsManagement.set("update", true);
        admin.RoomsManagement.set("delete", true);

        admin.BookingRequestsManagement.set("create", true);
        admin.BookingRequestsManagement.set("readAll", true);
        admin.BookingRequestsManagement.set("read", true);
        admin.BookingRequestsManagement.set("cancelSelf", true);
        admin.BookingRequestsManagement.set("update", true);
        admin.BookingRequestsManagement.set("delete", false);

        admin.emailReceiptsConfig.set("create", true);
        admin.emailReceiptsConfig.set("read", true);
        admin.emailReceiptsConfig.set("update", true);
        admin.emailReceiptsConfig.set("delete", false);

        //Organiser configuration
        organiser.accountCreationRequest.set("create", false);
        organiser.accountCreationRequest.set("read", false);
        organiser.accountCreationRequest.set("update", false);
        organiser.accountCreationRequest.set("delete", false);

        organiser.accountsAll.set("create", false);
        organiser.accountsAll.set("read", false);
        organiser.accountsAll.set("update", false);
        organiser.accountsAll.set("delete", false);

        organiser.accountsSelf.set("create", false);
        organiser.accountsSelf.set("read", true);
        organiser.accountsSelf.set("update", true);
        organiser.accountsSelf.set("delete", false);

        organiser.RoomsManagement.set("create", false);
        organiser.RoomsManagement.set("read", true);
        organiser.RoomsManagement.set("update", false);
        organiser.RoomsManagement.set("delete", false);

        organiser.BookingRequestsManagement.set("create", true);
        organiser.BookingRequestsManagement.set("readAll", false);
        organiser.BookingRequestsManagement.set("read", true);
        organiser.BookingRequestsManagement.set("cancelSelf", true);
        organiser.BookingRequestsManagement.set("update", false);
        organiser.BookingRequestsManagement.set("delete", false);

        organiser.emailReceiptsConfig.set("create", false);
        organiser.emailReceiptsConfig.set("read", false);
        organiser.emailReceiptsConfig.set("update", false);
        organiser.emailReceiptsConfig.set("delete", false);

        //Resident configuration
        resident.accountCreationRequest.set("create", false);
        resident.accountCreationRequest.set("read", false);
        resident.accountCreationRequest.set("update", false);
        resident.accountCreationRequest.set("delete", false);

        resident.accountsAll.set("create", false);
        resident.accountsAll.set("read", false);
        resident.accountsAll.set("update", true);
        resident.accountsAll.set("delete", true);

        resident.accountsSelf.set("create", false);
        resident.accountsSelf.set("read", true);
        resident.accountsSelf.set("update", true);
        resident.accountsSelf.set("delete", false);

        resident.RoomsManagement.set("create", false);
        resident.RoomsManagement.set("read", true);
        resident.RoomsManagement.set("update", false);
        resident.RoomsManagement.set("delete", false);

        resident.BookingRequestsManagement.set("create", true);
        resident.BookingRequestsManagement.set("readAll", false);
        resident.BookingRequestsManagement.set("read", true);
        resident.BookingRequestsManagement.set("cancelSelf", true);
        resident.BookingRequestsManagement.set("update", false);
        resident.BookingRequestsManagement.set("delete", false);

        resident.emailReceiptsConfig.set("create", false);
        resident.emailReceiptsConfig.set("read", false);
        resident.emailReceiptsConfig.set("update", false);
        resident.emailReceiptsConfig.set("delete", false);

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