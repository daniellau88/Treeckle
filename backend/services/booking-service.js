const RoomBooking = require('../models/roomBooking-model');

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
            start: {"$lte": end},
            end: {"$gte": start},
        }).lean();

        resp.forEach((doc) => {
            returnObject.overlaps.push({
                reqId: doc._id
            });
        });
    } catch(err) {
        returnObject.error = 1
    }
    return returnObject;
}

module.exports = {checkApprovedOverlaps, checkPotentialOverlaps};