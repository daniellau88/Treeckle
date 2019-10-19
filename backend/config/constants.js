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
    }
}