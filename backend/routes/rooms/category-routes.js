const router = require('express').Router();
const constants = require('../../config/constants');
const {isPermitted} = require('../../services/auth-service');
const Rooms = require('../../models/room-booking/rooms-model');

//Resident and up: get list of categories
router.get('/', async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.roomsManagement, constants.actions.read);
    if (!permitted) {
        res.sendStatus(401);
    } else {
        Rooms.byTenant(req.user.residence).find({}).lean()
        .then(results => {
            let uniqueCategories = new Set();
            let uniques = [];
            for (let i = 0; i < results.length; i++) {
                uniqueCategories.add(results[i].category);
            }
            let it = uniqueCategories.keys();
            let result = it.next();
            
            while(!result.done) {
                uniques.push(result.value);
                result = it.next();
            }

            res.json({
                categories: uniques
            })})
        .catch(error => {
            res.status(500).send("Database Error");
            });
    }
});

//Resident and up: Get an array of rooms belonging to a particular category
router.get('/:category', async (req, res) => {
    const permitted = await isPermitted(req.user.role, constants.categories.roomsManagement, constants.actions.read);

    if (!permitted) {
        res.sendStatus(401);
    } else {
        const category = req.params.category;
        Rooms.byTenant(req.user.residence).find({ category: category }).sort({ name : 1 }).lean()
        .then(resp => {
            const response = [];
            resp.forEach((doc) => {
                response.push({
                    roomId: doc._id,
                    name: doc.name,
                    recommendedCapacity: doc.recommendedCapacity,
                    contactName: doc.contactName,
                    contactEmail: doc.contactEmail,
                    contactNumber: doc.contactNumber,
                    checklist: doc.checklist,
                    placeholderText: doc.placeholderText
                });
            });
            res.send(response);
        })
        .catch(err => {
            res.status(500).send("Database Error");
        });
    }
});

module.exports = router;
