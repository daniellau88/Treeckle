const router = require('express').Router({ mergeParams: true});
const bodyParser = require('body-parser');
const RoomBooking = require('../../models/room-booking/roomBooking-model');
const User = require('../../models/authentication/user-model');
const Room = require('../../models/room-booking/rooms-model');
const {isPermitted} = require('../../services/auth-service');
const mongoose = require('mongoose');
const constants = require('../../config/constants');
const { checkApprovedOverlaps, checkPotentialOverlaps, rejectOverlaps } = require('../../services/booking-service');
const { sanitizeBody, sanitizeParam, param, body, validationResult } = require('express-validator');

const jsonParser = bodyParser.json();

//Resident and up: Get an array of all roomBookings' made by requesting user
router.get('/', async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.BookingRequestsManagement, constants.actions.read);
    
    if (!permitted) {
        res.sendStatus(401);
    } else {
        RoomBooking.byTenant(req.user.residence).find({ createdBy: req.user.userId }).lean()
        .then(async resp => {
            const idToRoom = new Map();
            const roomPromises = [];

            for (const response of resp) {
                if (!idToRoom.has(response.roomId.toString())) {
                    roomPromises.push(Room.findById(response.roomId).lean());
                    idToRoom.set(response.roomId.toString(), { roomName: null });
                }
            }

            try {
                const roomData = await Promise.all(roomPromises);
                
                roomData.forEach(roomDatum => {
                    if (roomDatum) {
                        idToRoom.set(roomDatum._id.toString(), { roomName: roomDatum.name });
                    }
                });
            

                const sendToUser = [];
                resp.forEach(request => {
                    sendToUser.push({
                        bookingId: request._id,
                        roomName: idToRoom.get(request.roomId.toString()).roomName,
                        description: request.description,
                        start: request.start.getTime(),
                        end: request.end.getTime(),
                        createdDate: request.createdDate.getTime(),
                        comments: request.comments,
                        approved: request.approved
                    });
                });
                res.send(sendToUser);
            } catch (err) {
                res.status(500).send("Database Error"); 
            }
        }).catch(err => {
            res.status(500).send("Database Error");
        });
    }
});

//Admin: Get an array of all requests
router.get('/all/:status', [
    param('status').exists().isInt().toInt()
], async (req, res) => {
    //Check for input errors
    const errors = validationResult(req);
    const permitted = await isPermitted(req.user.role, constants.categories.BookingRequestsManagement, constants.actions.readAll);

    if (!permitted) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else if (![
        constants.approvalStates.pending, 
        constants.approvalStates.approved, 
        constants.approvalStates.rejected,
        constants.approvalStates.cancelled
    ].includes(req.params.status)) {
        res.status(422).json({ "ValueError": "invalid state" });
    } else {
        RoomBooking.byTenant(req.user.residence).find({ approved: req.params.status }).lean()
        .then(async resp => {
            const idToUser = new Map();
            const idToRoom = new Map();
            const roomPromises = [];
            const userPromises = [];

            for (const response of resp) {
                if (!idToUser.has(response.createdBy.toString())) {
                    userPromises.push(User.findById(response.createdBy, { profilePic: 0 }).lean());
                    idToUser.set(response.createdBy.toString(), { name: null, email: null});
                }

                if (!idToRoom.has(response.roomId.toString())) {
                    roomPromises.push(Room.findById(response.roomId).lean());
                    idToRoom.set(response.roomId.toString(), { roomName: null });
                }
            }

            try {
                const mixedData = await Promise.all([userPromises, roomPromises].map(Promise.all, Promise));

                mixedData[0].forEach(userDatum => {
                    if (userDatum) {
                        idToUser.set(userDatum._id.toString(), { name: userDatum.name, email: userDatum.email });
                    }
                });

                mixedData[1].forEach(roomDatum => {
                    if (roomDatum) {
                        idToRoom.set(roomDatum._id.toString(), { roomName: roomDatum.name });
                    }
                });
                
                const sendToAdmin = [];
                resp.forEach(request => {
                    sendToAdmin.push({
                        bookingId: request._id,
                        roomName: idToRoom.get(request.roomId.toString()).roomName,
                        description: request.description,
                        start: request.start.getTime(),
                        end: request.end.getTime(),
                        createdByName: idToUser.get(request.createdBy.toString()).name,
                        createdByEmail: idToUser.get(request.createdBy.toString()).email,
                        createdDate: request.createdDate.getTime(),
                        comments: request.comments,
                        approved: request.approved
                    });
                });
                res.send(sendToAdmin);
            } catch (err) {
                res.status(500).send("Database Error");
            };
        })
        .catch(err => {
            res.status(500).send("Database Error");
        });
    }
});

//Admin: Get conflicts that approval can cause
router.get('/manage/:id', async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.BookingRequestsManagement, constants.actions.readAll);
    if (!permitted) {
        res.sendStatus(401);
    } else {
        RoomBooking.byTenant(req.user.residence).findOne({ _id:req.params.id }).lean()
        .then(async relevantReq => {
            if (!relevantReq) {
                res.sendStatus(400);
            } else {
                const conflictDocs = await checkPotentialOverlaps(req, relevantReq.roomId, relevantReq.start, relevantReq.end);
                if (conflictDocs.error === 1) {
                    res.status(500).send("Database Error");
                } else {
                    const responseObject = conflictDocs.overlaps.filter((elem) => {
                        return elem.toString() !== relevantReq._id.toString();
                    });
                    res.send(responseObject);
                }
            }
        })
        .catch(err => {
            res.sendStatus(400);
        })
    }
});

