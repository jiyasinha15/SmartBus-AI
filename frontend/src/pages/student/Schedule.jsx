import {
  CalendarDays,
  Clock,
  Bus,
  MapPinned,
  CheckCircle,
} from "lucide-react";

const schedule = [
  {
    day: "Monday",
    pickup: "08:15 AM",
    arrival: "09:00 AM",
    returnTime: "05:15 PM",
    route: "North Campus",
    status: "Active",
  },
  {
    day: "Tuesday",
    pickup: "08:15 AM",
    arrival: "09:00 AM",
    returnTime: "05:15 PM",
    route: "North Campus",
    status: "Active",
  },
  {
    day: "Wednesday",
    pickup: "08:15 AM",
    arrival: "09:00 AM",
    returnTime: "05:15 PM",
    route: "North Campus",
    status: "Active",
  },
  {
    day: "Thursday",
    pickup: "08:15 AM",
    arrival: "09:00 AM",
    returnTime: "05:15 PM",
    route: "North Campus",
    status: "Active",
  },
  {
    day: "Friday",
    pickup: "08:15 AM",
    arrival: "09:00 AM",
    returnTime: "05:15 PM",
    route: "North Campus",
    status: "Active",
  },
  {
    day: "Saturday",
    pickup: "09:00 AM",
    arrival: "09:40 AM",
    returnTime: "02:00 PM",
    route: "North Campus",
    status: "Half Day",
  },
  {
    day: "Sunday",
    pickup: "--",
    arrival: "--",
    returnTime: "--",
    route: "Holiday",
    status: "Holiday",
  },
];

export default function Schedule() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl">

        <h1 className="text-4xl font-bold flex items-center gap-3">
          <CalendarDays size={38} />
          Bus Schedule
        </h1>

        <p className="mt-3 text-blue-100">
          View your weekly pickup and drop schedule.
        </p>

      </div>

      {/* Today's Summary */}

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">

          <Clock size={35} />

          <p className="mt-4">Pickup</p>

          <h2 className="text-3xl font-bold">
            08:15 AM
          </h2>

        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white shadow-xl">

          <Bus size={35} />

          <p className="mt-4">Arrival</p>

          <h2 className="text-3xl font-bold">
            09:00 AM
          </h2>

        </div>

        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl">

          <Clock size={35} />

          <p className="mt-4">Return</p>

          <h2 className="text-3xl font-bold">
            05:15 PM
          </h2>

        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl">

          <MapPinned size={35} />

          <p className="mt-4">Route</p>

          <h2 className="text-2xl font-bold">
            North Campus
          </h2>

        </div>

      </div>

      {/* Weekly Schedule */}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">
            Weekly Schedule
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">Day</th>

                <th className="p-4 text-left">Pickup</th>

                <th className="p-4 text-left">Arrival</th>

                <th className="p-4 text-left">Return</th>

                <th className="p-4 text-left">Route</th>

                <th className="p-4 text-left">Status</th>

              </tr>

            </thead>

            <tbody>

              {schedule.map((item, index) => (

                <tr
                  key={index}
                  className="border-b hover:bg-blue-50 transition"
                >

                  <td className="p-4 font-semibold">
                    {item.day}
                  </td>

                  <td className="p-4">
                    {item.pickup}
                  </td>

                  <td className="p-4">
                    {item.arrival}
                  </td>

                  <td className="p-4">
                    {item.returnTime}
                  </td>

                  <td className="p-4">
                    {item.route}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-4 py-2 rounded-full text-white text-sm
                      ${
                        item.status === "Holiday"
                          ? "bg-red-500"
                          : item.status === "Half Day"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Important Note */}

      <div className="bg-green-50 border border-green-200 rounded-3xl p-6 flex gap-4">

        <CheckCircle className="text-green-600 mt-1" />

        <div>

          <h3 className="font-bold text-lg">
            Important Notice
          </h3>

          <p className="text-gray-600 mt-2">
            Please reach your pickup point at least
            <span className="font-semibold text-green-700">
              {" "}5 minutes{" "}
            </span>
            before the scheduled pickup time.
          </p>

        </div>

      </div>

    </div>
  );
}