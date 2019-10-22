const router = require('express').Router();
const roomRoutes = require('./rooms/room-routes');
const accountRoutes = require('./account-routes');
const emailRoutes = require('./email-routes');

router.use('/rooms', roomRoutes);
router.use('/accounts', accountRoutes);
router.use('/emails', emailRoutes)

module.exports = router;