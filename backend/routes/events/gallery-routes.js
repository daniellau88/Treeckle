const router = require('express').Router();
const {isPermitted} = require('../../services/auth-service');
const Event = require('../../models/events-model');
const constants = require('../../config/constants');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

//Resident and higher: View all events
router.get('/', async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.eventEngagement, constants.actions.read);

    if (!permitted) {
        res.sendStatus(401);
        return ;
    }

    Event.byTenant(req.user.residence).find({}, '-creationDate -createdBy -__v -tenantId', {sort: {eventDate : 1}}).lean()
        .then(resp => {
            const sendToUser = [];
            resp.forEach(doc => {
                sendToUser.push({
                    eventId: doc._id,
                    title: doc.title,
                    description: doc.description,
                    categories: doc.categories,
                    attendees: doc.attendees.length,
                    isUserAttendee: doc.attendees.includes(req.user.userId),
                    organisedBy: doc.organisedBy,
                    posterPath: doc.posterPath,
                    eventDate: doc.eventDate.getTime(),
                    signupsAllowed: doc.signupsAllowed,
                    shortId: doc.shortId
                });
            });
            res.send(sendToUser);
        })
        .catch(err => {
            res.status(500).send("Database Error");
        });
});

// Resident and higher: (Un)Sign up for event
router.patch('/', jsonParser, [
    body('eventId').exists(),
    body('signUp').isIn([0,1]).toInt()
], async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.eventEngagement, constants.actions.update);

    //Check for input errors
    const errors = validationResult(req);

    if (!permitted) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        const updateObject = (req.body.signUp === 1)? { $addToSet : { attendees: req.user.userId }} : { $pull : { attendees: req.user.userId }};

        Event.byTenant(req.user.residence).findOneAndUpdate({ _id: req.body.eventId, signupsAllowed: true }, updateObject)
        .then(result => {
            if (!result) {
                res.sendStatus(400);
            } else {
                res.send({
                    counterAddition: (req.body.signUp === 1)? (result.attendees.includes(req.user.userId))? 0 : 1 
                        : (result.attendees.includes(req.user.userId))? -1 : 0
                });
            }
        })
        .catch (err => {
            if (err.name === 'CastError') {
                res.sendStatus(400);
            } else {
                res.status(500).send("Database Error");
            }
        });
    }
});

module.exports = router;