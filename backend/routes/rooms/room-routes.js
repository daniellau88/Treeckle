const router = require('express').Router();
const bookingRoutes = require('./booking-routes');
const categoryRoutes = require('./category-routes');
const passport = require("passport");
const Rooms = require('../../models/rooms-model');
const mongoose = require('mongoose');
const { sanitizeParam } = require('express-validator');

router.use('/categories', passport.authenticate('jwt', { session: false }), categoryRoutes);
router.use('/bookings/:roomId', passport.authenticate('jwt', { session: false }), sanitizeParam('roomId').customSanitizer(value => {return mongoose.Types.ObjectId(value)}), bookingRoutes);

module.exports = router;