import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Route,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  LoaderCircle,
  MapPin,
  Clock3,
  Ruler,
  Search,
  ListOrdered,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ROUTES_API = `${API_BASE}/routes`;
const STOPS_API = `${API_BASE}/route-stops`;

const initialRouteForm = {
  route_name: "",
  source: "",
  destination: "",
  distance: "",
  estimated_time: "",
  status: "active",
};

const initialStopForm = {
  stop_name: "",
  stop_order: "",
  estimated_time: "",
  latitude: "",
  longitude: "",
  is_boarding: true,
  is_drop: true,
};

function normalizeTime(value) {
  if (!value) return "";
  const text = String(value);
  return text.length >= 5 ? text.slice(0, 5) : text;
}

function formatTime(value) {
  if (!value) return "Not specified";

  const text = String(value);
  const [hoursText, minutesText] = text.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return text;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function parseApiData(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  return [];
}

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [routeForm, setRouteForm] = useState(initialRouteForm);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [viewRoute, setViewRoute] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [savingRoute, setSavingRoute] = useState(false);
  const [deletingRouteId, setDeletingRouteId] = useState(null);
  const [routeError, setRouteError] = useState("");

  const [selectedRouteForStops, setSelectedRouteForStops] = useState(null);
  const [stops, setStops] = useState([]);
  const [loadingStops, setLoadingStops] = useState(false);
  const [stopsError, setStopsError] = useState("");

  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [stopForm, setStopForm] = useState(initialStopForm);
  const [editingStopId, setEditingStopId] = useState(null);
  const [savingStop, setSavingStop] = useState(false);
  const [deletingStopId, setDeletingStopId] = useState(null);

  const fetchRoutes = useCallback(async () => {
    try {
      setLoadingRoutes(true);
      setRouteError("");

      const response = await fetch(ROUTES_API);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not fetch routes.");
      }

      setRoutes(parseApiData(data, "routes"));
    } catch (error) {
      console.error("Fetch routes error:", error);
      setRouteError(
        error.message ||
          "Routes could not be loaded. Check that the backend is running."
      );
    } finally {
      setLoadingRoutes(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const filteredRoutes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return routes.filter((routeItem) => {
      const matchesSearch =
        !query ||
        routeItem.route_name?.toLowerCase().includes(query) ||
        routeItem.source?.toLowerCase().includes(query) ||
        routeItem.destination?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || routeItem.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [routes, search, statusFilter]);

  const activeRoutes = routes.filter(
    (routeItem) => routeItem.status === "active"
  ).length;

  const inactiveRoutes = routes.filter(
    (routeItem) => routeItem.status === "inactive"
  ).length;

  const getStatusClasses = (status) =>
    status === "active"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

  const handleRouteInputChange = (event) => {
    const { name, value } = event.target;

    setRouteForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddRouteModal = () => {
    setEditingRouteId(null);
    setRouteForm(initialRouteForm);
    setRouteError("");
    setRouteModalOpen(true);
  };

  const openEditRouteModal = (routeItem) => {
    setEditingRouteId(routeItem.id);
    setRouteForm({
      route_name: routeItem.route_name || "",
      source: routeItem.source || "",
      destination: routeItem.destination || "",
      distance:
        routeItem.distance === null || routeItem.distance === undefined
          ? ""
          : routeItem.distance,
      estimated_time:
        routeItem.estimated_time === null ||
        routeItem.estimated_time === undefined
          ? ""
          : routeItem.estimated_time,
      status: routeItem.status || "active",
    });
    setRouteError("");
    setRouteModalOpen(true);
  };

  const closeRouteModal = () => {
    if (savingRoute) return;

    setRouteModalOpen(false);
    setEditingRouteId(null);
    setRouteForm(initialRouteForm);
    setRouteError("");
  };

  const handleRouteSubmit = async (event) => {
    event.preventDefault();

    if (
      !routeForm.route_name.trim() ||
      !routeForm.source.trim() ||
      !routeForm.destination.trim()
    ) {
      setRouteError("Route name, source and destination are required.");
      return;
    }

    if (
      routeForm.distance !== "" &&
      (Number.isNaN(Number(routeForm.distance)) ||
        Number(routeForm.distance) < 0)
    ) {
      setRouteError("Distance must be a valid non-negative number.");
      return;
    }

    if (
      routeForm.estimated_time !== "" &&
      (!Number.isInteger(Number(routeForm.estimated_time)) ||
        Number(routeForm.estimated_time) < 0)
    ) {
      setRouteError("Estimated time must be a non-negative whole number.");
      return;
    }

    try {
      setSavingRoute(true);
      setRouteError("");

      const requestUrl = editingRouteId
        ? `${ROUTES_API}/${editingRouteId}`
        : ROUTES_API;

      const payload = {
        route_name: routeForm.route_name.trim(),
        source: routeForm.source.trim(),
        destination: routeForm.destination.trim(),
        distance:
          routeForm.distance === "" ? null : Number(routeForm.distance),
        estimated_time:
          routeForm.estimated_time === ""
            ? null
            : Number(routeForm.estimated_time),
        status: routeForm.status,
      };

      const response = await fetch(requestUrl, {
        method: editingRouteId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Route ${editingRouteId ? "update" : "creation"} failed.`
        );
      }

      closeRouteModal();
      await fetchRoutes();
    } catch (error) {
      console.error("Save route error:", error);
      setRouteError(error.message);
    } finally {
      setSavingRoute(false);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    const confirmed = window.confirm(
      "Delete this route? Its linked route stops may also be deleted."
    );

    if (!confirmed) return;

    try {
      setDeletingRouteId(routeId);
      setRouteError("");

      const response = await fetch(`${ROUTES_API}/${routeId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not delete route.");
      }

      setRoutes((previous) =>
        previous.filter((routeItem) => routeItem.id !== routeId)
      );

      if (viewRoute?.id === routeId) {
        setViewRoute(null);
      }

      if (selectedRouteForStops?.id === routeId) {
        closeStopsManager();
      }
    } catch (error) {
      console.error("Delete route error:", error);
      setRouteError(error.message);
    } finally {
      setDeletingRouteId(null);
    }
  };

  const fetchStopsForRoute = useCallback(async (routeId) => {
    try {
      setLoadingStops(true);
      setStopsError("");

      const response = await fetch(`${STOPS_API}/route/${routeId}`);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not fetch route stops.");
      }

      setStops(parseApiData(data, "stops"));
    } catch (error) {
      console.error("Fetch route stops error:", error);
      setStops([]);
      setStopsError(error.message || "Could not fetch route stops.");
    } finally {
      setLoadingStops(false);
    }
  }, []);

  const openStopsManager = async (routeItem) => {
    setSelectedRouteForStops(routeItem);
    setStops([]);
    setStopsError("");
    setStopModalOpen(false);
    setEditingStopId(null);
    setStopForm(initialStopForm);
    await fetchStopsForRoute(routeItem.id);
  };

  const closeStopsManager = () => {
    if (savingStop || deletingStopId) return;

    setSelectedRouteForStops(null);
    setStops([]);
    setStopsError("");
    setStopModalOpen(false);
    setEditingStopId(null);
    setStopForm(initialStopForm);
  };

  const openAddStopModal = () => {
    const nextOrder =
      stops.length === 0
        ? 1
        : Math.max(...stops.map((stop) => Number(stop.stop_order) || 0)) + 1;

    setEditingStopId(null);
    setStopForm({
      ...initialStopForm,
      stop_order: String(nextOrder),
    });
    setStopsError("");
    setStopModalOpen(true);
  };

  const openEditStopModal = (stop) => {
    setEditingStopId(stop.id);
    setStopForm({
      stop_name: stop.stop_name || "",
      stop_order:
        stop.stop_order === null || stop.stop_order === undefined
          ? ""
          : String(stop.stop_order),
      estimated_time: normalizeTime(stop.estimated_time),
      latitude:
        stop.latitude === null || stop.latitude === undefined
          ? ""
          : String(stop.latitude),
      longitude:
        stop.longitude === null || stop.longitude === undefined
          ? ""
          : String(stop.longitude),
      is_boarding: Number(stop.is_boarding) === 1,
      is_drop: Number(stop.is_drop) === 1,
    });
    setStopsError("");
    setStopModalOpen(true);
  };

  const closeStopModal = () => {
    if (savingStop) return;

    setStopModalOpen(false);
    setEditingStopId(null);
    setStopForm(initialStopForm);
    setStopsError("");
  };

  const handleStopInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setStopForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStopSubmit = async (event) => {
    event.preventDefault();

    if (!selectedRouteForStops) {
      setStopsError("Select a route before adding stops.");
      return;
    }

    if (!stopForm.stop_name.trim() || stopForm.stop_order === "") {
      setStopsError("Stop name and stop order are required.");
      return;
    }

    if (
      Number.isNaN(Number(stopForm.stop_order)) ||
      Number(stopForm.stop_order) < 1
    ) {
      setStopsError("Stop order must be a positive number.");
      return;
    }

    if (
      stopForm.latitude !== "" &&
      (Number.isNaN(Number(stopForm.latitude)) ||
        Number(stopForm.latitude) < -90 ||
        Number(stopForm.latitude) > 90)
    ) {
      setStopsError("Latitude must be between -90 and 90.");
      return;
    }

    if (
      stopForm.longitude !== "" &&
      (Number.isNaN(Number(stopForm.longitude)) ||
        Number(stopForm.longitude) < -180 ||
        Number(stopForm.longitude) > 180)
    ) {
      setStopsError("Longitude must be between -180 and 180.");
      return;
    }

    try {
      setSavingStop(true);
      setStopsError("");

      const requestUrl = editingStopId
        ? `${STOPS_API}/${editingStopId}`
        : STOPS_API;

      const payload = {
        route_id: selectedRouteForStops.id,
        stop_name: stopForm.stop_name.trim(),
        stop_order: Number(stopForm.stop_order),
        estimated_time: stopForm.estimated_time || null,
        latitude:
          stopForm.latitude === "" ? null : Number(stopForm.latitude),
        longitude:
          stopForm.longitude === "" ? null : Number(stopForm.longitude),
        is_boarding: stopForm.is_boarding ? 1 : 0,
        is_drop: stopForm.is_drop ? 1 : 0,
      };

      const response = await fetch(requestUrl, {
        method: editingStopId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Stop ${editingStopId ? "update" : "creation"} failed.`
        );
      }

      closeStopModal();
      await fetchStopsForRoute(selectedRouteForStops.id);
    } catch (error) {
      console.error("Save route stop error:", error);
      setStopsError(error.message);
    } finally {
      setSavingStop(false);
    }
  };

  const handleDeleteStop = async (stopId) => {
    const confirmed = window.confirm("Delete this route stop?");

    if (!confirmed || !selectedRouteForStops) return;

    try {
      setDeletingStopId(stopId);
      setStopsError("");

      const response = await fetch(`${STOPS_API}/${stopId}`, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not delete route stop.");
      }

      setStops((previous) => previous.filter((stop) => stop.id !== stopId));
    } catch (error) {
      console.error("Delete route stop error:", error);
      setStopsError(error.message);
    } finally {
      setDeletingStopId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 transition-colors dark:bg-slate-950 md:p-8">
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 p-7 text-white shadow-xl md:p-9">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Route size={42} />
              <h1 className="text-3xl font-bold md:text-4xl">
                Route Management
              </h1>
            </div>

            <p className="mt-3 text-blue-100">
              Manage university routes and their ordered pickup and drop stops.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddRouteModal}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg transition hover:scale-105"
          >
            <Plus size={20} />
            Add Route
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-7 text-white shadow-lg">
          <Route size={34} />
          <p className="mt-5 text-lg font-medium">Total Routes</p>
          <h2 className="mt-2 text-4xl font-bold">{routes.length}</h2>
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 p-7 text-white shadow-lg">
          <MapPin size={34} />
          <p className="mt-5 text-lg font-medium">Active Routes</p>
          <h2 className="mt-2 text-4xl font-bold">{activeRoutes}</h2>
        </div>

        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-7 text-white shadow-lg">
          <MapPin size={34} />
          <p className="mt-5 text-lg font-medium">Inactive Routes</p>
          <h2 className="mt-2 text-4xl font-bold">{inactiveRoutes}</h2>
        </div>
      </div>

      <div className="mb-8 grid gap-4 rounded-3xl bg-white p-5 shadow-xl dark:bg-slate-800 md:grid-cols-2">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={21}
          />

          <input
            type="text"
            placeholder="Search by route, source or destination..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-12 pr-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {routeError && !routeModalOpen && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {routeError}
        </div>
      )}

      {loadingRoutes ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-white shadow-xl dark:bg-slate-800">
          <LoaderCircle className="animate-spin text-blue-600" size={42} />
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-xl dark:bg-slate-800">
          <Route className="mx-auto mb-4 text-slate-400" size={52} />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            No routes found
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Add a new route or change the search filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px]">
              <thead className="bg-slate-100 dark:bg-slate-900">
                <tr>
                  {[
                    "Route",
                    "Source",
                    "Destination",
                    "Distance",
                    "Estimated Time",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-5 text-left text-sm font-semibold text-slate-600 dark:text-slate-300"
                    >
                      {heading}
                    </th>
                  ))}

                  <th className="px-6 py-5 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredRoutes.map((routeItem) => (
                  <tr
                    key={routeItem.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                          <Route size={22} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {routeItem.route_name}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            ID: {routeItem.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                      {routeItem.source}
                    </td>

                    <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                      {routeItem.destination}
                    </td>

                    <td className="px-6 py-5 text-slate-600 dark:text-slate-400">
                      {routeItem.distance === null ||
                      routeItem.distance === undefined
                        ? "—"
                        : `${routeItem.distance} km`}
                    </td>

                    <td className="px-6 py-5 text-slate-600 dark:text-slate-400">
                      {routeItem.estimated_time === null ||
                      routeItem.estimated_time === undefined
                        ? "—"
                        : `${routeItem.estimated_time} min`}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          routeItem.status
                        )}`}
                      >
                        {routeItem.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openStopsManager(routeItem)}
                          className="rounded-lg bg-purple-100 p-2 text-purple-600 transition hover:bg-purple-600 hover:text-white dark:bg-purple-900/30 dark:text-purple-300"
                          title="Manage stops"
                        >
                          <ListOrdered size={19} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setViewRoute(routeItem)}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-600 hover:text-white dark:bg-slate-700 dark:text-slate-300"
                          title="View route"
                        >
                          <Eye size={19} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditRouteModal(routeItem)}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-300"
                          title="Edit route"
                        >
                          <Pencil size={19} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteRoute(routeItem.id)}
                          disabled={deletingRouteId === routeItem.id}
                          className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/30 dark:text-red-300"
                          title="Delete route"
                        >
                          {deletingRouteId === routeItem.id ? (
                            <LoaderCircle
                              className="animate-spin"
                              size={19}
                            />
                          ) : (
                            <Trash2 size={19} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {routeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeRouteModal();
            }
          }}
        >
          <div className="my-6 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editingRouteId ? "Update Route" : "Add New Route"}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter the route details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeRouteModal}
                disabled={savingRoute}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            {routeError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {routeError}
              </div>
            )}

            <form onSubmit={handleRouteSubmit} className="space-y-4">
              <TextField
                label="Route Name"
                name="route_name"
                value={routeForm.route_name}
                onChange={handleRouteInputChange}
                placeholder="Example: Route A"
                required
              />

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Source"
                  name="source"
                  value={routeForm.source}
                  onChange={handleRouteInputChange}
                  placeholder="Example: KRMU"
                  required
                />

                <TextField
                  label="Destination"
                  name="destination"
                  value={routeForm.destination}
                  onChange={handleRouteInputChange}
                  placeholder="Example: Vasant Vihar"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Distance (km)"
                  name="distance"
                  type="number"
                  min="0"
                  step="0.1"
                  value={routeForm.distance}
                  onChange={handleRouteInputChange}
                  placeholder="Example: 25.5"
                />

                <TextField
                  label="Estimated Time (minutes)"
                  name="estimated_time"
                  type="number"
                  min="0"
                  step="1"
                  value={routeForm.estimated_time}
                  onChange={handleRouteInputChange}
                  placeholder="Example: 60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </label>

                <select
                  name="status"
                  value={routeForm.status}
                  onChange={handleRouteInputChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeRouteModal}
                  disabled={savingRoute}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingRoute}
                  className="flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingRoute && (
                    <LoaderCircle className="animate-spin" size={18} />
                  )}
                  {savingRoute
                    ? "Saving..."
                    : editingRouteId
                    ? "Update Route"
                    : "Add Route"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewRoute && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewRoute(null);
            }
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Route Details
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Complete route information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setViewRoute(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <InfoBox label="Route Name" value={viewRoute.route_name} />

              <div className="grid gap-4 md:grid-cols-2">
                <InfoBox
                  label="Source"
                  value={viewRoute.source}
                  icon={<MapPin className="text-blue-600" size={20} />}
                />

                <InfoBox
                  label="Destination"
                  value={viewRoute.destination}
                  icon={<MapPin className="text-green-600" size={20} />}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoBox
                  label="Distance"
                  value={
                    viewRoute.distance === null ||
                    viewRoute.distance === undefined
                      ? "Not specified"
                      : `${viewRoute.distance} km`
                  }
                  icon={<Ruler className="text-purple-600" size={20} />}
                />

                <InfoBox
                  label="Estimated Time"
                  value={
                    viewRoute.estimated_time === null ||
                    viewRoute.estimated_time === undefined
                      ? "Not specified"
                      : `${viewRoute.estimated_time} minutes`
                  }
                  icon={<Clock3 className="text-orange-600" size={20} />}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusClasses(
                    viewRoute.status
                  )}`}
                >
                  {viewRoute.status}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const routeItem = viewRoute;
                  setViewRoute(null);
                  openStopsManager(routeItem);
                }}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
              >
                <ListOrdered size={18} />
                Manage Stops
              </button>

              <button
                type="button"
                onClick={() => setViewRoute(null)}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRouteForStops && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeStopsManager();
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800 md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300">
                  Route Stops
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {selectedRouteForStops.route_name}
                </h2>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  {selectedRouteForStops.source} →{" "}
                  {selectedRouteForStops.destination}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openAddStopModal}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                >
                  <Plus size={19} />
                  Add Stop
                </button>

                <button
                  type="button"
                  onClick={closeStopsManager}
                  className="rounded-xl border border-slate-300 p-3 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <X size={21} />
                </button>
              </div>
            </div>

            {stopsError && !stopModalOpen && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {stopsError}
              </div>
            )}

            {loadingStops ? (
              <div className="flex min-h-[260px] items-center justify-center">
                <LoaderCircle
                  className="animate-spin text-purple-600"
                  size={42}
                />
              </div>
            ) : stops.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-900">
                <MapPin className="mx-auto text-slate-400" size={52} />
                <h3 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">
                  No stops added yet
                </h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Add the first pickup or drop stop for this route.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                        {stop.stop_order ?? index + 1}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                          {stop.stop_name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2 text-sm">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {formatTime(stop.estimated_time)}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 ${
                              Number(stop.is_boarding) === 1
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {Number(stop.is_boarding) === 1
                              ? "Pickup allowed"
                              : "No pickup"}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 ${
                              Number(stop.is_drop) === 1
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {Number(stop.is_drop) === 1
                              ? "Drop allowed"
                              : "No drop"}
                          </span>
                        </div>

                        {(stop.latitude || stop.longitude) && (
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Coordinates: {stop.latitude ?? "—"},{" "}
                            {stop.longitude ?? "—"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditStopModal(stop)}
                        className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white dark:bg-blue-900/30 dark:text-blue-300"
                        title="Edit stop"
                      >
                        <Pencil size={19} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteStop(stop.id)}
                        disabled={deletingStopId === stop.id}
                        className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50 dark:bg-red-900/30 dark:text-red-300"
                        title="Delete stop"
                      >
                        {deletingStopId === stop.id ? (
                          <LoaderCircle
                            className="animate-spin"
                            size={19}
                          />
                        ) : (
                          <Trash2 size={19} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {stopModalOpen && selectedRouteForStops && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeStopModal();
            }
          }}
        >
          <div className="my-6 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300">
                  {selectedRouteForStops.route_name}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {editingStopId ? "Edit Route Stop" : "Add Route Stop"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeStopModal}
                disabled={savingStop}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={22} />
              </button>
            </div>

            {stopsError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {stopsError}
              </div>
            )}

            <form onSubmit={handleStopSubmit} className="space-y-4">
              <TextField
                label="Stop Name"
                name="stop_name"
                value={stopForm.stop_name}
                onChange={handleStopInputChange}
                placeholder="Example: Vasant Vihar"
                required
              />

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Stop Order"
                  name="stop_order"
                  type="number"
                  min="1"
                  step="1"
                  value={stopForm.stop_order}
                  onChange={handleStopInputChange}
                  placeholder="Example: 6"
                  required
                />

                <TextField
                  label="Estimated Time"
                  name="estimated_time"
                  type="time"
                  value={stopForm.estimated_time}
                  onChange={handleStopInputChange}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Latitude"
                  name="latitude"
                  type="number"
                  step="0.0000001"
                  value={stopForm.latitude}
                  onChange={handleStopInputChange}
                  placeholder="Example: 28.5603"
                />

                <TextField
                  label="Longitude"
                  name="longitude"
                  type="number"
                  step="0.0000001"
                  value={stopForm.longitude}
                  onChange={handleStopInputChange}
                  placeholder="Example: 77.1606"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <CheckboxCard
                  name="is_boarding"
                  checked={stopForm.is_boarding}
                  onChange={handleStopInputChange}
                  icon={<CheckCircle2 size={22} />}
                  title="Pickup Allowed"
                  description="Students may board the bus here."
                />

                <CheckboxCard
                  name="is_drop"
                  checked={stopForm.is_drop}
                  onChange={handleStopInputChange}
                  icon={<XCircle size={22} />}
                  title="Drop Allowed"
                  description="Students may leave the bus here."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeStopModal}
                  disabled={savingStop}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingStop}
                  className="flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
                >
                  {savingStop ? (
                    <LoaderCircle className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}

                  {savingStop
                    ? "Saving..."
                    : editingStopId
                    ? "Update Stop"
                    : "Add Stop"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  min,
  max,
  step,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
      />
    </div>
  );
}

function InfoBox({ label, value, icon = null }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
      {icon && <div className="mb-2">{icon}</div>}
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function CheckboxCard({
  name,
  checked,
  onChange,
  icon,
  title,
  description,
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 accent-purple-600"
      />

      <div className="text-purple-600 dark:text-purple-300">{icon}</div>

      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </label>
  );
}