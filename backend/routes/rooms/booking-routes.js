const router = require('express').Router({ mergeParams: true});
const bodyParser = require('body-parser');
const RoomBooking = require('../../models/roomBooking-model');
const mongoose = require('mongoose');
const constants = require('../../config/constants');
const { checkApprovedOverlaps } = require('../../services/booking-service');
const { sanitizeBody, sanitizeParam, param, body, validationResult } = require('express-validator');

const jsonParser = bodyParser.json();

//Resident and up: Get an array of all roomBookings' made by requesting user
router.get('/', (req, res) => {
    RoomBooking.find({ createdBy: req.user.userId }).lean()
    .then(resp => {
        const sendToUser = [];
        resp.forEach(request => {
            sendToUser.push({
                bookingId: request._id,
                roomId: request.roomId,
                description: request.description,
                start: request.start.getTime(),
                end: request.end.getTime(),
                approved: request.approved
            });
        });
        res.send(sendToUser);
    }).catch(err => {
        res.status(500).send("Database Error");
    });
});

//Admin: Get an array of all requests
router.get('/all/:status', [
    param('status').exists().isInt().toInt()
], (req, res) => {
    //Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else if (![
        constants.approvalStates.pending, 
        constants.approvalStates.approved, 
        constants.approvalStates.rejected
    ].includes(req.params.status)) {
        res.status(422).json({ "ValueError": "invalid state" });
    } else {
        RoomBooking.find({ approved: req.params.status }).lean()
        .then(resp => {
            const sendToAdmin = [];
            resp.forEach(request => {
                sendToAdmin.push({
                    bookingId: request._id,
                    roomId: request.roomId,
                    description: request.description,
                    start: request.start.getTime(),
                    end: request.end.getTime(),
                    approved: request.approved
                });
            });
            res.send(sendToAdmin);
        }).catch(err => {
            res.status(500).send("Database Error");
        });
    }
})

//Resident and up: Get an array of approved roomBookings' start-end intervals, within a specified range for a particular room
router.get('/:roomId/:start-:end', [
    param('roomId').exists(),
    param('start').exists().isInt().toInt(),
    param('end').exists().isInt().toInt()
    ], sanitizeParam('roomId').customSanitizer(value => {return mongoose.Types.ObjectId(value)}),
     async (req, res) => {
        //Check for input errors
        const {roomId,start,end} = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        } else if (start > end) {
            res.status(422).json({ValueError: "start > end"});
        } else {         
            responseObject = await checkApprovedOverlaps(roomId, start, end);

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
        //Check for input errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        } else {
            //Check for overlaps
            let responseObject = await checkApprovedOverlaps(req.body.roomId, req.body.start, req.body.end);

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

                new RoomBooking(newBookingRequest).save()
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