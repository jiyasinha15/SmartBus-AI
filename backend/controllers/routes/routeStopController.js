const db = require("../../db");

// ================= CREATE ROUTE STOP =================
exports.createRouteStop = (req, res) => {
  const {
    route_id,
    stop_name,
    stop_order,
    latitude,
    longitude,
    estimated_time,
    is_boarding = 1,
    is_drop = 1,
  } = req.body;

  if (!route_id || !stop_name || stop_order === undefined) {
    return res.status(400).json({
      success: false,
      message: "Route, stop name and stop order are required",
    });
  }

  if (Number.isNaN(Number(route_id)) || Number.isNaN(Number(stop_order))) {
    return res.status(400).json({
      success: false,
      message: "Route ID and stop order must be valid numbers",
    });
  }

  db.query(
    "SELECT id FROM routes WHERE id = ?",
    [route_id],
    (routeError, routeResults) => {
      if (routeError) {
        console.error("Verify route error:", routeError);

        return res.status(500).json({
          success: false,
          message: "Could not verify route",
        });
      }

      if (routeResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Route not found",
        });
      }

      const duplicateOrderQuery = `
        SELECT id
        FROM route_stops
        WHERE route_id = ? AND stop_order = ?
      `;

      db.query(
        duplicateOrderQuery,
        [route_id, stop_order],
        (duplicateError, duplicateResults) => {
          if (duplicateError) {
            console.error("Check stop order error:", duplicateError);

            return res.status(500).json({
              success: false,
              message: "Could not verify stop order",
            });
          }

          if (duplicateResults.length > 0) {
            return res.status(409).json({
              success: false,
              message: "A stop with this order already exists on the route",
            });
          }

          const sql = `
            INSERT INTO route_stops
            (
              route_id,
              stop_name,
              stop_order,
              latitude,
              longitude,
              estimated_time,
              is_boarding,
              is_drop
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const values = [
            Number(route_id),
            stop_name.trim(),
            Number(stop_order),
            latitude !== undefined &&
            latitude !== null &&
            latitude !== ""
              ? Number(latitude)
              : null,
            longitude !== undefined &&
            longitude !== null &&
            longitude !== ""
              ? Number(longitude)
              : null,
            estimated_time || null,
            Number(is_boarding) ? 1 : 0,
            Number(is_drop) ? 1 : 0,
          ];

          db.query(sql, values, (error, result) => {
            if (error) {
              console.error("Create route stop error:", error);

              return res.status(500).json({
                success: false,
                message: "Could not create route stop",
              });
            }

            return res.status(201).json({
              success: true,
              message: "Route stop created successfully",
              stop_id: result.insertId,
            });
          });
        }
      );
    }
  );
};

// ================= GET ALL ROUTE STOPS =================
exports.getAllRouteStops = (req, res) => {
  const sql = `
    SELECT
      rs.id,
      rs.route_id,
      r.route_name,
      rs.stop_name,
      rs.stop_order,
      rs.latitude,
      rs.longitude,
      rs.estimated_time,
      rs.is_boarding,
      rs.is_drop,
      rs.created_at
    FROM route_stops rs
    INNER JOIN routes r
      ON rs.route_id = r.id
    ORDER BY rs.route_id ASC, rs.stop_order ASC
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Get all route stops error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not fetch route stops",
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      stops: results,
    });
  });
};

// ================= GET STOPS BY ROUTE ID =================
exports.getStopsByRouteId = (req, res) => {
  const { routeId } = req.params;

  if (!routeId || Number.isNaN(Number(routeId))) {
    return res.status(400).json({
      success: false,
      message: "Valid route ID is required",
    });
  }

  const sql = `
    SELECT
      rs.id,
      rs.route_id,
      r.route_name,
      rs.stop_name,
      rs.stop_order,
      rs.latitude,
      rs.longitude,
      rs.estimated_time,
      rs.is_boarding,
      rs.is_drop,
      rs.created_at
    FROM route_stops rs
    INNER JOIN routes r
      ON rs.route_id = r.id
    WHERE rs.route_id = ?
    ORDER BY rs.stop_order ASC
  `;

  db.query(sql, [routeId], (error, results) => {
    if (error) {
      console.error("Get route stops error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not fetch route stops",
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      stops: results,
    });
  });
};

