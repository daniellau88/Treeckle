const router = require('express').Router();
const creationRoutes = require('./creation-routes');
const galleryRoutes = require('./gallery-routes');
const bodyParser = require('body-parser');
const Event = require('../../models/events-model');
const User = require('../../models/authentication/user-model');
const shortId = require('shortid');
const path = require('path');
const constants = require('../../config/constants');
const { isPermitted } = require('../../services/auth-service');
const { body, validationResult } = require('express-validator');
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
            posterPath: "insertDefaultPicturePathHere", //to be updated
            venue: req.body.venue,
            eventDate: req.body.eventDate,
            signupsAllowed: req.body.signupsAllowed,
            attendees: [],
            shortId: shortId.generate()
        };

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
        .catch(err => res.status(500).send("Database Error"));
    }
});

//Resident: Set category tags
router.post('/set/tags', jsonParser, [
    body("categories").exists()
], async (req, res) => {
    //Check for input errors
    //console.log(req.body.categories);
    User.findOneAndUpdate({ _id: req.user.userId }, { subscribedCategories: req.body.categories })
        .then(resp => {
            res.status(200).send();
        })
        .catch(err => {
            res.sendStatus(400);
        })

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

//Upload image for event matching title and time
router.post('/image', upload.single('image'), [
    body("title").exists(),
    body("date").exists()
], async (req, res) => {
    console.log(req.body.title + req.body.date);
    console.log(req.file);

    Event.byTenant(req.user.residence).findOneAndUpdate(
        { eventDate: req.body.date, createdBy: req.user.userId, title: req.body.title },
        { posterPath: req.file.path }
    )
        .then(resp => {
            res.send(req.file);
        })
        .catch(err => {
            res.sendStatus(400);
        })

});

module.exports = router;