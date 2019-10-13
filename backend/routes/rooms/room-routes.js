const router = require('express').Router();
const bookingRoutes = require('./booking-routes');
const passport = require("passport");
const Rooms = require('../../models/rooms-model');
const mongoose = require('mongoose');
const { param, body, sanitizeParam, validationResult } = require('express-validator');

//Level 0: Get an array of room names, recommended capacity and ids belonging to a particular category
router.get('/:category', passport.authenticate('jwt', { session: false }), [
    param('category').exists()
], (req, res) => {
        //Check for input errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
        } else {
        const category = req.params.category;
        Rooms.find({ category: category }, (err, resp) => {
            if (err) {
                res.sendStatus(500);
            } else {
                const response = [];
                resp.forEach((doc) => {
                    response.push({
                        name: doc.name,
                        recommendedCapacity: doc.recommendedCapacity,
                        roomId: doc._id
                    });
                });
                res.send(response);
            }
        })
    }
});

router.use('/:roomId', passport.authenticate('jwt', { session: false }), sanitizeParam('roomId').customSanitizer(value => {return mongoose.Types.ObjectId(value)}), bookingRoutes);
module.exports = router;