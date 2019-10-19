module.exports = {
    permissionLevels: {
        Resident: 0,
        Organiser: 100,
        Admin: 200
    },
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
        "Resident": true,
        "Organiser": true,
        "Admin": true
    }
}