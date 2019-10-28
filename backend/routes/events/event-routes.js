const router = require('express').Router();
const creationRoutes = require('./creation-routes');
const galleryRoutes = require('./gallery-routes');
const bodyParser = require('body-parser');
const Event = require('../../models/events-model');
const Category = require('../../models/category-model');
const User = require('../../models/authentication/user-model');
const shortId = require('shortid');
const path = require('path');
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

        const CategoryModel = Category.byTenant(req.user.residence);
        if (req.body.categories) {
            for (i = 0; i < req.body.categories.length; i++) {
                const curr = req.body.categories[i];
                CategoryModel.findOne({ "name": curr })
                    .then(exists => {
                        if (exists) {
                            const previousCount = exists.upcomingEventCount;
                            User.findOneAndUpdate({ "name": curr }, { upcomingEventCount: previousCount+1});
                        } else {
                            const newCategory = {
                                "name": curr,
                                upcomingEventCount: 0
                            }
                            const categoryInstance = new CategoryModel(newCategory);
                            categoryInstance.save();
                        }
                    });
            }
        }

        const EventModel = Event.byTenant(req.user.residence);
        const eventInstance = new EventModel(newEvent);
        eventInstance.save()
            .then(result => {
                const constructedResponse = {
                    posterPath: result.posterPath,
                    creationDate: result.creationDate.getTime(),
                    shortId: result.shortId
                }
                res.send(constructedResponse);
            }
            )
            .catch(err => {
                res.status(500).send("Database Error");
            });
    }
});

// Organiser and higher: Get self-created requests
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

    const filter = (req.query.historical)? { createdBy: req.user.userId } : { createdBy: req.user.userId, eventDate : { $gte : Date.now() }};
    const sortOrder = (req.query.latestFirst)? {sort: {eventDate : -1}} : {sort: {eventDate : 1}};

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
})

//Resident: View all category tags
router.get('/tags', jsonParser, [
], async (req, res) => {
    //Check for input errors
    //console.log(req.body.categories);
    const CategoryModel = Category.byTenant(req.user.residence);
    CategoryModel.find({})
        .then(resp => {
            res.status(200).send(resp);
        })
        .catch(err => {
            res.sendStatus(400);
        });

});

//delete event by title
router.delete('/', jsonParser, [
    body("title").exists()
], async (req, res) => {

    Event.byTenant(req.user.residence).findOne({ title: req.body.title, createdBy: req.user.userId })
        .then(async relevantReq => {
            if (!relevantReq) {
                res.sendStatus(400);
            } else {
                Event.byTenant(req.user.residence).deleteOne({ title: req.body.title })
                    .then(result => {
                        if (result.deletedCount > 0) {
                            res.sendStatus(200);
                        } else {
                            res.sendStatus(404);
                        }
                    })
                    .catch(err => res.sendStatus(500));
            }
        })
        .catch(err => {
            res.sendStatus(400);
        })


})

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
            { posterPath: req.file.path }
        ).then(resp => {
            res.send(resp);
        }).catch(err => {
            res.sendStatus(500).send("Database Error");
        })
    }

});

module.exports = router;