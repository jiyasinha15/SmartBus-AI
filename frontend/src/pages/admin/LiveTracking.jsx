import { useEffect, useState } from "react";
import {
  MapPinned,
  Bus,
  Users,
  Route,
  Search,
  Navigation,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);

  return null;
}

export default function LiveTracking() {

  const [search, setSearch] = useState("");

  const [buses, setBuses] = useState([]);

  const [selectedBus, setSelectedBus] =
    useState(null);

  useEffect(() => {

    const savedBuses =
      JSON.parse(
        localStorage.getItem("buses")
      ) || [];

    const liveBuses =
      savedBuses.map((bus, index) => ({

        id: index + 1,

        ...bus,

        bus: bus.busNo,

        students:
          Math.floor(
            Math.random() * 25
          ) + 20,

        speed:
          bus.status === "Running"
            ? `${Math.floor(
              Math.random() * 25
            ) + 35} km/h`
            : "0 km/h",

        nextStop: "Next Pickup Point",

        position: [
          28.6139 + index * 0.01,
          77.209 + index * 0.01,
        ],

        routePath: [

          [
            28.6139 + index * 0.01,
            77.209 + index * 0.01,
          ],

          [
            28.616 + index * 0.01,
            77.212 + index * 0.01,
          ],

          [
            28.619 + index * 0.01,
            77.216 + index * 0.01,
          ],

          [
            28.622 + index * 0.01,
            77.220 + index * 0.01,
          ],

        ],

      }));

    setBuses(liveBuses);

    if (liveBuses.length) {
      setSelectedBus(liveBuses[0]);
    }

  }, []);

  const filtered = buses.filter(
    (bus) =>
      bus.bus
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      bus.driver
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const runningBuses =
    buses.filter(
      (b) => b.status === "Running"
    ).length;

  const totalStudents =
    buses.reduce(
      (sum, bus) =>
        sum + bus.students,
      0
    );

  const totalRoutes =
    [...new Set(
      buses.map((b) => b.route)
    )].length;

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl">

        <h1 className="text-4xl font-bold flex items-center gap-3">

          <MapPinned size={40} />

          Live Bus Tracking

        </h1>

        <p className="mt-3 text-blue-100">

          Track all buses in real time.

        </p>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-blue-600 text-white rounded-3xl p-6">

          <Bus size={35} />

          <p className="mt-4">
            Active Buses
          </p>

          <h2 className="text-3xl font-bold">
            {runningBuses}
          </h2>

        </div>

        <div className="bg-green-600 text-white rounded-3xl p-6">

          <Users size={35} />

          <p className="mt-4">
            Students Travelling
          </p>

          <h2 className="text-3xl font-bold">
            {totalStudents}
          </h2>

        </div>

        <div className="bg-orange-500 text-white rounded-3xl p-6">

          <Route size={35} />

          <p className="mt-4">
            Running Routes
          </p>

          <h2 className="text-3xl font-bold">
            {totalRoutes}
          </h2>

        </div>

        <div className="bg-red-500 text-white rounded-3xl p-6">

          <Navigation size={35} />

          <p className="mt-4">
            Maintenance
          </p>

          <h2 className="text-3xl font-bold">

            {
              buses.filter(
                (b) =>
                  b.status ===
                  "Maintenance"
              ).length
            }

          </h2>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white rounded-3xl shadow-xl p-5">

        <div className="relative">

          <Search
            className="absolute left-4 top-4 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search Bus or Driver..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full pl-12 py-4 border rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500"
          />

        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Bus List */}

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <h2 className="text-2xl font-bold mb-6">

            Active Buses

          </h2>

          <div className="space-y-4">

            {filtered.map((bus) => (

              <div
                key={bus.id}
                onClick={() =>
                  setSelectedBus(bus)
                }
                className={`border rounded-2xl p-4 cursor-pointer transition ${selectedBus?.id ===
                  bus.id
                  ? "border-blue-600 bg-blue-50"
                  : "hover:bg-slate-50"
                  }`}
              >

                <div className="flex justify-between">

                  <h3 className="font-bold">

                    {bus.bus}

                  </h3>

                  <span
                    className={`text-sm px-3 py-1 rounded-full ${bus.status ===
                      "Running"
                      ? "bg-green-100 text-green-700"
                      : bus.status ===
                        "Idle"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >

                    {bus.status}

                  </span>

                </div>

                <p className="text-gray-500 mt-2">

                  {bus.driver}

                </p>

                <p className="text-sm mt-1">

                  {bus.route}

                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Live Map */}

        <div className="bg-white rounded-3xl shadow-xl flex flex-col">

          <div className="p-6 border-b">

            <h2 className="text-2xl font-bold">
              Live Map
            </h2>

          </div>

          <MapContainer
    className="flex-1"
    style={{
      minHeight: "700px",
      width: "100%",
    }}
  >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {selectedBus && (

              <>
                <ChangeMapView
                  center={selectedBus.position}
                />

                <Polyline
                  positions={
                    selectedBus.routePath
                  }
                  pathOptions={{
                    color: "#2563eb",
                    weight: 5,
                  }}
                />

              </>

            )}

            {filtered.map((bus) => (

              <Marker
                key={bus.id}
                position={bus.position}
                eventHandlers={{
                  click: () =>
                    setSelectedBus(bus),
                }}
              >

                <Popup>

                  <strong>
                    {bus.bus}
                  </strong>

                  <br />

                  Driver: {bus.driver}

                  <br />

                  Route: {bus.route}

                  <br />

                  Status: {bus.status}

                  <br />

                  Students: {bus.students}

                  <br />

                  Speed: {bus.speed}

                </Popup>

              </Marker>

            ))}

          </MapContainer>

        </div>

        {/* Selected Bus Details */}

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <h2 className="text-2xl font-bold mb-6">

            Selected Bus Details

          </h2>

          {selectedBus ? (

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <p className="text-gray-500">
                  Bus Number
                </p>

                <h3 className="font-bold text-xl">

                  {selectedBus.bus}

                </h3>

              </div>

              <div>

                <p className="text-gray-500">
                  Driver
                </p>

                <h3 className="font-bold text-xl">

                  {selectedBus.driver}

                </h3>

              </div>

              <div>

                <p className="text-gray-500">
                  Route
                </p>

                <h3 className="font-bold text-xl">

                  {selectedBus.route}

                </h3>

              </div>

              <div>

                <p className="text-gray-500">
                  Students
                </p>

                <h3 className="font-bold text-xl">

                  {selectedBus.students}

                </h3>

              </div>

              <div>

                <p className="text-gray-500">
                  Speed
                </p>

                <h3 className="font-bold text-xl text-green-600">

                  {selectedBus.speed}

                </h3>

              </div>

              <div>

                <p className="text-gray-500">
                  Next Stop
                </p>

                <h3 className="font-bold text-xl">

                  {selectedBus.nextStop}

                </h3>

              </div>

              <div>

                <p className="text-gray-500">
                  Status
                </p>

                <span
                  className={`px-4 py-2 rounded-full font-semibold ${selectedBus.status === "Running"
                    ? "bg-green-100 text-green-700"
                    : selectedBus.status === "Idle"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >

                  {selectedBus.status}

                </span>

              </div>

              <div>

                <p className="text-gray-500">
                  Pickup Points
                </p>

                <p className="font-medium break-words">

                  {selectedBus.pickupPoints}

                </p>

              </div>

            </div>

          ) : (

            <div className="h-full flex items-center justify-center text-gray-500">

              No Bus Selected

            </div>

          )}

        </div>

      </div>

    </div>

  );

}