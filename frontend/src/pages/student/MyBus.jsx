import {
  Bus,
  User,
  Phone,
  MapPinned,
  Clock,
  Users,
  ShieldCheck,
} from "lucide-react";

export default function MyBus() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-[30px] p-8 text-white shadow-xl">

        <h1 className="text-4xl font-bold">
          🚌 My Bus
        </h1>

        <p className="mt-3 text-blue-100">
          View your assigned bus and route details.
        </p>

      </div>

      {/* Bus Details */}

      <div className="grid lg:grid-cols-4 gap-6">

        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">

          <Bus size={38} />

          <p className="mt-5 opacity-90">
            Bus Number
          </p>

          <h2 className="text-3xl font-bold mt-2">
            BUS-07
          </h2>

        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl p-6 text-white shadow-xl">

          <Users size={38} />

          <p className="mt-5 opacity-90">
            Capacity
          </p>

          <h2 className="text-3xl font-bold mt-2">
            45 Seats
          </h2>

        </div>

        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl">

          <Clock size={38} />

          <p className="mt-5 opacity-90">
            Pickup Time
          </p>

          <h2 className="text-3xl font-bold mt-2">
            08:15 AM
          </h2>

        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl">

          <ShieldCheck size={38} />

          <p className="mt-5 opacity-90">
            Status
          </p>

          <h2 className="text-3xl font-bold mt-2">
            Running
          </h2>

        </div>

      </div>

      {/* Driver + Route */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Driver */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="flex flex-col items-center">

            <img
              src="https://i.pravatar.cc/200?img=12"
              className="w-28 h-28 rounded-full border-4 border-cyan-500"
              alt="Driver"
            />

            <h2 className="text-2xl font-bold mt-5">

              Rahul Sharma

            </h2>

            <p className="text-gray-500">

              Driver

            </p>

          </div>

          <div className="mt-8 space-y-5">

            <div className="flex items-center gap-3">

              <Phone className="text-blue-600"/>

              +91 9876543210

            </div>

            <div className="flex items-center gap-3">

              <User className="text-green-600"/>

              Experience : 8 Years

            </div>

          </div>

          <button className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold">

            Contact Driver

          </button>

        </div>

        {/* Route */}

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-3xl font-bold mb-8">

            Route Details

          </h2>

          <div className="space-y-8">

            <div className="flex items-center gap-5">

              <div className="w-5 h-5 rounded-full bg-green-500"></div>

              <span className="text-lg">

                Home Pickup

              </span>

            </div>

            <div className="ml-2 border-l-4 border-dashed border-blue-300 h-10"></div>

            <div className="flex items-center gap-5">

              <div className="w-5 h-5 rounded-full bg-blue-600 animate-pulse"></div>

              <span className="text-lg font-semibold">

                City Bus Stop (Current)

              </span>

            </div>

            <div className="ml-2 border-l-4 border-dashed border-blue-300 h-10"></div>

            <div className="flex items-center gap-5">

              <div className="w-5 h-5 rounded-full bg-gray-400"></div>

              <span className="text-lg">

                University Gate

              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Trip */}

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-3xl font-bold mb-8">

          Today's Journey

        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-blue-50 rounded-2xl p-6">

            <MapPinned className="text-blue-600"/>

            <h3 className="text-xl font-bold mt-4">

              Pickup

            </h3>

            <p className="mt-2">

              08:15 AM

            </p>

          </div>

          <div className="bg-green-50 rounded-2xl p-6">

            <Bus className="text-green-600"/>

            <h3 className="text-xl font-bold mt-4">

              Arrival

            </h3>

            <p className="mt-2">

              09:00 AM

            </p>

          </div>

          <div className="bg-red-50 rounded-2xl p-6">

            <Clock className="text-red-600"/>

            <h3 className="text-xl font-bold mt-4">

              Return

            </h3>

            <p className="mt-2">

              05:15 PM

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}