// ================= GET SINGLE ROUTE STOP =================
exports.getRouteStopById = (req, res) => {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Valid route stop ID is required",
    });
  }

  const sql = `
    SELECT
      rs.id,
      rs.route_id,
      r.route_name,
      rs.stop_name,
      rs.stop_order,
      rs.latitude,
      rs.longitude,
      rs.estimated_time,
      rs.is_boarding,
      rs.is_drop,
      rs.created_at
    FROM route_stops rs
    INNER JOIN routes r
      ON rs.route_id = r.id
    WHERE rs.id = ?
  `;

  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error("Get route stop error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not fetch route stop",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Route stop not found",
      });
    }

    return res.status(200).json({
      success: true,
      stop: results[0],
    });
  });
};

// ================= UPDATE ROUTE STOP =================
exports.updateRouteStop = (req, res) => {
  const { id } = req.params;

  const {
    route_id,
    stop_name,
    stop_order,
    latitude,
    longitude,
    estimated_time,
    is_boarding = 1,
    is_drop = 1,
  } = req.body;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Valid route stop ID is required",
    });
  }

  if (!route_id || !stop_name || stop_order === undefined) {
    return res.status(400).json({
      success: false,
      message: "Route, stop name and stop order are required",
    });
  }

  if (Number.isNaN(Number(route_id)) || Number.isNaN(Number(stop_order))) {
    return res.status(400).json({
      success: false,
      message: "Route ID and stop order must be valid numbers",
    });
  }

  db.query(
    "SELECT id FROM routes WHERE id = ?",
    [route_id],
    (routeError, routeResults) => {
      if (routeError) {
        console.error("Verify route error:", routeError);

        return res.status(500).json({
          success: false,
          message: "Could not verify route",
        });
      }

      if (routeResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Route not found",
        });
      }

      const duplicateOrderQuery = `
        SELECT id
        FROM route_stops
        WHERE route_id = ?
          AND stop_order = ?
          AND id != ?
      `;

      db.query(
        duplicateOrderQuery,
        [route_id, stop_order, id],
        (duplicateError, duplicateResults) => {
          if (duplicateError) {
            console.error("Check stop order error:", duplicateError);

            return res.status(500).json({
              success: false,
              message: "Could not verify stop order",
            });
          }

          if (duplicateResults.length > 0) {
            return res.status(409).json({
              success: false,
              message: "A stop with this order already exists on the route",
            });
          }

          const sql = `
            UPDATE route_stops
            SET
              route_id = ?,
              stop_name = ?,
              stop_order = ?,
              latitude = ?,
              longitude = ?,
              estimated_time = ?,
              is_boarding = ?,
              is_drop = ?
            WHERE id = ?
          `;

          const values = [
            Number(route_id),
            stop_name.trim(),
            Number(stop_order),
            latitude !== undefined &&
            latitude !== null &&
            latitude !== ""
              ? Number(latitude)
              : null,
            longitude !== undefined &&
            longitude !== null &&
            longitude !== ""
              ? Number(longitude)
              : null,
            estimated_time || null,
            Number(is_boarding) ? 1 : 0,
            Number(is_drop) ? 1 : 0,
            Number(id),
          ];

          db.query(sql, values, (error, result) => {
            if (error) {
              console.error("Update route stop error:", error);

              return res.status(500).json({
                success: false,
                message: "Could not update route stop",
              });
            }

            if (result.affectedRows === 0) {
              return res.status(404).json({
                success: false,
                message: "Route stop not found",
              });
            }

            return res.status(200).json({
              success: true,
              message: "Route stop updated successfully",
            });
          });
        }
      );
    }
  );
};

// ================= DELETE ROUTE STOP =================
exports.deleteRouteStop = (req, res) => {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: "Valid route stop ID is required",
    });
  }

  db.query(
    "DELETE FROM route_stops WHERE id = ?",
    [id],
    (error, result) => {
      if (error) {
        console.error("Delete route stop error:", error);

        return res.status(500).json({
          success: false,
          message: "Could not delete route stop",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Route stop not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Route stop deleted successfully",
      });
    }
  );
};