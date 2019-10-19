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
})

module.exports = router;