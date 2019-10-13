const router = require('express').Router();
const bookingRoutes = require('./booking-routes');
const categoryRoutes = require('./category-routes');
const passport = require("passport");

router.use('/categories', passport.authenticate('jwt', { session: false }), categoryRoutes);
router.use('/bookings', passport.authenticate('jwt', { session: false }), bookingRoutes);

module.exports = router;