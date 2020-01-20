const router = require('express').Router();
const roomRoutes = require('./rooms/room-routes');
const eventRoutes = require('./events/event-routes');
const accountRoutes = require('./account-routes');
const emailRoutes = require('./email-routes');
const sheetRoutes = require('./sheet-routes');

router.use('/rooms', roomRoutes);
router.use('/accounts', accountRoutes);
router.use('/emails', emailRoutes);
router.use('/events', eventRoutes);
router.use('/sheets', sheetRoutes);

module.exports = router;