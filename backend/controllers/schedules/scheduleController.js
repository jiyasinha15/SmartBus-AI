const db = require("../../db");

// ================= CREATE SCHEDULE =================
exports.createSchedule = (req, res) => {
  const {
    bus_id,
    driver_id,
    route_id,
    departure_time,
    arrival_time,
    return_departure_time,
    return_arrival_time,
    status = "active",
  } = req.body;

  if (
    !bus_id ||
    !driver_id ||
    !route_id ||
    !departure_time ||
    !arrival_time
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Bus, driver, route, morning departure and morning arrival are required",
    });
  }

  const allowedStatuses = ["active", "inactive"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid schedule status",
    });
  }

  const query = `
    INSERT INTO schedules
    (
      bus_id,
      driver_id,
      route_id,
      departure_time,
      arrival_time,
      return_departure_time,
      return_arrival_time,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      bus_id,
      driver_id,
      route_id,
      departure_time,
      arrival_time,
      return_departure_time || null,
      return_arrival_time || null,
      status,
    ],
    (error, result) => {
      if (error) {
        console.error("Create schedule error:", error);

        return res.status(500).json({
          success: false,
          message: "Could not create schedule",
          error: error.message,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Schedule created successfully",
        schedule_id: result.insertId,
      });
    }
  );
};

// ================= GET ALL SCHEDULES =================
exports.getAllSchedules = (req, res) => {
  const query = `
    SELECT
      s.id,
      s.departure_time,
      s.arrival_time,
      s.return_departure_time,
      s.return_arrival_time,
      s.status,

      b.id AS bus_id,
      b.bus_number,
      b.bus_name,

      d.id AS driver_id,
      u.full_name AS driver_name,

      r.id AS route_id,
      r.route_name,
      r.source,
      r.destination

    FROM schedules s

    INNER JOIN buses b
      ON s.bus_id = b.id

    INNER JOIN drivers d
      ON s.driver_id = d.id

    INNER JOIN users u
      ON d.user_id = u.id

    INNER JOIN routes r
      ON s.route_id = r.id

    ORDER BY s.id DESC
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Get schedules error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not fetch schedules",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      schedules: results,
    });
  });
};

// ================= GET SINGLE SCHEDULE =================
exports.getScheduleById = (req, res) => {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Valid schedule ID is required",
    });
  }

  const query = `
    SELECT
      s.id,
      s.departure_time,
      s.arrival_time,
      s.return_departure_time,
      s.return_arrival_time,
      s.status,

      b.id AS bus_id,
      b.bus_number,
      b.bus_name,

      d.id AS driver_id,
      u.full_name AS driver_name,

      r.id AS route_id,
      r.route_name,
      r.source,
      r.destination

    FROM schedules s

    INNER JOIN buses b
      ON s.bus_id = b.id

    INNER JOIN drivers d
      ON s.driver_id = d.id

    INNER JOIN users u
      ON d.user_id = u.id

    INNER JOIN routes r
      ON s.route_id = r.id

    WHERE s.id = ?
    LIMIT 1
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Get schedule error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not fetch schedule",
        error: error.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    return res.status(200).json({
      success: true,
      schedule: results[0],
    });
  });
};

// ================= UPDATE SCHEDULE =================
exports.updateSchedule = (req, res) => {
  const { id } = req.params;

  const {
    bus_id,
    driver_id,
    route_id,
    departure_time,
    arrival_time,
    return_departure_time,
    return_arrival_time,
    status,
  } = req.body;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Valid schedule ID is required",
    });
  }

  if (
    !bus_id ||
    !driver_id ||
    !route_id ||
    !departure_time ||
    !arrival_time ||
    !status
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Bus, driver, route, morning departure, morning arrival and status are required",
    });
  }

  const allowedStatuses = ["active", "inactive"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid schedule status",
    });
  }

  const query = `
    UPDATE schedules
    SET
      bus_id = ?,
      driver_id = ?,
      route_id = ?,
      departure_time = ?,
      arrival_time = ?,
      return_departure_time = ?,
      return_arrival_time = ?,
      status = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      bus_id,
      driver_id,
      route_id,
      departure_time,
      arrival_time,
      return_departure_time || null,
      return_arrival_time || null,
      status,
      id,
    ],
    (error, result) => {
      if (error) {
        console.error("Update schedule error:", error);

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({
            success: false,
            message: "Bus, driver or route ID is invalid",
          });
        }

        return res.status(500).json({
          success: false,
          message: "Could not update schedule",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Schedule not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Schedule updated successfully",
      });
    }
  );
};

// ================= DELETE SCHEDULE =================
exports.deleteSchedule = (req, res) => {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Valid schedule ID is required",
    });
  }

  db.query(
    "DELETE FROM schedules WHERE id = ?",
    [id],
    (error, result) => {
      if (error) {
        console.error("Delete schedule error:", error);

        return res.status(500).json({
          success: false,
          message: "Could not delete schedule",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Schedule not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Schedule deleted successfully",
      });
    }
  );
};