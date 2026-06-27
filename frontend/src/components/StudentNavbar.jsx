import {
  Bell,
  Search,
} from "lucide-react";

export default function StudentNavbar() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-lg p-5 flex justify-between items-center">

      <div className="relative w-96">

        <Search
          className="absolute left-4 top-4 text-gray-400"
        />

        <input
          placeholder="Search..."
          className="w-full pl-12 py-3 rounded-xl border outline-none"
        />

      </div>

      <div className="flex items-center gap-6">

        <div className="text-xl">

          🌤 32°C

        </div>

        <button className="relative">

          <Bell size={24} />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>

        </button>

        <div className="flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/100?img=12"
            className="w-12 h-12 rounded-full"
          />

          <div>

            <h3 className="font-semibold">

              Jiya Sinha

            </h3>

            <p className="text-gray-500 text-sm">

              Student

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}