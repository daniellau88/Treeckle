const router = require('express').Router();
const creationRoutes = require('./creation-routes');
const attendRoutes = require('./attend-routes');
const bodyParser = require('body-parser');
const Room = require('../../models/room-booking/rooms-model');
const constants = require('../../config/constants');
const { isPermitted } = require('../../services/auth-service');
const { body, validationResult } = require('express-validator');

const jsonParser = bodyParser.json();

router.use('/attend', attendRoutes);
router.use('/create', creationRoutes);

//Admin: Create new event
router.post('/', jsonParser, [
    body('title').exists()
], async (req, res) => {
    //Check for input errors
    res.send({
        done: req.body.title
    });

});



module.exports = router;