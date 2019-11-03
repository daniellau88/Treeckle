const router = require('express').Router();
const creationRoutes = require('./creation-routes');
const galleryRoutes = require('./gallery-routes');
const managementRoutes = require('./management-routes');
const bodyParser = require('body-parser');
const Event = require('../../models/events-model');
const User = require('../../models/authentication/user-model');
const shortId = require('shortid');
const path = require('path');
const fs = require('fs')
const csv = require('fast-csv');
const constants = require('../../config/constants');
const { isPermitted } = require('../../services/auth-service');
const { body, query, validationResult } = require('express-validator');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'public',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage });

const jsonParser = bodyParser.json();

router.use('/gallery', galleryRoutes);
router.use('/create', creationRoutes);
router.use('/management', managementRoutes);

//Organiser or above: Create new event
router.post('/', jsonParser, [
    body('title').exists().isString(),
    body('categories').isArray(),
    body('organisedBy').exists(),
    body('capacity').optional().isInt().toInt(),
    body('eventDate').isInt().toInt(),
    body('signupsAllowed').isBoolean().toBoolean()
], async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.eventInstances, constants.actions.create);

    //Check for input errors
    const errors = validationResult(req);

    if (!permitted) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        const newEvent = {
            title: req.body.title,
            description: req.body.description,
            categories: req.body.categories,
            capacity: req.body.capacity,
            organisedBy: req.body.organisedBy,
            createdBy: req.user.userId,
            posterPath: "EventPoster.png", //to be updated
            venue: req.body.venue,
            eventDate: req.body.eventDate,
            signupsAllowed: req.body.signupsAllowed,
            attendees: [],
            shortId: shortId.generate()
        };


        const append = (file, rows = []) => {
            let csvFile = fs.createWriteStream(file, { flags: 'a', includeEndRowDelimiter: true })
            csvFile.write('\n');
            csv.writeToStream(csvFile, rows, { headers: false })
        }

        const EventModel = Event.byTenant(req.user.residence);
        const eventInstance = new EventModel(newEvent);
        eventInstance.save()
            .then(result => {
                const constructedResponse = {
                    posterPath: result.posterPath,
                    creationDate: result.creationDate.getTime(),
                    shortId: result.shortId,
                    eventId: result._id
                }
                const des = (req.body.description + " " + req.body.categories.join(' ') + " " + req.body.organisedBy + " " + req.body.venue + "\0");
                append('Recommendation/in.csv', [
                    {
                        id: result._id,
                        title: req.body.title,
                        des: des
                    },
                ]);
                res.send(constructedResponse);
            }
            )
            .catch(err => {
                res.status(500).send("Database Error");
            });
    }
});

//Organiser and higher: Get self-created requests
router.get('/', [
    query('historical').optional().isBoolean().toBoolean(),
    query('latestFirst').optional().isBoolean().toBoolean()
], async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.eventInstances, constants.actions.readSelf);

    //Check for input errors
    const errors = validationResult(req);

    if (!permitted) {
        res.sendStatus(401);
        return;
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const filter = (req.query.historical) ? { createdBy: req.user.userId } : { createdBy: req.user.userId, eventDate: { $gte: Date.now() } };
    const sortOrder = (req.query.latestFirst) ? { sort: { eventDate: -1 } } : { sort: { eventDate: 1 } };

    Event.byTenant(req.user.residence).find(filter, '-createdBy -__v -tenantId', sortOrder)
        .populate('attendees', 'name').lean()
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

//Organiser and above: Delete a self-created event
router.delete('/', jsonParser, [
    body("eventId").exists()
], async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.eventInstances, constants.actions.deleteSelf);

    //Check for input errors
    const errors = validationResult(req);

    if (!permitted) {
        res.sendStatus(401);
        return;
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    Event.byTenant(req.user.residence).deleteOne({ createdBy: req.user.userId, _id: req.body.eventId })
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

//Organiser and higher: Update a self-created event
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
    const permitted = await isPermitted(req.user.role, constants.categories.eventInstances, constants.actions.updateSelf);

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

        Event.byTenant(req.user.residence).findOneAndUpdate({ createdBy: req.user.userId, _id: req.body.eventId },
            updateObject, {new: true}).lean()
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


//Organiser or above: Add poster for event
router.patch('/image', upload.single('image'), [
    body('eventId').exists()
], async (req, res) => {

    const permitted = await isPermitted(req.user.role, constants.categories.eventInstances, constants.actions.create);

    //Check for input errors
    const errors = validationResult(req);

    if (!permitted) {
        res.sendStatus(401);
    } else if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        Event.byTenant(req.user.residence).findOneAndUpdate(
            { _id: req.body.eventId, createdBy: req.user.userId, },
            { posterPath: req.file.filename }
        ).then(resp => {
            res.send(resp);
        }).catch(err => {
            res.sendStatus(500).send("Database Error");
        })
    }

});

module.exports = router;