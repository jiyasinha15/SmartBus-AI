const express = require("express");
const router = express.Router();

const {
  getTripProgress,
  startTrip,
  advanceToNextStop,
  endTrip,
  resetTrip,
} = require("../controllers/buses/tripProgressController");

router.get("/bus/:busId", getTripProgress);

router.post("/bus/:busId/start", startTrip);

router.post("/bus/:busId/next", advanceToNextStop);

router.post("/bus/:busId/end", endTrip);

router.post("/bus/:busId/reset", resetTrip);

module.exports = router;