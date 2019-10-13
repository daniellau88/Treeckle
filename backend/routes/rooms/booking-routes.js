const router = require('express').Router({ mergeParams: true});
const bodyParser = require('body-parser');
const RoomBooking = require('../../models/roomBooking-model');
const { param, body, validationResult } = require('express-validator');

const jsonParser = bodyParser.json();

const checkApprovedOverlaps = async (roomId, start, end) => {
    const returnObject = {
        error: 0,
        overlaps: []
    }
    
    try {
        const resp = await RoomBooking.find({
            approved: true, 
            roomId: roomId, 
            start: {"$lte": end},
            end: {"$gte": start},
        });

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

//Level 0: Get an array of approved roomBookings' start-end intervals, within a specified range for a particular room
router.get('/:start-:end', [
    param('roomId').exists(),
    param('start').exists().isInt().toInt(),
    param('end').exists().isInt().toInt()
    ], async (req, res) => {
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

//Level 0: Create a new bookingRequest
router.post('/', jsonParser, [
    body('description').exists(),
    body('start').exists().isInt(),
    body('end').exists().isInt(),
    ], async (req, res) => {
        //Check for input errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        } else {
            //Check for overlaps
            let responseObject = await checkApprovedOverlaps(req.params.roomId, req.body.start, req.body.end);

            if (responseObject.error === 1) {
                res.status(500).send("Database Error");
            } else if (responseObject.overlaps.length > 0) {
                res.status(400).send("Overlaps detected");
            } else {
                const newBookingRequest = {
                    roomId: req.params.roomId,
                    description: req.body.description,
                    createdBy: req.user.userId,
                    start: req.body.start,
                    end: req.body.end,
                    approved: false
                };

                new RoomBooking(newBookingRequest).save()
                .then((result, error) => {
                    if (error) {
                        res.status(500).send("Database Error");
                    } else {
                        res.send(result);
                    };
                });
            }
        }
    });

module.exports = router;