//Authenticated User: Cancel their own request from pending/approved state
router.patch('/', jsonParser, [
    body('id').exists()
], async (req, res) => {
    const errors = validationResult(req);
    const permitted = await isPermitted(req.user.role, constants.categories.BookingRequestsManagement, constants.actions.cancelSelf);
    if (!permitted) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        RoomBooking.byTenant(req.user.residence).findOneAndUpdate({ _id: req.body.id, createdBy: req.user.userId }, { approved: constants.approvalStates.cancelled }).lean()
        .then(result => (result)? res.sendStatus(200): res.sendStatus(403))
        .catch(error => (error.name === 'CastError')? res.sendStatus(400) : res.status(500).send("Database Error"));
    }
})

//Admin: Patches the bookingRequest with approval or rejection, returns affected if approval
router.patch('/manage', jsonParser, [
    body('id').exists(),
    body('approved').exists().isInt()
    ], async (req, res) => {
        const errors = validationResult(req);
        const permitted = await isPermitted(req.user.role, constants.categories.BookingRequestsManagement, constants.actions.update);
        
        if (!permitted) {
            res.sendStatus(401);

        } else if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });

        } else if (req.body.approved === constants.approvalStates.approved) {
            RoomBooking.byTenant(req.user.residence).findOne({ _id:req.body.id, approved: {$ne : constants.approvalStates.cancelled} }).lean()
            .then(async result => {
                if (!result) {
                    res.sendStatus(403);
                } else {
                    const conflictDocs = await rejectOverlaps(req, relevantReq.roomId, relevantReq.start, relevantReq.end);
                    await RoomBooking.byTenant(req.user.residence).findOneAndUpdate({ _id:req.body.id, approved: {$ne : constants.approvalStates.cancelled} }, { approved: constants.approvalStates.approved }).lean();
                    if (conflictDocs.error === 1) {
                        res.status(500).send("Database Error");
                    } else {
                        const responseObject = conflictDocs.overlaps.filter((elem) => {
                            return elem.toString() !== relevantReq._id.toString();
                        });
                        res.send(responseObject);
                    }
                }
            })
            .catch(error => (error.name === "CastError")? res.sendStatus(400) :res.status(500).send("Database Error"));

        } else if (req.body.approved === constants.approvalStates.rejected) {
            RoomBooking.byTenant(req.user.residence).findOneAndUpdate({ _id:req.body.id, approved: {$ne : constants.approvalStates.cancelled} }, { approved: constants.approvalStates.rejected }).lean()
            .then(result => (result)? res.sendStatus(200) : res.sendStatus(403))
            .catch(error => (error.name === "CastError")? res.sendStatus(400) :res.status(500).send("Database Error"));
            
        } else if (req.body.approved === constants.approvalStates.pending) {
            RoomBooking.byTenant(req.user.residence).findOneAndUpdate({ _id:req.body.id, approved: {$ne : constants.approvalStates.cancelled} }, { approved: constants.approvalStates.pending }).lean()
            .then(result => (result)? res.sendStatus(200) : res.sendStatus(403))
            .catch(error => (error.name === "CastError")? res.sendStatus(400) :res.status(500).send("Database Error"));

        } else {
            res.sendStatus(403);
        }
    });

//Resident and up: Get an array of approved roomBookings' start-end intervals, within a specified range for a particular room
router.get('/:roomId/:start-:end', [
    param('roomId').exists(),
    param('start').exists().isInt().toInt(),
    param('end').exists().isInt().toInt()
    ], sanitizeParam('roomId').customSanitizer(value => {return mongoose.Types.ObjectId(value)}),
     async (req, res) => {
        const permitted = await isPermitted(req.user.role, constants.categories.BookingRequestsManagement, constants.actions.read);
        //Check for input errors
        const {roomId,start,end} = req.params;
        const errors = validationResult(req);
        if (!permitted) {
            res.sendStatus(401);
        } else if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        } else if (start > end) {
            res.status(422).json({ValueError: "start > end"});
        } else {         
            responseObject = await checkApprovedOverlaps(req, roomId, start, end);

            if (responseObject.error === 1) {
                res.status(500).send("Database Error");
            } else {
                res.send(responseObject.overlaps);
            }
        }   
});

//Resident and up: Create a new bookingRequest
router.post('/', jsonParser, [
    body('roomId').exists(),
    body('description').exists(),
    body('start').exists().isInt(),
    body('end').exists().isInt(),
    ], sanitizeBody('roomId').customSanitizer(value => {return mongoose.Types.ObjectId(value)}),
    async (req, res) => {
        const permitted = await isPermitted(req.user.role, constants.categories.BookingRequestsManagement, constants.actions.create);
        //Check for input errors
        const errors = validationResult(req);
        if (!permitted) {
            res.sendStatus(401);
        } else if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        } else {
            //Check for overlaps
            let responseObject = await checkApprovedOverlaps(req, req.body.roomId, req.body.start, req.body.end);

            if (responseObject.error === 1) {
                res.status(500).send("Database Error");
            } else if (responseObject.overlaps.length > 0) {
                res.status(400).send("Overlaps detected");
            } else {
                const newBookingRequest = {
                    roomId: req.body.roomId,
                    description: req.body.description,
                    createdBy: req.user.userId,
                    start: req.body.start,
                    end: req.body.end,
                    approved: constants.approvalStates.pending
                };

                const roomBooking = RoomBooking.byTenant(req.user.residence);
                const roomBookingInstance = new roomBooking(newBookingRequest);
                roomBookingInstance.save()
                .then((result, error) => {
                    if (error) {
                        res.status(500).send("Database Error");
                    } else {
                        res.sendStatus(200);
                    };
                });
            }
        }
    });

module.exports = router;