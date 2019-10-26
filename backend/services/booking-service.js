const RoomBooking = require('../models/room-booking/roomBooking-model');
const constants = require('../config/constants');

const checkApprovedOverlaps = async (req, roomId, start, end) => {
    const returnObject = {
        error: 0,
        overlaps: []
    }
    
    try {
        const resp = await RoomBooking.byTenant(req.user.residence).find({
            approved: constants.approvalStates.Approved, 
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

const checkPotentialOverlaps = async (req, roomId, start, end) => {
    const returnObject = {
        error: 0,
        overlaps: []
    }
    
    try {
        const resp = await RoomBooking.byTenant(req.user.residence).find(
            {$and: [
                { roomId: { $eq : roomId }},
                { approved: { $ne : constants.approvalStates.Rejected  }},
                { approved: { $ne : constants.approvalStates.Cancelled }},
                { start: { $lt : end }},
                { end: { $gt: start }}
            ]}).lean();

        resp.forEach((doc) => {
            returnObject.overlaps.push(doc._id);
        });
    } catch(err) {
        returnObject.error = 1
    }
    return returnObject;
}

const rejectOverlaps = async (req, roomId, start, end) => {
    const returnObject = {
        error: 0,
        overlaps: []
    }
    
    try {
        const resp = await RoomBooking.byTenant(req.user.residence).find(
            {$and: [
                { roomId: { $eq : roomId }},
                { approved: { $ne : constants.approvalStates.Rejected  }},
                { approved: { $ne : constants.approvalStates.Cancelled }},
                { start: { $lt : end }},
                { end: { $gt: start }}
            ]}).lean();

        await RoomBooking.byTenant(req.user.residence).updateMany(
            {$and: [
                { roomId: { $eq : roomId }},
                { approved: { $ne : constants.approvalStates.Rejected  }},
                { approved: { $ne : constants.approvalStates.Cancelled }},
                { start: { $lt : end }},
                { end: { $gt: start }}
            ]}, {"$set" : {approved: constants.approvalStates.Rejected}}).lean();

        resp.forEach((doc) => {
            returnObject.overlaps.push(doc._id);
        });
    } catch(err) {
        returnObject.error = 1
    }
    return returnObject;
}

module.exports = {checkApprovedOverlaps, checkPotentialOverlaps, rejectOverlaps};