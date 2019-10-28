const router = require('express').Router();
const Event = require('../../models/events-model');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const constants = require('../../config/constants');
const { isPermitted } = require('../../services/auth-service');
const { body, query, validationResult } = require('express-validator');

//Admin: Get all requests
router.get('/', [
    query('historical').optional().isBoolean().toBoolean(),
    query('latestFirst').optional().isBoolean().toBoolean()
], async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.eventInstances, constants.actions.read);

    //Check for input errors
    const errors = validationResult(req);

    if (!permitted) {
        res.sendStatus(401);
        return;
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const filter = (req.query.historical)? {} : { eventDate : { $gte : Date.now() }};
    const sortOrder = (req.query.latestFirst)? {sort: {eventDate : -1}} : {sort: {eventDate : 1}};

    Event.byTenant(req.user.residence).find(filter, ' -__v -tenantId', sortOrder)
        .populate('attendees', 'name')
        .populate('createdBy', 'name email').lean()
        .then(results => {
            const sendToUser = [];
            results.forEach(doc => {
                sendToUser.push({
                    eventId: doc._id,
                    title: doc.title,
                    description: doc.description,
                    categories: doc.categories,
                    venue: doc.venue,
                    capacity: doc.capacity,
                    attendeesNames: doc.attendees.map(userDoc => userDoc.name),
                    attendees: doc.attendees.length,
                    organisedBy: doc.organisedBy,
                    createdBy: { email: doc.createdBy.email, name: doc.createdBy.name },
                    posterPath: doc.posterPath,
                    eventDate: doc.eventDate.getTime(),
                    signupsAllowed: doc.signupsAllowed,
                    shortId: doc.shortId
                });
            });
            res.send(sendToUser);
        })
        .catch(error => {
            res.status(500).send("Database Error");
        })
});

//Admin: Delete any event
router.delete('/', jsonParser, [
    body("eventId").exists()
], async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.eventInstances, constants.actions.delete);

    //Check for input errors
    const errors = validationResult(req);

    if (!permitted) {
        res.sendStatus(401);
        return;
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    Event.byTenant(req.user.residence).deleteOne({ _id: req.body.eventId })
        .then(result => {
            if (result.deletedCount > 0) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            if (err.name === 'CastError') {
                res.sendStatus(404);
            } else {
                res.status(500).send("Database Error")
            }
        });
});

//Admin: Update a self-created event
router.patch('/', jsonParser, [
    body('eventId').exists(),
    body('title').optional().not().isEmpty(),
    body('description').optional().not().isEmpty(),
    body('categories').optional().isArray(),
    body('capacity').optional().isInt().toInt(),
    body('organisedBy').optional().not().isEmpty(),
    body('venue').optional(),
    body('eventDate').optional().isInt().toInt(),
    body('signupsAllowed').optional().isBoolean().toBoolean().isIn([true])
], async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.eventInstances, constants.actions.update);

    //Check for input errors
    const errors = validationResult(req);

    if (!permitted) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        let updateObject = {};
        if (req.body.title) updateObject.title = req.body.title;
        if (req.body.description) updateObject.description = req.body.description;
        if (req.body.categories) updateObject.categories = req.body.categories;
        if (req.body.capacity) updateObject.capacity = req.body.capacity;
        if (req.body.organisedBy) updateObject.organisedBy = req.body.organisedBy;
        if (req.body.venue) updateObject.venue = req.body.venue;
        if (req.body.eventDate) updateObject.eventDate = req.body.eventDate;
        if (req.body.signupsAllowed) updateObject.signupsAllowed = req.body.signupsAllowed;

        Event.byTenant(req.user.residence).findOneAndUpdate({ _id: req.body.eventId },
            updateObject, {new: true})
            .populate('createdBy', 'name email').lean()
            .then(doc => {
                if (!doc) {
                    res.sendStatus(404);
                } else {
                    res.send({
                        eventId: doc._id,
                        title: doc.title,
                        description: doc.description,
                        categories: doc.categories,
                        venue: doc.venue,
                        capacity: doc.capacity,
                        attendeesNames: doc.attendees.map(userDoc => userDoc.name),
                        attendees: doc.attendees.length,
                        organisedBy: doc.organisedBy,
                        createdBy: { email: doc.createdBy.email, name: doc.createdBy.name },
                        posterPath: doc.posterPath,
                        eventDate: doc.eventDate.getTime(),
                        signupsAllowed: doc.signupsAllowed,
                        shortId: doc.shortId
                    });
                }
            })
            .catch(err => {
                res.status(500).send("Database Error");
            })
    }
});


module.exports = router;