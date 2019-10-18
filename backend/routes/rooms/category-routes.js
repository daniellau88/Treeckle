const router = require('express').Router();
const Rooms = require('../../models/room-booking/rooms-model');

//Resident and up: get list of categories
router.get('/', (req, res) => {
    Rooms.distinct('category').lean()
    .then(results => {
        res.json({
            categories: results
        })})
    .catch(error => {
        res.status(500).send("Database Error");
        });
    });

//Resident and up: Get an array of room names, recommended capacity and ids belonging to a particular category
router.get('/:category', (req, res) => {
    const category = req.params.category;
    Rooms.find({ category: category }).lean()
    .then(resp => {
        const response = [];
        resp.forEach((doc) => {
            response.push({
                name: doc.name,
                recommendedCapacity: doc.recommendedCapacity,
                roomId: doc._id
            });
        });
        res.send(response);
    })
    .catch(err => {
        res.status(500).send("Database Error");
    });
});

module.exports = router;