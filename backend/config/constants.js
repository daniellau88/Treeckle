module.exports = {
    approvalStates: {
        pending: 0,
        approved: 1,
        rejected: 2
    },
    //baseURI: "https://www.treeckle.com",
    baseURI: "http://localhost:3000",
    resetURI: "auth/resetAttempt",
    createURI: "auth/newAccounts",
    roles: {
        Resident: "Resident",
        Organiser: "Organiser",
        Admin: "Admin"
    },
    categories: {
        accountCreationRequest: "accountCreationRequest",
        accountsAll: "accountsAll",
        accountsSelf: "accountsSelf",
        RoomsManagement: "RoomsManagement",
        BookingRequestsManagement: "BookingRequestsManagement"
    },
    actions: {
        create: "create",
        read: "read",
        readAll: "readAll",
        update: "update",
        delete: "delete"
    }
}