import {
  Bus,
  MapPinned,
  CheckCircle,
  Clock,
  User,
  Phone,
  Navigation,
  Mail,
  RefreshCw,
  AlertCircle,
  Route,
  Gauge,
  Star,
  Play,
  SkipForward,
  Square,
  RotateCcw,
  Flag,
  ListOrdered,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

function getStoredUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("currentUser") || "null") ||
      JSON.parse(localStorage.getItem("user") || "null") ||
      {}
    );
  } catch (error) {
    console.error("Could not read logged-in user:", error);
    return {};
  }
}

function formatTime(time) {
  if (!time) return "N/A";

  const value = String(time);
  const parts = value.split(":");

  if (parts.length >= 2) {
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  return value;
}

function formatStatus(status) {
  if (!status) return "Not Available";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getTripStatusClasses(status) {
  switch (status) {
    case "running":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "completed":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "paused":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  }
}

export default function DriverDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [trip, setTrip] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tripLoading, setTripLoading] = useState(false);

  const [error, setError] = useState("");
  const [tripError, setTripError] = useState("");

  const fetchTripProgress = useCallback(async (busId) => {
    if (!busId) {
      setTrip(null);
      return;
    }

    try {
      setTripError("");

      const response = await api.get(
        `/trip-progress/bus/${busId}`
      );

      if (response.data?.success && response.data?.trip) {
        setTrip(response.data.trip);
      } else {
        setTrip(null);
      }
    } catch (fetchError) {
      console.error("Trip progress error:", fetchError);

      if (fetchError.response?.status === 404) {
        setTrip(null);
      } else {
        setTripError(
          fetchError.response?.data?.message ||
            "Could not load live trip progress."
        );
      }
    }
  }, []);

  const fetchDashboard = useCallback(
    async (showMainLoader = false) => {
      try {
        if (showMainLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const currentUser = getStoredUser();

        if (!currentUser?.id && !currentUser?.email) {
          setError(
            "Logged-in driver details were not found. Please log out and log in again."
          );
          return;
        }

        let driverId =
          currentUser.driver_id ||
          currentUser.driverId ||
          null;

        if (!driverId) {
          const driversResponse = await api.get("/drivers");

          const drivers =
            driversResponse.data?.drivers ||
            driversResponse.data?.data ||
            (Array.isArray(driversResponse.data)
              ? driversResponse.data
              : []);

          const matchedDriver = drivers.find((driver) => {
            const userIdMatches =
              currentUser.id &&
              Number(driver.user_id) === Number(currentUser.id);

            const emailMatches =
              currentUser.email &&
              driver.email &&
              driver.email.toLowerCase() ===
                currentUser.email.toLowerCase();

            return userIdMatches || emailMatches;
          });

          if (!matchedDriver) {
            setError(
              "Your driver profile was not found in the drivers table."
            );
            return;
          }

          driverId = matchedDriver.id;
        }

        const response = await api.get(
          `/driver/dashboard/${driverId}`
        );

        if (
          !response.data?.success ||
          !response.data?.dashboard
        ) {
          setError(
            response.data?.message ||
              "Could not load driver dashboard."
          );
          return;
        }

        const dashboardData = response.data.dashboard;
        setDashboard(dashboardData);

        if (dashboardData?.bus_id) {
          await fetchTripProgress(dashboardData.bus_id);
        } else {
          setTrip(null);
        }
      } catch (fetchError) {
        console.error("Driver dashboard error:", fetchError);

        if (fetchError.response?.status === 401) {
          setError(
            "Your login session has expired. Please log in again."
          );
        } else if (fetchError.response?.status === 404) {
          setError(
            fetchError.response?.data?.message ||
              "Driver dashboard data was not found."
          );
        } else {
          setError(
            fetchError.response?.data?.message ||
              "Unable to load driver dashboard."
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchTripProgress]
  );

  useEffect(() => {
    fetchDashboard(true);
  }, [fetchDashboard]);

  const runTripAction = async (action, body = {}) => {
    const busId = dashboard?.bus_id;

    if (!busId) {
      setTripError("No bus is assigned to this driver.");
      return;
    }

    try {
      setTripLoading(true);
      setTripError("");

      const response = await api.post(
        `/trip-progress/bus/${busId}/${action}`,
        body
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Trip action failed."
        );
      }

      await Promise.all([
        fetchTripProgress(busId),
        fetchDashboard(false),
      ]);
    } catch (actionError) {
      console.error(`Trip ${action} error:`, actionError);

      setTripError(
        actionError.response?.data?.message ||
          actionError.message ||
          "Could not update trip progress."
      );
    } finally {
      setTripLoading(false);
    }
  };

  const handleStartTrip = async (direction) => {
    await runTripAction("start", {
      trip_direction: direction,
    });
  };

  const handleAdvanceStop = async () => {
    await runTripAction("next");
  };

  const handleEndTrip = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to end this trip?"
    );

    if (!confirmed) return;

    await runTripAction("end");
  };

  const handleResetTrip = async () => {
    const confirmed = window.confirm(
      "Reset trip progress and clear the current stop?"
    );

    if (!confirmed) return;

    await runTripAction("reset");
  };

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl px-10 py-9 text-center">
          <RefreshCw
            size={42}
            className="mx-auto text-blue-600 animate-spin"
          />

          <h2 className="mt-5 text-2xl font-bold text-slate-800 dark:text-white">
            Loading Driver Dashboard
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Fetching assigned bus and route...
          </p>
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-9 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <AlertCircle
              size={34}
              className="text-red-600 dark:text-red-400"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-800 dark:text-white">
            Dashboard Could Not Load
          </h2>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchDashboard(true)}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalTrips = Number(dashboard?.total_trips || 0);
  const totalDistance = Number(dashboard?.total_distance || 0);
  const rating = Number(dashboard?.rating || 0);

  const routeDescription =
    dashboard?.source && dashboard?.destination
      ? `${dashboard.source} → ${dashboard.destination}`
      : "Route not assigned";

  const tripStatus = trip?.trip_status || "not_started";
  const currentStop = trip?.current_stop;
  const nextStop = trip?.next_stop;
  const remainingStops = trip?.remaining_stops || [];
  const completedStops = trip?.completed_stops || [];
  const allStops = trip?.all_stops || [];

  const canStart =
    Boolean(dashboard?.bus_id) &&
    Boolean(dashboard?.route_id) &&
    tripStatus !== "running";

  const canAdvance =
    tripStatus === "running" && Boolean(currentStop);

  const canEnd = tripStatus === "running";

  const canReset =
    tripStatus === "completed" ||
    tripStatus === "paused" ||
    Boolean(currentStop);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="text-4xl font-bold">
              👋 Welcome, {dashboard?.driver_name || "Driver"}
            </h1>

            <p className="mt-3 text-blue-100">
              Have a safe journey. Here is today&apos;s trip overview.
            </p>
          </div>

          <button
            type="button"
            disabled={refreshing}
            onClick={() => fetchDashboard(false)}
            className="flex items-center gap-2 rounded-xl bg-slate-900/90 px-5 py-3 text-white font-semibold hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-100 dark:bg-red-950/40 px-5 py-4 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {tripError && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-100 dark:bg-red-950/40 px-5 py-4 text-red-700 dark:text-red-300">
          {tripError}
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">
          <Bus size={36} />
          <p className="mt-4 text-white/80">Assigned Bus</p>
          <h2 className="text-3xl font-bold mt-2">
            {dashboard?.bus_number || "Not Assigned"}
          </h2>
          <p className="mt-2 text-sm text-white/80">
            {dashboard?.bus_name || "No bus assigned"}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white shadow-xl">
          <Route size={36} />
          <p className="mt-4 text-white/80">Assigned Route</p>
          <h2 className="text-2xl font-bold mt-2">
            {dashboard?.route_name || "Not Assigned"}
          </h2>
          <p className="mt-2 text-sm text-white/80">
            {routeDescription}
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl">
          <Clock size={36} />
          <p className="mt-4 text-white/80">Departure Time</p>
          <h2 className="text-3xl font-bold mt-2">
            {formatTime(dashboard?.departure_time)}
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Arrival: {formatTime(dashboard?.arrival_time)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl">
          <CheckCircle size={36} />
          <p className="mt-4 text-white/80">Trip Status</p>
          <h2 className="text-2xl font-bold mt-2">
            {formatStatus(tripStatus)}
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Direction: {formatStatus(trip?.trip_direction)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Navigation className="text-purple-600" size={30} />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Live Trip Controls
              </h2>
            </div>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Start the trip, move through route stops, or finish the journey.
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${getTripStatusClasses(
              tripStatus
            )}`}
          >
            {formatStatus(tripStatus)}
          </span>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <button
            type="button"
            onClick={() => handleStartTrip("forward")}
            disabled={!canStart || tripLoading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play size={20} />
            Start Forward
          </button>

          <button
            type="button"
            onClick={() => handleStartTrip("reverse")}
            disabled={!canStart || tripLoading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-4 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={20} />
            Start Return
          </button>

          <button
            type="button"
            onClick={handleAdvanceStop}
            disabled={!canAdvance || tripLoading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SkipForward size={20} />
            Next Stop
          </button>

          <button
            type="button"
            onClick={handleEndTrip}
            disabled={!canEnd || tripLoading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Square size={20} />
            End Trip
          </button>

          <button
            type="button"
            onClick={handleResetTrip}
            disabled={!canReset || tripLoading}
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-700 px-5 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={20} />
            Reset Trip
          </button>
        </div>

        {tripLoading && (
          <div className="mt-5 flex items-center gap-3 text-sm font-medium text-blue-600 dark:text-blue-400">
            <RefreshCw className="animate-spin" size={18} />
            Updating trip progress...
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3">
            <MapPinned className="text-green-600" size={30} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Current Stop
            </h2>
          </div>

          <div className="mt-6 rounded-2xl bg-green-50 p-6 dark:bg-green-950/30">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
              Bus is currently at
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {currentStop?.stop_name || "Trip not started"}
            </h3>

            <p className="mt-3 text-slate-600 dark:text-slate-300">
              {currentStop?.estimated_time
                ? `Scheduled time: ${formatTime(
                    currentStop.estimated_time
                  )}`
                : "No stop time available"}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3">
            <Flag className="text-blue-600" size={30} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Next Stop
            </h2>
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50 p-6 dark:bg-blue-950/30">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
              Upcoming stop
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {nextStop?.stop_name ||
                (tripStatus === "completed"
                  ? "Trip Completed"
                  : "Not available")}
            </h3>

            <p className="mt-3 text-slate-600 dark:text-slate-300">
              {nextStop?.estimated_time
                ? `Scheduled time: ${formatTime(
                    nextStop.estimated_time
                  )}`
                : "No upcoming stop time available"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Completed Stops
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {completedStops.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                No stops completed yet.
              </p>
            ) : (
              completedStops.map((stop) => (
                <div
                  key={stop.id}
                  className="flex items-center justify-between rounded-2xl bg-green-50 px-5 py-4 dark:bg-green-950/30"
                >
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {stop.stop_name}
                  </span>
                  <CheckCircle
                    className="text-green-600"
                    size={20}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3">
            <ListOrdered className="text-purple-600" size={28} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Remaining Stops
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {remainingStops.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                {tripStatus === "completed"
                  ? "No stops remaining."
                  : allStops.length === 0
                  ? "No route stops have been added."
                  : "Start the trip to load remaining stops."}
              </p>
            ) : (
              remainingStops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="flex items-center gap-4 rounded-2xl bg-purple-50 px-5 py-4 dark:bg-purple-950/30"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {stop.stop_name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {stop.estimated_time
                        ? formatTime(stop.estimated_time)
                        : "Time not set"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
            Today&apos;s Journey
          </h2>

          <div className="space-y-5 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between gap-5">
              <span className="text-slate-500 dark:text-slate-400">
                Departure
              </span>
              <span className="font-bold text-right">
                {formatTime(dashboard?.departure_time)}
              </span>
            </div>

            <div className="flex justify-between gap-5">
              <span className="text-slate-500 dark:text-slate-400">
                Arrival
              </span>
              <span className="font-bold text-right">
                {formatTime(dashboard?.arrival_time)}
              </span>
            </div>

            <div className="flex justify-between gap-5">
              <span className="text-slate-500 dark:text-slate-400">
                Route
              </span>
              <span className="font-bold text-right max-w-[260px]">
                {dashboard?.route_name || "Not Assigned"}
              </span>
            </div>

            <div className="flex justify-between gap-5">
              <span className="text-slate-500 dark:text-slate-400">
                Starting Point
              </span>
              <span className="font-bold text-right max-w-[260px]">
                {dashboard?.source || "Not Available"}
              </span>
            </div>

            <div className="flex justify-between gap-5">
              <span className="text-slate-500 dark:text-slate-400">
                Destination
              </span>
              <span className="font-bold text-right max-w-[260px]">
                {dashboard?.destination || "Not Available"}
              </span>
            </div>

            <div className="flex justify-between gap-5">
              <span className="text-slate-500 dark:text-slate-400">
                Bus Status
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {formatStatus(dashboard?.bus_status)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
              <User size={50} className="text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {dashboard?.driver_name || "Driver"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Bus Driver
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5 text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <Phone className="text-green-600" />
              <span>{dashboard?.phone || "N/A"}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <span className="break-all">
                {dashboard?.email || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Navigation className="text-purple-600" />
              <span>
                License No:{" "}
                {dashboard?.license_number || "Not Added"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Bus className="text-orange-500" />
              <span>
                Assigned Bus:{" "}
                {dashboard?.bus_number || "Not Assigned"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <Gauge className="text-orange-500" size={30} />
          <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">
            Total Trips
          </h3>
          <p className="mt-2 text-3xl font-bold text-slate-700 dark:text-slate-200">
            {totalTrips}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Trips completed by the driver
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <MapPinned className="text-green-600" size={30} />
          <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">
            Total Distance
          </h3>
          <p className="mt-2 text-3xl font-bold text-slate-700 dark:text-slate-200">
            {totalDistance.toFixed(1)} km
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Distance covered by the driver
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          <Star className="text-yellow-500" size={30} />
          <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">
            Driver Rating
          </h3>
          <p className="mt-2 text-3xl font-bold text-slate-700 dark:text-slate-200">
            {rating.toFixed(1)} / 5
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Current performance rating
          </p>
        </div>
      </div>
    </div>
  );
}