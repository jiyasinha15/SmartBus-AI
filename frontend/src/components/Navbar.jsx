import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <div className="h-20 bg-white shadow-sm flex items-center justify-between px-8">

      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-gray-500"
          />

          <input
            placeholder="Search..."
            className="pl-11 pr-5 py-3 rounded-xl bg-slate-100 outline-none w-72"
          />

        </div>

        <button className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-100">

          <Bell />

        </button>

        <img
          src="https://i.pravatar.cc/150"
          className="w-12 h-12 rounded-full border-2 border-blue-500"
          alt=""
        />

      </div>

    </div>
  );
}