const router = require('express').Router();
const roomRoutes = require('./rooms/room-routes');

router.use('/rooms', roomRoutes);

module.exports = router;