import {
  LayoutDashboard,
  Bus,
  Route,
  Users,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={22} />,
    path: "/admin/dashboard",
  },
  {
    title: "Students",
    icon: <Users size={22} />,
    path: "/admin/students",
  },
  {
    title: "Drivers",
    icon: <UserCog size={22} />,
    path: "/admin/drivers",
  },
  {
    title: "Buses",
    icon: <Bus size={22} />,
    path: "/admin/buses",
  },
  {
    title: "Routes",
    icon: <Route size={22} />,
    path: "/admin/routes",
  },
  {
    title: "Analytics",
    icon: <BarChart3 size={22} />,
    path: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: <Settings size={22} />,
    path: "/admin/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-slate-700">

        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-2xl">
          🚌
        </div>

        <div className="ml-4">
          <h1 className="font-bold text-xl">SmartBus</h1>
          <p className="text-xs text-slate-400">
            Admin Panel
          </p>
        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 mt-6 px-4">

        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-4 rounded-xl mb-3 transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg"
                  : "hover:bg-slate-800"
              }`
            }
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}

      </div>

      {/* Logout */}

      <div className="p-4">

        <button className="w-full bg-red-500 hover:bg-red-600 rounded-xl p-4 flex items-center gap-4 transition">

          <LogOut size={22} />

          Logout

        </button>

      </div>

    </aside>
  );
}