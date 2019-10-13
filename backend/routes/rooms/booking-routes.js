const router = require('express').Router({ mergeParams: true});
const bodyParser = require('body-parser');
const RoomBooking = require('../../models/roomBooking-model');
const mongoose = require('mongoose');
const { checkApprovedOverlaps } = require('../../services/booking-service');
const { sanitizeBody, sanitizeParam, param, body, validationResult } = require('express-validator');

const jsonParser = bodyParser.json();

//Resident and up: Get an array of all roomBookings' made by requesting user
router.get('/', (req, res) => {
    RoomBooking.find({ createdBy: req.user.userId }, (err, resp) => {
        if (err) {
            res.status(500).send("Database Error");
        } else {
            const sendToUser = [];
            resp.forEach(doc => {
                sendToUser.push({
                    bookingId: doc._id,
                    roomId: doc.roomId,
                    description: doc.description,
                    start: doc.start.getTime(),
                    end: doc.end.getTime(),
                    approved: doc.approved
                });
            });
            res.send(sendToUser);
        }
    });
});


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
                    approved: 0
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