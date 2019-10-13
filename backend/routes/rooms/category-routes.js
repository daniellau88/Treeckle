const router = require('express').Router();
const Rooms = require('../../models/rooms-model');

//Resident and up: get list of categories
router.get('/', (req, res) => {
    Rooms.distinct('category', (error, results) => {
        if (error) {
            res.status(500).send("Database Error");
        } else {
            res.json({
                categories: results
            });
        }
    });
});

//Resident and up: Get an array of room names, recommended capacity and ids belonging to a particular category
router.get('/:category', (req, res) => {
    const category = req.params.category;
    Rooms.find({ category: category }, (err, resp) => {
        if (err) {
            res.status(500).send("Database Error");
        } else {
            const response = [];
            resp.forEach((doc) => {
                response.push({
                    name: doc.name,
                    recommendedCapacity: doc.recommendedCapacity,
                    roomId: doc._id
                });
            });
            res.send(response);
        }
    })
});

module.exports = router;