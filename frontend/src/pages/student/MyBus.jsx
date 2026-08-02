import {
  Bus,
  User,
  Phone,
  MapPinned,
  Clock,
  Users,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Navigation,
  Flag,
} from "lucide-react";
import { CircleUserRound } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import api from "../../services/api";

function formatTime(time) {
  if (!time) return "N/A";

  const value = String(time);

  if (value.includes("T") || value.includes(" ")) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  }

  const parts = value.split(":");

  if (parts.length >= 2) {
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
      !Number.isNaN(hours) &&
      !Number.isNaN(minutes)
    ) {
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
  if (!status) return "N/A";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem("user") ||
        localStorage.getItem("currentUser") ||
        "{}"
    );
  } catch (error) {
    console.error("Could not parse user:", error);
    return {};
  }
}

export default function MyBus() {
  const [busData, setBusData] = useState(null);
  const [tripData, setTripData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");
  const [tripError, setTripError] = useState("");

  const fetchTripProgress = useCallback(
    async (busId) => {
      if (!busId) {
        setTripData(null);
        return;
      }

      try {
        setTripError("");

        const response = await api.get(
          `/trip-progress/bus/${busId}`
        );

        if (
          response.data?.success &&
          response.data?.trip
        ) {
          setTripData(response.data.trip);
        } else {
          setTripData(null);
        }
      } catch (tripFetchError) {
        console.error(
          "My Bus trip progress error:",
          tripFetchError
        );

        if (tripFetchError.response?.status === 404) {
          setTripData(null);
        } else {
          setTripError(
            tripFetchError.response?.data?.message ||
              "Could not load current trip direction."
          );
        }
      }
    },
    []
  );

  const fetchMyBus = useCallback(
    async (showMainLoader = false) => {
      try {
        if (showMainLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const currentUser = getStoredUser();

        const userId =
          currentUser.student_id ||
          currentUser.studentId ||
          currentUser.user_id ||
          currentUser.id;

        if (!userId) {
          setError(
            "Student information was not found. Please log in again."
          );
          return;
        }

        const response = await api.get(
          `/student/dashboard/${userId}`
        );

        if (
          !response.data?.success ||
          !response.data?.dashboard
        ) {
          setError(
            response.data?.message ||
              "Unable to fetch assigned bus details."
          );
          return;
        }

        const dashboardData = response.data.dashboard;

        setBusData(dashboardData);

        if (dashboardData?.bus_id) {
          await fetchTripProgress(
            dashboardData.bus_id
          );
        } else {
          setTripData(null);
        }
      } catch (fetchError) {
        console.error("My Bus error:", fetchError);

        if (fetchError.response?.status === 401) {
          setError(
            "Your login session has expired. Please log in again."
          );
        } else if (
          fetchError.response?.status === 404
        ) {
          setError(
            fetchError.response?.data?.message ||
              "Student details were not found."
          );
        } else {
          setError(
            fetchError.response?.data?.message ||
              "Unable to load bus details. Please try again."
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
    fetchMyBus(true);

    const intervalId = setInterval(() => {
      fetchMyBus(false);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchMyBus]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl px-10 py-9 text-center">
          <RefreshCw
            size={42}
            className="mx-auto text-blue-600 animate-spin"
          />

          <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            Loading Bus Details
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Fetching your assigned bus and driver...
          </p>
        </div>
      </div>
    );
  }

  if (error && !busData) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-9 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <AlertCircle
              size={34}
              className="text-red-600 dark:text-red-400"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
            Bus Details Could Not Load
          </h2>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchMyBus(true)}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasAssignedBus = Boolean(busData?.bus_id);

  const driverPhone = busData?.driver_phone || "";

  const tripStatus =
    tripData?.trip_status || "not_started";

  const tripDirection =
    tripData?.trip_direction || "forward";

  const isReverse = tripDirection === "reverse";

  const displaySource = isReverse
    ? busData?.destination
    : busData?.source;

  const displayDestination = isReverse
    ? busData?.source
    : busData?.destination;

  const routePoints = [
    displaySource,
    displayDestination,
  ].filter(Boolean);

  const displayedDepartureTime = isReverse
    ? busData?.return_departure_time
    : busData?.departure_time;

  const displayedArrivalTime = isReverse
    ? busData?.return_arrival_time
    : busData?.arrival_time;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-[30px] p-8 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="text-4xl font-bold">
              🚌 My Bus
            </h1>

            <p className="mt-3 text-blue-100">
              {hasAssignedBus
                ? `Assigned Bus: ${busData.bus_number}`
                : "No bus has been assigned to you yet."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchMyBus(false)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-5 py-4 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {tripError && (
        <div className="rounded-2xl border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/40 px-5 py-4 text-orange-700 dark:text-orange-300">
          {tripError}
        </div>
      )}

      {!hasAssignedBus && (
        <div className="bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-3xl p-6 flex items-start gap-4">
          <AlertCircle
            className="text-yellow-600 shrink-0"
            size={28}
          />

          <div>
            <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-300">
              Bus Not Assigned
            </h2>

            <p className="mt-1 text-yellow-700 dark:text-yellow-200">
              Ask the administrator to assign a bus to your student account.
            </p>
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">
          <Bus size={38} />

          <p className="mt-5 opacity-90">
            Bus Number
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {busData?.bus_number || "Not Assigned"}
          </h2>

          <p className="mt-2 text-sm opacity-90">
            {busData?.bus_name || "No bus available"}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white shadow-xl">
          <Users size={38} />

          <p className="mt-5 opacity-90">
            Capacity
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {busData?.capacity
              ? `${busData.capacity} Seats`
              : "N/A"}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl">
          <Clock size={38} />

          <p className="mt-5 opacity-90">
            {isReverse
              ? "Return Departure"
              : "Departure Time"}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {formatTime(displayedDepartureTime)}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl">
          <ShieldCheck size={38} />

          <p className="mt-5 opacity-90">
            Trip Status
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {formatStatus(tripStatus)}
          </h2>

          <p className="mt-2 text-sm opacity-90">
            {isReverse
              ? "Evening Return"
              : "Forward Journey"}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-800 border-2 border-blue-500 flex items-center justify-center">
              <CircleUserRound
                size={38}
                className="text-slate-700 dark:text-slate-200"
              />
            </div>

            <h2 className="text-2xl font-bold mt-5 text-slate-900 dark:text-white">
              {busData?.driver_name ||
                "Not Assigned"}
            </h2>

            <p className="text-gray-500 dark:text-slate-400">
              Driver
            </p>
          </div>

          <div className="mt-8 space-y-5 text-slate-800 dark:text-slate-200">
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" />

              <span>
                {driverPhone
                  ? `+91 ${driverPhone}`
                  : "Phone not available"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <User className="text-green-600" />

              <span>
                Experience:{" "}
                {busData?.experience_years !==
                  null &&
                busData?.experience_years !==
                  undefined
                  ? `${busData.experience_years} years`
                  : "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="text-purple-600" />

              <span>
                License:{" "}
                {busData?.license_number || "N/A"}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={!driverPhone}
            onClick={() =>
              window.open(`tel:${driverPhone}`)
            }
            className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold transition hover:shadow-lg disabled:bg-none disabled:bg-slate-200 disabled:text-slate-700 disabled:cursor-not-allowed dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
          >
            {driverPhone
              ? "Contact Driver"
              : "Contact Unavailable"}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Route Details
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Direction changes automatically with the driver&apos;s trip.
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                isReverse
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              }`}
            >
              {isReverse
                ? "Reverse • Return"
                : "Forward Trip"}
            </span>
          </div>

          <div className="mb-7 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Route Name
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-800 dark:text-white">
              {busData?.route_name ||
                "Route not assigned"}
            </h3>
          </div>

          {routePoints.length > 0 ? (
            <div className="space-y-0">
              {routePoints.map((point, index) => (
                <div key={`${point}-${index}`}>
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-5 h-5 rounded-full shrink-0 ${
                        index === 0
                          ? "bg-blue-600"
                          : "bg-green-500"
                      }`}
                    ></div>

                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {index === 0
                          ? "Starting Point"
                          : "Destination"}
                      </p>

                      <span className="font-bold text-lg text-slate-800 dark:text-white">
                        {point}
                      </span>
                    </div>
                  </div>

                  {index !==
                    routePoints.length - 1 && (
                    <div className="ml-2 border-l-4 border-dashed border-blue-300 dark:border-blue-700 h-12"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-8 text-center text-slate-600 dark:text-slate-300">
              Route information is not available.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
          Today&apos;s Journey
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-6">
            <MapPinned className="text-blue-600" />

            <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">
              Departure
            </h3>

            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {formatTime(displayedDepartureTime)}
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-2xl p-6">
            <Bus className="text-green-600" />

            <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">
              Arrival
            </h3>

            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {formatTime(displayedArrivalTime)}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 rounded-2xl p-6">
            <Navigation className="text-purple-600" />

            <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">
              Current Stop
            </h3>

            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {tripData?.current_stop?.stop_name ||
                "Trip not started"}
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 rounded-2xl p-6">
            <Flag className="text-orange-600" />

            <h3 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">
              Next Stop
            </h3>

            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {tripData?.next_stop?.stop_name ||
                (tripStatus === "completed"
                  ? "Trip completed"
                  : "Not available")}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Active Direction
            </p>

            <p className="mt-1 font-bold text-slate-900 dark:text-white">
              {displaySource || "N/A"} →{" "}
              {displayDestination || "N/A"}
            </p>
          </div>

          <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {formatStatus(
              busData?.schedule_status
            )}
          </span>
        </div>
      </div>
    </div>
  );
}