const router = require('express').Router();
const roomRoutes = require('./rooms/room-routes');
const accountRoutes = require('./account-routes');

router.use('/rooms', roomRoutes);
router.use('/accounts', accountRoutes);

module.exports = router;