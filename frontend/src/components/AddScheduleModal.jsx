import {
  AlertCircle,
  LoaderCircle,
  X,
  Sun,
  Moon,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

const EMPTY_SCHEDULE = {
  bus_id: "",
  driver_id: "",
  route_id: "",
  departure_time: "",
  arrival_time: "",
  return_departure_time: "",
  return_arrival_time: "",
  status: "active",
};

function formatTime(value) {
  if (!value) return "";
  return value.toString().slice(0, 5);
}

export default function AddScheduleModal({
  open,
  setOpen,
  editSchedule,
  setEditSchedule,
  buses,
  drivers,
  routes,
  onScheduleSaved,
}) {
  const [schedule, setSchedule] =
    useState(EMPTY_SCHEDULE);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (editSchedule) {
      setSchedule({
        bus_id:
          editSchedule.bus_id?.toString() || "",

        driver_id:
          editSchedule.driver_id?.toString() ||
          "",

        route_id:
          editSchedule.route_id?.toString() ||
          "",

        departure_time: formatTime(
          editSchedule.departure
        ),

        arrival_time: formatTime(
          editSchedule.arrival
        ),

        return_departure_time: formatTime(
          editSchedule.returnDeparture ||
            editSchedule.return_departure_time
        ),

        return_arrival_time: formatTime(
          editSchedule.returnArrival ||
            editSchedule.return_arrival_time
        ),

        status:
          editSchedule.status?.toLowerCase() ===
          "inactive"
            ? "inactive"
            : "active",
      });
    } else {
      setSchedule(EMPTY_SCHEDULE);
    }

    setError("");
  }, [editSchedule, open]);

  const availableBuses = useMemo(() => {
    return buses.filter((bus) => {
      const status =
        bus.status?.toLowerCase();

      return status !== "maintenance";
    });
  }, [buses]);

  const availableRoutes = useMemo(() => {
    return routes.filter((route) => {
      return (
        route.status?.toLowerCase() !==
        "inactive"
      );
    });
  }, [routes]);

  const selectedRoute = useMemo(() => {
    return availableRoutes.find(
      (route) =>
        Number(route.id) ===
        Number(schedule.route_id)
    );
  }, [availableRoutes, schedule.route_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSchedule((currentSchedule) => ({
      ...currentSchedule,
      [name]: value,
    }));

    setError("");
  };

  const handleClose = () => {
    if (saving) return;

    setSchedule(EMPTY_SCHEDULE);
    setError("");
    setEditSchedule(null);
    setOpen(false);
  };

  const validateSchedule = () => {
    if (!schedule.bus_id) {
      return "Please select a bus";
    }

    if (!schedule.driver_id) {
      return "Please select a driver";
    }

    if (!schedule.route_id) {
      return "Please select a route";
    }

    if (!schedule.departure_time) {
      return "Please select morning departure time";
    }

    if (!schedule.arrival_time) {
      return "Please select morning arrival time";
    }

    if (
      schedule.arrival_time <=
      schedule.departure_time
    ) {
      return "Morning arrival time must be after morning departure time";
    }

    if (
      Boolean(schedule.return_departure_time) !==
      Boolean(schedule.return_arrival_time)
    ) {
      return "Please enter both evening departure and evening arrival times";
    }

    if (
      schedule.return_departure_time &&
      schedule.return_arrival_time &&
      schedule.return_arrival_time <=
        schedule.return_departure_time
    ) {
      return "Evening arrival time must be after evening departure time";
    }

    return "";
  };

  const handleSave = async () => {
    const validationError =
      validateSchedule();

    if (validationError) {
      setError(validationError);
      return;
    }

    const requestBody = {
      bus_id: Number(schedule.bus_id),
      driver_id: Number(schedule.driver_id),
      route_id: Number(schedule.route_id),

      departure_time:
        schedule.departure_time,

      arrival_time:
        schedule.arrival_time,

      return_departure_time:
        schedule.return_departure_time || null,

      return_arrival_time:
        schedule.return_arrival_time || null,

      status: schedule.status,
    };

    try {
      setSaving(true);
      setError("");

      let response;

      if (editSchedule) {
        response = await api.put(
          `/schedules/${editSchedule.id}`,
          requestBody
        );
      } else {
        response = await api.post(
          "/schedules",
          requestBody
        );
      }

      alert(
        response.data?.message ||
          (editSchedule
            ? "Schedule updated successfully"
            : "Schedule created successfully")
      );

      if (onScheduleSaved) {
        await onScheduleSaved();
      }

      handleClose();
    } catch (requestError) {
      console.error(
        "Save schedule error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Could not save schedule"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="my-6 w-full max-w-[680px] rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-800">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {editSchedule
                ? "Edit Schedule"
                : "Add Schedule"}
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Set morning and evening trip timings.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-xl bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            <X size={22} />
          </button>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        <div className="space-y-5">
          <FieldLabel label="Bus">
            <select
              name="bus_id"
              value={schedule.bus_id}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            >
              <option value="">
                Select Bus
              </option>

              {availableBuses.map((bus) => (
                <option
                  key={bus.id}
                  value={bus.id}
                >
                  {bus.bus_number}
                  {bus.bus_name
                    ? ` - ${bus.bus_name}`
                    : ""}
                </option>
              ))}
            </select>

            {availableBuses.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                No available buses found.
              </p>
            )}
          </FieldLabel>

          <FieldLabel label="Driver">
            <select
              name="driver_id"
              value={schedule.driver_id}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            >
              <option value="">
                Select Driver
              </option>

              {drivers.map((driver) => (
                <option
                  key={driver.id}
                  value={driver.id}
                >
                  {driver.name}
                  {driver.email
                    ? ` - ${driver.email}`
                    : ""}
                </option>
              ))}
            </select>

            {drivers.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                No drivers found.
              </p>
            )}
          </FieldLabel>

          <FieldLabel label="Route">
            <select
              name="route_id"
              value={schedule.route_id}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            >
              <option value="">
                Select Route
              </option>

              {availableRoutes.map((route) => (
                <option
                  key={route.id}
                  value={route.id}
                >
                  {route.route_name}
                  {route.source &&
                  route.destination
                    ? ` (${route.source} → ${route.destination})`
                    : ""}
                </option>
              ))}
            </select>

            {availableRoutes.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                No active routes found.
              </p>
            )}
          </FieldLabel>

          {selectedRoute && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Morning route
                </p>

                <p className="mt-1 font-bold text-slate-900 dark:text-white">
                  {selectedRoute.source || "Source"} →{" "}
                  {selectedRoute.destination ||
                    "Destination"}
                </p>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950/30">
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  Evening route
                </p>

                <p className="mt-1 font-bold text-slate-900 dark:text-white">
                  {selectedRoute.destination ||
                    "Destination"}{" "}
                  → {selectedRoute.source || "Source"}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20">
            <div className="mb-4 flex items-center gap-3">
              <Sun className="text-orange-500" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Morning Trip
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Source to destination
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TimeField
                label="Morning Departure"
                name="departure_time"
                value={schedule.departure_time}
                onChange={handleChange}
                disabled={saving}
              />

              <TimeField
                label="Morning Arrival"
                name="arrival_time"
                value={schedule.arrival_time}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-purple-200 bg-purple-50/70 p-5 dark:border-purple-900 dark:bg-purple-950/20">
            <div className="mb-4 flex items-center gap-3">
              <Moon className="text-purple-600" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Evening Return Trip
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Destination back to source
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TimeField
                label="Evening Departure"
                name="return_departure_time"
                value={
                  schedule.return_departure_time
                }
                onChange={handleChange}
                disabled={saving}
              />

              <TimeField
                label="Evening Arrival"
                name="return_arrival_time"
                value={
                  schedule.return_arrival_time
                }
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>

          <FieldLabel label="Status">
            <select
              name="status"
              value={schedule.status}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </FieldLabel>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              availableBuses.length === 0 ||
              drivers.length === 0 ||
              availableRoutes.length === 0
            }
            className="flex min-w-[120px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {saving && (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            )}

            {saving
              ? "Saving..."
              : editSchedule
                ? "Update"
                : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function TimeField({
  label,
  name,
  value,
  onChange,
  disabled,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type="time"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
      />
    </div>
  );
}