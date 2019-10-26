const router = require('express').Router();
const creationRoutes = require('./creation-routes');
const attendRoutes = require('./attend-routes');
const bodyParser = require('body-parser');
const Event = require('../../models/events-model');
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

    const newEvent = {
        title: req.body.title
    };

    const event = Event.byTenant(req.user.residence);
    const eventInstance = new event(newEvent);

    eventInstance.save()
        .then(async (result, error) => {
            if (error) {
                res.status(500).send("Database Error");
            } else {
                res.send({
                    done: result
                });
            };
        });


});

//Resident: View all events
router.post('/all', jsonParser, [
], async (req, res) => {
    //Check for input errors
    
    Event.byTenant(req.user.residence).find({}).lean()
        .then(async resp => {
            try {
                const sendToUser = [];
                resp.forEach(request => {
                    sendToUser.push({
                        request
                    });
                });
                res.send(sendToUser);
            } catch (err) {
                res.status(500).send("Database Error");
            }
        }).catch(err => {
            res.status(500).send("Database Error");
        });
});

module.exports = router;