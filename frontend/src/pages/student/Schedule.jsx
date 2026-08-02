import {
  CalendarDays,
  Clock,
  Bus,
  MapPinned,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  ArrowRight,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import api from "../../services/api";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem("user") ||
        localStorage.getItem("currentUser") ||
        "{}"
    );
  } catch (error) {
    console.error(
      "Could not parse logged-in user:",
      error
    );

    return {};
  }
}

function formatTime(time) {
  if (!time) return "N/A";

  const value = String(time);

  if (
    value.includes("T") ||
    value.includes(" ")
  ) {
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

export default function Schedule() {
  const [scheduleData, setScheduleData] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const fetchSchedule = useCallback(
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
              "Could not load bus schedule."
          );
          return;
        }

        setScheduleData(response.data.dashboard);
      } catch (fetchError) {
        console.error(
          "Student schedule error:",
          fetchError
        );

        if (fetchError.response?.status === 401) {
          setError(
            "Your login session has expired. Please log in again."
          );
        } else if (
          fetchError.response?.status === 404
        ) {
          setError(
            fetchError.response?.data?.message ||
              "Student schedule was not found."
          );
        } else {
          setError(
            fetchError.response?.data?.message ||
              "Unable to load schedule. Please try again."
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSchedule(true);
  }, [fetchSchedule]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl px-10 py-9 text-center">
          <RefreshCw
            size={42}
            className="mx-auto text-blue-600 animate-spin"
          />

          <h2 className="mt-5 text-2xl font-bold text-slate-800 dark:text-white">
            Loading Schedule
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Fetching your morning and evening bus timings...
          </p>
        </div>
      </div>
    );
  }

  if (error && !scheduleData) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-9 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
            <AlertCircle
              size={34}
              className="text-red-600 dark:text-red-400"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-800 dark:text-white">
            Schedule Could Not Load
          </h2>

          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchSchedule(true)}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasAssignedBus = Boolean(
    scheduleData?.bus_id
  );

  const hasActiveSchedule = Boolean(
    scheduleData?.schedule_id
  );

  const hasReturnSchedule = Boolean(
    scheduleData?.return_departure_time &&
      scheduleData?.return_arrival_time
  );

  const morningRouteText =
    scheduleData?.source &&
    scheduleData?.destination
      ? `${scheduleData.source} → ${scheduleData.destination}`
      : "Route information unavailable";

  const eveningRouteText =
    scheduleData?.source &&
    scheduleData?.destination
      ? `${scheduleData.destination} → ${scheduleData.source}`
      : "Return route information unavailable";

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-white/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <CalendarDays size={38} />
              Bus Schedule
            </h1>

            <p className="mt-3 text-blue-100">
              View your morning pickup and evening return schedule.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchSchedule(false)}
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
              Your schedule will become available after the administrator assigns a bus to your account.
            </p>
          </div>
        </div>
      )}

      {hasAssignedBus && !hasActiveSchedule && (
        <div className="bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-3xl p-6 flex items-start gap-4">
          <Clock
            className="text-orange-600 shrink-0"
            size={28}
          />

          <div>
            <h2 className="text-xl font-bold text-orange-800 dark:text-orange-300">
              Active Schedule Not Available
            </h2>

            <p className="mt-1 text-orange-700 dark:text-orange-200">
              A bus is assigned to you, but an active schedule has not been created yet.
            </p>
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">
          <Sun size={35} />

          <p className="mt-4 opacity-90">
            Morning Departure
          </p>

          <h2 className="text-3xl font-bold mt-1">
            {formatTime(
              scheduleData?.departure_time
            )}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white shadow-xl">
          <Bus size={35} />

          <p className="mt-4 opacity-90">
            Morning Arrival
          </p>

          <h2 className="text-3xl font-bold mt-1">
            {formatTime(
              scheduleData?.arrival_time
            )}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl">
          <Moon size={35} />

          <p className="mt-4 opacity-90">
            Evening Departure
          </p>

          <h2 className="text-3xl font-bold mt-1">
            {formatTime(
              scheduleData?.return_departure_time
            )}
          </h2>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl">
          <MapPinned size={35} />

          <p className="mt-4 opacity-90">
            Evening Arrival
          </p>

          <h2 className="text-3xl font-bold mt-1">
            {formatTime(
              scheduleData?.return_arrival_time
            )}
          </h2>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Assigned Route
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
              {scheduleData?.route_name ||
                "Route Not Assigned"}
            </h2>

            <div className="mt-4 space-y-2">
              <p className="flex items-center gap-2 text-blue-600 dark:text-blue-300">
                <Sun size={18} />
                {morningRouteText}
              </p>

              <p className="flex items-center gap-2 text-purple-600 dark:text-purple-300">
                <Moon size={18} />
                {eveningRouteText}
              </p>
            </div>
          </div>

          <span
            className={`px-5 py-2 rounded-full text-sm font-semibold ${
              scheduleData?.schedule_status ===
              "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {formatStatus(
              scheduleData?.schedule_status
            )}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
              <Sun size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Morning Trip
              </h2>

              <p className="text-slate-500 dark:text-slate-400">
                Home side to university
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <JourneyRow
              label="Route"
              value={morningRouteText}
            />

            <JourneyRow
              label="Departure"
              value={formatTime(
                scheduleData?.departure_time
              )}
            />

            <JourneyRow
              label="Arrival"
              value={formatTime(
                scheduleData?.arrival_time
              )}
            />

            <JourneyRow
              label="Bus"
              value={
                scheduleData?.bus_number || "N/A"
              }
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
              <Moon size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Evening Return
              </h2>

              <p className="text-slate-500 dark:text-slate-400">
                University back to home side
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <JourneyRow
              label="Route"
              value={eveningRouteText}
            />

            <JourneyRow
              label="Departure"
              value={formatTime(
                scheduleData?.return_departure_time
              )}
            />

            <JourneyRow
              label="Arrival"
              value={formatTime(
                scheduleData?.return_arrival_time
              )}
            />

            <JourneyRow
              label="Status"
              value={
                hasReturnSchedule
                  ? "Scheduled"
                  : "Not Scheduled"
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Weekly Schedule
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monday to Friday morning and evening transportation schedule
          </p>
        </div>

        <div className="p-6 grid gap-5 xl:grid-cols-2">
          {weekDays.map((day) => {
            const isHoliday =
              day === "Saturday" ||
              day === "Sunday";

            const isAvailable =
              !isHoliday &&
              hasAssignedBus &&
              hasActiveSchedule;

            return (
              <div
                key={day}
                className={`rounded-3xl border p-5 ${
                  isHoliday
                    ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                    : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {day}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isHoliday
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        : isAvailable
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}
                  >
                    {isHoliday
                      ? "Holiday"
                      : isAvailable
                        ? "Scheduled"
                        : "Unavailable"}
                  </span>
                </div>

                {!isHoliday && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/30">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Sun size={18} />
                        <span className="font-semibold">
                          Morning
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {isAvailable
                          ? morningRouteText
                          : "Not available"}
                      </p>

                      <div className="mt-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        {isAvailable
                          ? formatTime(
                              scheduleData?.departure_time
                            )
                          : "--"}

                        <ArrowRight size={17} />

                        {isAvailable
                          ? formatTime(
                              scheduleData?.arrival_time
                            )
                          : "--"}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-purple-50 p-4 dark:bg-purple-950/30">
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <Moon size={18} />
                        <span className="font-semibold">
                          Evening
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                        {isAvailable
                          ? eveningRouteText
                          : "Not available"}
                      </p>

                      <div className="mt-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        {isAvailable &&
                        hasReturnSchedule
                          ? formatTime(
                              scheduleData?.return_departure_time
                            )
                          : "--"}

                        <ArrowRight size={17} />

                        {isAvailable &&
                        hasReturnSchedule
                          ? formatTime(
                              scheduleData?.return_arrival_time
                            )
                          : "--"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-3xl p-6 flex gap-4">
        <CheckCircle
          className="text-green-600 mt-1 shrink-0"
        />

        <div>
          <h3 className="font-bold text-lg text-green-800 dark:text-green-300">
            Important Notice
          </h3>

          <p className="text-gray-600 dark:text-slate-300 mt-2">
            Please reach your pickup point at least
            <span className="font-semibold text-green-700 dark:text-green-300">
              {" "}
              5 minutes{" "}
            </span>
            before the scheduled departure time.
          </p>
        </div>
      </div>
    </div>
  );
}

function JourneyRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0 dark:border-slate-700">
      <span className="text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="max-w-[65%] text-right font-bold text-slate-900 dark:text-white">
        {value || "N/A"}
      </span>
    </div>
  );
}