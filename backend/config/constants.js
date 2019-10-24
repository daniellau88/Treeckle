module.exports = {
    approvalStates: {
        pending: 0,
        approved: 1,
        rejected: 2,
        cancelled: 3
    },
    approvalStatesStringMap: {
        0: "Pending",
        1: "Approved",
        2: "Rejected",
        3: "Cancelled"
    },
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
        BookingRequestsManagement: "BookingRequestsManagement",
        emailReceiptsConfig: "emailReceiptsConfig"
    },
    actions: {
        create: "create",
        read: "read",
        readAll: "readAll",
        cancelSelf: "cancelSelf",
        update: "update",
        delete: "delete"
    },
    profilePicSizeLimit: 4096000,
    residences: {
        CAPT: "CAPT",
        Tembusu: "Tembusu",
        RVRC: "RVRC",
        RC4: "RC4"
    }
}