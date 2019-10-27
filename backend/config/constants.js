module.exports = {
    approvalStates: {
        Pending: 0,
        Approved: 1,
        Rejected: 2,
        Cancelled: 3
    },
    approvalStatesStringMap: {
        0: "Pending",
        1: "Approved",
        2: "Rejected",
        3: "Cancelled"
    },
    roleSortPriority: {
        Resident: 0,
        Organiser: 1,
        Admin: 2
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
        accounts: "accounts",
        roomsManagement: "roomsManagement",
        bookingRequestsManagement: "bookingRequestsManagement",
        emailReceiptsConfig: "emailReceiptsConfig",
        eventInstances: "eventInstances",
        eventEngagement: "eventEngagement"
    },
    actions: {
        create: "create",
        readSelf: "readSelf",
        read: "read",
        updateSelf: "updateSelf",
        update: "update",
        delete: "delete",
        deleteSelf: "deleteSelf"
    },
    profilePicSizeLimit: 4096000,
    residences: {
        CAPT: "CAPT",
        Tembusu: "Tembusu",
        RVRC: "RVRC",
        RC4: "RC4"
    }
}