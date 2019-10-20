const RoomBooking = require('../models/room-booking/roomBooking-model');
const constants = require('../config/constants');

const checkApprovedOverlaps = async (roomId, start, end) => {
    const returnObject = {
        error: 0,
        overlaps: []
    }
    
    try {
        const resp = await RoomBooking.find({
            approved: constants.approvalStates.approved, 
            roomId: roomId, 
            start: {"$lt": end},
            end: {"$gt": start},
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
            approved: {"$ne": constants.approvalStates.cancelled},  //approved != rejected and != cancelled 
            start: {"$lt": end},
            end: {"$gt": start},
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
            approved: {"$ne": constants.approvalStates.cancelled}, 
            start: {"$lt": end},
            end: {"$gt": start},
        }).lean();

        await RoomBooking.updateMany({
            roomId: roomId,
            approved: {"$ne": constants.approvalStates.rejected},
            approved: {"$ne": constants.approvalStates.cancelled},  
            start: {"$lt": end},
            end: {"$gt": start},
        }, {"$set" : {approved: constants.approvalStates.rejected}}).lean();

        resp.forEach((doc) => {
            returnObject.overlaps.push(doc._id);
        });
    } catch(err) {
        returnObject.error = 1
    }
    return returnObject;
}

module.exports = {checkApprovedOverlaps, checkPotentialOverlaps, rejectOverlaps};