const express = require("express");
const router = express.Router();

const {
  createRouteStop,
  getAllRouteStops,
  getStopsByRouteId,
  getRouteStopById,
  updateRouteStop,
  deleteRouteStop,
} = require("../controllers/routes/routeStopController");

// Create
router.post("/", createRouteStop);

// Get all stops
router.get("/", getAllRouteStops);

// Get all stops of a route
router.get("/route/:routeId", getStopsByRouteId);

// Get single stop
router.get("/:id", getRouteStopById);

// Update stop
router.put("/:id", updateRouteStop);

// Delete stop
router.delete("/:id", deleteRouteStop);

module.exports = router;