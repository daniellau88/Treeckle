const router = require("express").Router();
const roomRoutes = require("./rooms/room-routes");
const eventRoutes = require("./events/event-routes");
const accountRoutes = require("./account-routes");
const emailRoutes = require("./email-routes");

router.use("/rooms", roomRoutes);
router.use("/accounts", accountRoutes);
router.use("/emails", emailRoutes);
router.use("/events", eventRoutes);

module.exports = router;
