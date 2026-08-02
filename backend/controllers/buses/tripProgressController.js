const db = require("../../db");

function validateBusId(busId) {
  const numericBusId = Number(busId);

  if (!Number.isInteger(numericBusId) || numericBusId <= 0) {
    return null;
  }

  return numericBusId;
}

// Active schedule, route and current trip details
function getBusTripDetails(busId, callback) {
  const query = `
    SELECT
      b.id AS bus_id,
      b.bus_number,
      b.current_stop_id,
      b.trip_status,
      b.trip_direction,

      s.id AS schedule_id,
      s.route_id,

      r.route_name,
      r.source,
      r.destination

    FROM buses b

    LEFT JOIN schedules s
      ON s.id = (
        SELECT s2.id
        FROM schedules s2
        WHERE s2.bus_id = b.id
          AND s2.status = 'active'
        ORDER BY s2.id DESC
        LIMIT 1
      )

    LEFT JOIN routes r
      ON s.route_id = r.id

    WHERE b.id = ?
    LIMIT 1
  `;

  db.query(query, [busId], callback);
}

// ================= GET TRIP PROGRESS =================
exports.getTripProgress = (req, res) => {
  const numericBusId = validateBusId(req.params.busId);

  if (!numericBusId) {
    return res.status(400).json({
      success: false,
      message: "Valid bus ID is required",
    });
  }

  getBusTripDetails(numericBusId, (busError, busResults) => {
    if (busError) {
      console.error("Get bus trip details error:", busError);

      return res.status(500).json({
        success: false,
        message: "Could not fetch trip details",
      });
    }

    if (busResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const trip = busResults[0];

    if (!trip.route_id) {
      return res.status(404).json({
        success: false,
        message: "No active route is assigned to this bus",
      });
    }

    const stopsQuery = `
      SELECT
        id,
        route_id,
        stop_name,
        stop_order,
        latitude,
        longitude,
        estimated_time,
        is_boarding,
        is_drop
      FROM route_stops
      WHERE route_id = ?
      ORDER BY stop_order ASC
    `;

    db.query(stopsQuery, [trip.route_id], (stopsError, stops) => {
      if (stopsError) {
        console.error("Get trip stops error:", stopsError);

        return res.status(500).json({
          success: false,
          message: "Could not fetch route stops",
        });
      }

      const currentIndex = stops.findIndex(
        (stop) => Number(stop.id) === Number(trip.current_stop_id)
      );

      let currentStop = null;
      let nextStop = null;
      let completedStops = [];
      let remainingStops = [];

      if (currentIndex >= 0) {
        currentStop = stops[currentIndex];

        if (trip.trip_direction === "reverse") {
          nextStop =
            currentIndex > 0 ? stops[currentIndex - 1] : null;

          completedStops = stops.slice(currentIndex + 1).reverse();
          remainingStops = stops.slice(0, currentIndex).reverse();
        } else {
          nextStop =
            currentIndex < stops.length - 1
              ? stops[currentIndex + 1]
              : null;

          completedStops = stops.slice(0, currentIndex);
          remainingStops = stops.slice(currentIndex + 1);
        }
      } else {
        remainingStops =
          trip.trip_direction === "reverse"
            ? [...stops].reverse()
            : stops;
      }

      return res.status(200).json({
        success: true,
        trip: {
          bus_id: trip.bus_id,
          bus_number: trip.bus_number,
          schedule_id: trip.schedule_id,
          route_id: trip.route_id,
          route_name: trip.route_name,
          source: trip.source,
          destination: trip.destination,
          trip_status: trip.trip_status,
          trip_direction: trip.trip_direction,
          current_stop: currentStop,
          next_stop: nextStop,
          completed_stops: completedStops,
          remaining_stops: remainingStops,
          all_stops: stops,
        },
      });
    });
  });
};

// ================= START TRIP =================
exports.startTrip = (req, res) => {
  const numericBusId = validateBusId(req.params.busId);

  if (!numericBusId) {
    return res.status(400).json({
      success: false,
      message: "Valid bus ID is required",
    });
  }

  const direction =
    req.body.trip_direction === "reverse"
      ? "reverse"
      : "forward";

  getBusTripDetails(numericBusId, (busError, busResults) => {
    if (busError) {
      console.error("Start trip bus error:", busError);

      return res.status(500).json({
        success: false,
        message: "Could not fetch bus details",
      });
    }

    if (busResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const trip = busResults[0];

    if (!trip.route_id) {
      return res.status(400).json({
        success: false,
        message: "No active route is assigned to this bus",
      });
    }

    const orderDirection =
      direction === "reverse" ? "DESC" : "ASC";

    const firstStopQuery = `
      SELECT id, stop_name, stop_order
      FROM route_stops
      WHERE route_id = ?
      ORDER BY stop_order ${orderDirection}
      LIMIT 1
    `;

    db.query(
      firstStopQuery,
      [trip.route_id],
      (stopError, stopResults) => {
        if (stopError) {
          console.error("Start trip stop error:", stopError);

          return res.status(500).json({
            success: false,
            message: "Could not fetch first route stop",
          });
        }

        if (stopResults.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Add route stops before starting the trip",
          });
        }

        const firstStop = stopResults[0];

        const updateQuery = `
          UPDATE buses
          SET
            current_stop_id = ?,
            trip_status = 'running',
            trip_direction = ?
          WHERE id = ?
        `;

        db.query(
          updateQuery,
          [firstStop.id, direction, numericBusId],
          (updateError) => {
            if (updateError) {
              console.error("Start trip update error:", updateError);

              return res.status(500).json({
                success: false,
                message: "Could not start trip",
              });
            }

            return res.status(200).json({
              success: true,
              message: "Trip started successfully",
              current_stop: firstStop,
              trip_status: "running",
              trip_direction: direction,
            });
          }
        );
      }
    );
  });
};

