const router = require('express').Router();
const authService = require('../services/auth-service');
const bodyParser = require('body-parser');
const Rooms = require('../models/rooms-model');
const passport = require("passport");
const { check, validationResult } = require('express-validator');

const jsonParser = bodyParser.json();

router.get('/rooms/:category', passport.authenticate('jwt', { session: false }), (req, res) => {
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
});

module.exports = router;