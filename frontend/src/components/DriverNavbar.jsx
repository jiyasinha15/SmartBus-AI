import { Bell, Search } from "lucide-react";

export default function DriverNavbar() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-5 flex items-center justify-between">

      <div>

        <h2 className="text-2xl font-bold">
          Driver Dashboard
        </h2>

        <p className="text-gray-500">
          Welcome back, Rahul 👋
        </p>

      </div>

      <div className="flex items-center gap-4">

        <div className="relative">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-xl border outline-none"
          />

        </div>

        <button className="relative p-3 rounded-xl bg-slate-100 hover:bg-slate-200">

          <Bell />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>

        </button>

      </div>

    </div>
  );
}