// ================= ADVANCE TO NEXT STOP =================
exports.advanceToNextStop = (req, res) => {
  const numericBusId = validateBusId(req.params.busId);

  if (!numericBusId) {
    return res.status(400).json({
      success: false,
      message: "Valid bus ID is required",
    });
  }

  getBusTripDetails(numericBusId, (busError, busResults) => {
    if (busError) {
      console.error("Advance trip bus error:", busError);

      return res.status(500).json({
        success: false,
        message: "Could not fetch bus trip",
      });
    }

    if (busResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    const trip = busResults[0];

    if (trip.trip_status !== "running") {
      return res.status(400).json({
        success: false,
        message: "Start the trip before advancing stops",
      });
    }

    if (!trip.current_stop_id || !trip.route_id) {
      return res.status(400).json({
        success: false,
        message: "Current stop or route is not available",
      });
    }

    const currentStopQuery = `
      SELECT id, stop_order
      FROM route_stops
      WHERE id = ?
        AND route_id = ?
      LIMIT 1
    `;

    db.query(
      currentStopQuery,
      [trip.current_stop_id, trip.route_id],
      (currentError, currentResults) => {
        if (currentError) {
          console.error("Current stop error:", currentError);

          return res.status(500).json({
            success: false,
            message: "Could not fetch current stop",
          });
        }

        if (currentResults.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Current route stop was not found",
          });
        }

        const currentStop = currentResults[0];

        const isReverse = trip.trip_direction === "reverse";
        const comparison = isReverse ? "<" : ">";
        const orderDirection = isReverse ? "DESC" : "ASC";

        const nextStopQuery = `
          SELECT
            id,
            stop_name,
            stop_order,
            estimated_time
          FROM route_stops
          WHERE route_id = ?
            AND stop_order ${comparison} ?
          ORDER BY stop_order ${orderDirection}
          LIMIT 1
        `;

        db.query(
          nextStopQuery,
          [trip.route_id, currentStop.stop_order],
          (nextError, nextResults) => {
            if (nextError) {
              console.error("Next stop error:", nextError);

              return res.status(500).json({
                success: false,
                message: "Could not fetch next stop",
              });
            }

            if (nextResults.length === 0) {
              const completeQuery = `
                UPDATE buses
                SET
                  trip_status = 'completed',
                  status = 'idle'
                WHERE id = ?
              `;

              return db.query(
                completeQuery,
                [numericBusId],
                (completeError) => {
                  if (completeError) {
                    console.error(
                      "Complete trip error:",
                      completeError
                    );

                    return res.status(500).json({
                      success: false,
                      message: "Could not complete trip",
                    });
                  }

                  return res.status(200).json({
                    success: true,
                    message:
                      "Final stop reached. Trip completed successfully.",
                    trip_status: "completed",
                    current_stop_id: trip.current_stop_id,
                    next_stop: null,
                  });
                }
              );
            }

            const nextStop = nextResults[0];

            const updateQuery = `
              UPDATE buses
              SET current_stop_id = ?
              WHERE id = ?
            `;

            db.query(
              updateQuery,
              [nextStop.id, numericBusId],
              (updateError) => {
                if (updateError) {
                  console.error(
                    "Advance stop update error:",
                    updateError
                  );

                  return res.status(500).json({
                    success: false,
                    message: "Could not advance to next stop",
                  });
                }

                return res.status(200).json({
                  success: true,
                  message: `Bus advanced to ${nextStop.stop_name}`,
                  trip_status: "running",
                  current_stop: nextStop,
                });
              }
            );
          }
        );
      }
    );
  });
};

// ================= END TRIP =================
exports.endTrip = (req, res) => {
  const numericBusId = validateBusId(req.params.busId);

  if (!numericBusId) {
    return res.status(400).json({
      success: false,
      message: "Valid bus ID is required",
    });
  }

  const query = `
    UPDATE buses
    SET
      trip_status = 'completed',
      status = 'idle'
    WHERE id = ?
  `;

  db.query(query, [numericBusId], (error, result) => {
    if (error) {
      console.error("End trip error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not end trip",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip ended successfully",
      trip_status: "completed",
    });
  });
};

// ================= RESET TRIP =================
exports.resetTrip = (req, res) => {
  const numericBusId = validateBusId(req.params.busId);

  if (!numericBusId) {
    return res.status(400).json({
      success: false,
      message: "Valid bus ID is required",
    });
  }

  const query = `
    UPDATE buses
    SET
      current_stop_id = NULL,
      trip_status = 'not_started',
      trip_direction = 'forward',
      status = 'idle'
    WHERE id = ?
  `;

  db.query(query, [numericBusId], (error, result) => {
    if (error) {
      console.error("Reset trip error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not reset trip",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Trip reset successfully",
      trip_status: "not_started",
    });
  });
};