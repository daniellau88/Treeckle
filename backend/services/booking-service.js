const RoomBooking = require('../models/roomBooking-model');
const constants = require('../config/constants');

const checkApprovedOverlaps = async (roomId, start, end) => {
    const returnObject = {
        error: 0,
        overlaps: []
    }
    
    try {
        const resp = await RoomBooking.find({
            approved: 1, 
            roomId: roomId, 
            start: {"$lte": end},
            end: {"$gte": start},
        }).lean();

        resp.forEach((doc) => {
            returnObject.overlaps.push({
                startDate: doc.start.getTime(),
                endDate: doc.end.getTime()
            });
        });
    } catch(err) {
        returnObject.error = 1
    }
    return returnObject;
}

const checkPotentialOverlaps = async (roomId, start, end) => {
    const returnObject = {
        error: 0,
        overlaps: []
    }
    
    try {
        const resp = await RoomBooking.find({
            roomId: roomId, 
            approved: {"$ne": constants.approvalStates.rejected},
            start: {"$lte": end},
            end: {"$gte": start},
        }).lean();

        resp.forEach((doc) => {
            returnObject.overlaps.push(doc._id);
        });
    } catch(err) {
        returnObject.error = 1
    }
    return returnObject;
}

const rejectOverlaps = async (roomId, start, end) => {
    const returnObject = {
        error: 0,
        overlaps: []
    }
    
    try {
        const resp = await RoomBooking.find({
            roomId: roomId, 
            approved: {"$ne": constants.approvalStates.rejected}, 
            start: {"$lte": end},
            end: {"$gte": start},
        }).lean();

        await RoomBooking.updateMany({
            roomId: roomId,
            approved: {"$ne": constants.approvalStates.rejected},  
            start: {"$lte": end},
            end: {"$gte": start},
        }, {"$set" : {approved: constants.approvalStates.rejected}}).lean();

        resp.forEach((doc) => {
            returnObject.overlaps.push(doc._id);
        });
    } catch(err) {
        console.log(err);
        returnObject.error = 1
    }
    return returnObject;
}

module.exports = {checkApprovedOverlaps, checkPotentialOverlaps, rejectOverlaps};