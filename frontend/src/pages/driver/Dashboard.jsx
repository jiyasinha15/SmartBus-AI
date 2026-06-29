import {
  Bus,
  Users,
  MapPinned,
  CheckCircle,
  Clock,
  Fuel,
  User,
  Phone,
  Navigation,
} from "lucide-react";

export default function DriverDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl">

        <h1 className="text-4xl font-bold">
          👋 Welcome, {user?.name}
        </h1>

        <p className="mt-3 text-blue-100">
          Have a safe journey! Here's your today's trip overview.
        </p>

      </div>

      {/* Top Cards */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">

          <Bus size={36} />

          <p className="mt-4 text-white/80">
            Assigned Bus
          </p>

          <h2 className="text-3xl font-bold mt-2">
            BUS-07
          </h2>

        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white shadow-xl">

          <Users size={36} />

          <p className="mt-4 text-white/80">
            Students
          </p>

          <h2 className="text-3xl font-bold mt-2">
            42
          </h2>

        </div>

        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl">

          <MapPinned size={36} />

          <p className="mt-4 text-white/80">
            Route
          </p>

          <h2 className="text-2xl font-bold mt-2">
            North Campus
          </h2>

        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl">

          <CheckCircle size={36} />

          <p className="mt-4 text-white/80">
            Status
          </p>

          <h2 className="text-3xl font-bold mt-2">
            On Duty
          </h2>

        </div>

      </div>

      {/* Middle Section */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Today's Journey */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Today's Journey
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-gray-600">
                Pickup
              </span>

              <span className="font-bold">
                08:15 AM
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Arrival
              </span>

              <span className="font-bold">
                09:00 AM
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Return
              </span>

              <span className="font-bold">
                05:15 PM
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Trips Today
              </span>

              <span className="font-bold text-blue-600">
                2 Completed
              </span>

            </div>

          </div>

        </div>

        {/* Driver Details */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="flex items-center gap-5">

            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">

              <User size={50} className="text-white"/>

            </div>

            <div>

              <h2 className="text-2xl font-bold">
                {user?.name}
              </h2>

              <p className="text-gray-500">
                Driver • 8 Years Experience
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-5">

            <div className="flex items-center gap-3">

              <Phone className="text-green-600"/>

              +91 {user?.phone}

            </div>

            <div className="flex items-center gap-3">

              <Navigation className="text-blue-600"/>

              License Verified

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Cards */}

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <Fuel className="text-orange-500"/>

          <h3 className="text-xl font-bold mt-4">

            Fuel Level

          </h3>

          <p className="mt-2 text-gray-500">

            80%

          </p>

          <div className="mt-5 h-3 rounded-full bg-gray-200">

            <div className="h-3 rounded-full bg-orange-500 w-4/5"></div>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <Clock className="text-blue-600"/>

          <h3 className="text-xl font-bold mt-4">

            Next Stop

          </h3>

          <p className="mt-2 text-gray-500">

            City Bus Stand

          </p>

          <p className="mt-4 text-blue-600 font-bold">

            ETA : 8 Minutes

          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <MapPinned className="text-green-600"/>

          <h3 className="text-xl font-bold mt-4">

            Today's Distance

          </h3>

          <p className="mt-2 text-gray-500">

            28 KM Covered

          </p>

          <div className="mt-4">

            <div className="h-3 rounded-full bg-gray-200">

              <div className="h-3 rounded-full bg-green-500 w-2/3"></div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}