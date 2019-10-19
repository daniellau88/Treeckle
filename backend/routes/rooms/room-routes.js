const router = require('express').Router();
const bookingRoutes = require('./booking-routes');
const categoryRoutes = require('./category-routes');
const bodyParser = require('body-parser');
const Room = require('../../models/room-booking/rooms-model');
const constants = require('../../config/constants');
const {isPermitted} = require('../../services/auth-service');
const { body, validationResult } = require('express-validator');

const jsonParser = bodyParser.json();

router.use('/categories', categoryRoutes);
router.use('/bookings', bookingRoutes);

//Admin: Create new room
router.post('/', jsonParser, [
    body('name').exists(),
    body('category').exists(),
    body('recommendedCapacity').exists().isInt()
], async (req, res) => {
    //Check for input errors
    const errors = validationResult(req);
    const permitted = await isPermitted(req.user.role, constants.categories.RoomsManagement, constants.actions.create);

    if (!permitted) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        const newRoom = {
            name: req.body.name,
            category: req.body.category,
            recommendedCapacity: req.body.recommendedCapacity,
            createdBy: req.user.userId
        }

        new Room(newRoom).save((err, product) => {
            if (err) {
                if (err.code === 11000) {
                    res.status(400).send("duplicated room name");
                } else {
                    res.status(500).send("Database Error");
                }
            } else {
                res.send({
                    roomId: product._id
                });
            }
        });
    }
});

//Admin: Update existing room
router.patch('/', jsonParser, [
    body('roomId').exists(),
    body('name').optional().isString(),
    body('category').optional().isString(),
    body('recommendedCapacity').optional().isInt()
] , async (req, res) => {
    //Check for input errors
    const errors = validationResult(req);
    const permitted = await isPermitted(req.user.role, constants.categories.RoomsManagement, constants.actions.update);

    if (!permitted) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    }

    Room.findOneAndUpdate({ _id: req.body.roomId }, { 
        name: req.body.name,
        category: req.body.category,
        recommendedCapacity: req.body.recommendedCapacity
    }, {omitUndefined: true}).lean()
    .then(result => {
        if (result) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    }).catch(error => {
        if (error.name === 'CastError') {
            res.sendStatus(400);
        } else {
            res.status(500).send("Database Error");
        }
    })
});

module.exports = router;