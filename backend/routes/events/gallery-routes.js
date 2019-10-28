const router = require('express').Router();
const {isPermitted} = require('../../services/auth-service');
const Event = require('../../models/events-model');
const User = require('../../models/authentication/user-model');
const constants = require('../../config/constants');
const { body, query, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

//Resident and higher: View all events
router.get('/', [
    //query('historical').optional().isBoolean().toBoolean(), // Don't support historical unless required in the future
    query('latestFirst').optional().isBoolean().toBoolean()
], async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.eventEngagement, constants.actions.read);
    
    //Check for input errors
    const errors = validationResult(req);

    if (!permitted) {
        res.sendStatus(401);
        return;
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    //const filter = (req.query.historical)? {} : { eventDate : { $gte : Date.now() }};
    const filter =  { eventDate: {$gte : Date.now() }};
    const sortOrder = (req.query.latestFirst)? {sort: {eventDate : -1}} : {sort: {eventDate : 1}};

    Event.byTenant(req.user.residence).find(filter, '-creationDate -createdBy -__v -tenantId', sortOrder ).lean()
        .then(resp => {
            const sendToUser = [];
            resp.forEach(doc => {
                sendToUser.push({
                    eventId: doc._id,
                    title: doc.title,
                    description: doc.description,
                    categories: doc.categories,
                    venue: doc.venue,
                    capacity: doc.capacity,
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

//Resident and higher: (Un)Sign up for event
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
        const userUpdateObject = (req.body.signUp === 1)? { $addToSet : { participatedEventsIds : req.body.eventId } }
            : { $pull : {participatedEventsIds : req.body.eventId } };

        Event.byTenant(req.user.residence).findOneAndUpdate({ _id: req.body.eventId, signupsAllowed: true, eventDate: { $gte : Date.now() }}, updateObject)
        .then(async result => {
            if (!result) {
                res.sendStatus(400);
            } else {
                try {   
                    await User.updateOne({ _id: req.user.userId }, userUpdateObject).lean();
                    res.send({
                        counterAddition: (req.body.signUp === 1)? (result.attendees.includes(req.user.userId))? 0 : 1 
                            : (result.attendees.includes(req.user.userId))? -1 : 0
                    });
                } catch {
                    res.status(500).send("Database Error");
                }  
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

//Resident and higher: Retrieve user's categories
router.get('/userCategories', async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.accounts, constants.actions.readSelf);

    if (!permitted) {
        res.sendStatus(401);
        return;
    }

    User.findById(req.user.userId, 'subscribedCategories')
        .lean()
        .then(result => {
            res.send(result.subscribedCategories);
        })
        .catch(err => {
            res.status(500).send("Database Error");
        })
})

//Resident and higher: Set user's categories
router.patch('/userCategories', jsonParser, [
    body('subscribedCategories').isArray(),
], async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.accounts, constants.actions.updateSelf);
    
    //Check for input errors
    const errors = validationResult(req);
    
    if (!permitted) {
        res.sendStatus(401);
        return;
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    User.findOneAndUpdate({ _id: req.user.userId }, { subscribedCategories: req.body.subscribedCategories.sort() }, { new: true })
        .lean()
        .then(resp => {
            res.send(resp.subscribedCategories);
        })
        .catch(err => {
            res.status(500).send("Database Error");
        });
});

//Resident: View events with user categories
router.post('/all/tags', jsonParser, [
], async (req, res) => {
    //Check for input errors

    User.findOne({ _id: req.user.userId }).lean()
        .then(user => {
            const tags = user.subscribedCategories;
            Event.byTenant(req.user.residence).find({}).lean()
                .then(async resp => {
                    try {
                        const sendToUser = [];
                        resp.forEach(event => {
                            if (tags.some(x => event.categories.includes(x))) {
                                sendToUser.push({
                                    event
                                });
                            }
                        });
                        res.send(sendToUser);
                    } catch (err) {
                        res.status(500).send("Database Error");
                    }
                }).catch(err => {
                    res.status(500).send("Database Error");
                });
        });
});

module.exports = router;