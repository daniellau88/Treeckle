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
        BookingRequestsManagement: {}
    });

    const organiser = new Permissions({
        role: constants.roles.Organiser,
        accountCreationRequest: {},
        accountsAll: {},
        accountsSelf: {},
        RoomsManagement: {},
        BookingRequestsManagement: {}
    });

    const resident = new Permissions({
        role: constants.roles.Resident,
        accountCreationRequest: {},
        accountsAll: {},
        accountsSelf: {},
        RoomsManagement: {},
        BookingRequestsManagement: {}
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
        admin.BookingRequestsManagement.set("update", true);
        admin.BookingRequestsManagement.set("delete", false);

        //Organiser configuration
        organiser.accountCreationRequest.set("create", true);
        organiser.accountCreationRequest.set("read", true);
        organiser.accountCreationRequest.set("update", true);
        organiser.accountCreationRequest.set("delete", true);

        organiser.accountsAll.set("create", false);
        organiser.accountsAll.set("read", true);
        organiser.accountsAll.set("update", true);
        organiser.accountsAll.set("delete", true);

        organiser.accountsSelf.set("create", false);
        organiser.accountsSelf.set("read", true);
        organiser.accountsSelf.set("update", true);
        organiser.accountsSelf.set("delete", false);

        organiser.RoomsManagement.set("create", true);
        organiser.RoomsManagement.set("read", true);
        organiser.RoomsManagement.set("update", true);
        organiser.RoomsManagement.set("delete", true);

        organiser.BookingRequestsManagement.set("create", true);
        organiser.BookingRequestsManagement.set("readAll", true);
        organiser.BookingRequestsManagement.set("read", true);
        organiser.BookingRequestsManagement.set("update", true);
        organiser.BookingRequestsManagement.set("delete", false);

        //Resident configuration
        resident.accountCreationRequest.set("create", true);
        resident.accountCreationRequest.set("read", true);
        resident.accountCreationRequest.set("update", true);
        resident.accountCreationRequest.set("delete", true);

        resident.accountsAll.set("create", false);
        resident.accountsAll.set("read", true);
        resident.accountsAll.set("update", true);
        resident.accountsAll.set("delete", true);

        resident.accountsSelf.set("create", false);
        resident.accountsSelf.set("read", true);
        resident.accountsSelf.set("update", true);
        resident.accountsSelf.set("delete", false);

        resident.RoomsManagement.set("create", true);
        resident.RoomsManagement.set("read", true);
        resident.RoomsManagement.set("update", true);
        resident.RoomsManagement.set("delete", true);

        resident.BookingRequestsManagement.set("create", true);
        resident.BookingRequestsManagement.set("readAll", true);
        resident.BookingRequestsManagement.set("read", true);
        resident.BookingRequestsManagement.set("update", true);
        resident.BookingRequestsManagement.set("delete", false);

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

module.exports = configurePermissions;