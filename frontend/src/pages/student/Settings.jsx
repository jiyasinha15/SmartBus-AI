import { useState } from "react";
import {
  Settings,
  Bell,
  Moon,
  Globe,
  MapPinned,
  Lock,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function StudentSettings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [liveTracking, setLiveTracking] = useState(true);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-sky-500 rounded-3xl p-8 text-white shadow-xl">

        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Settings size={40} />
          Settings
        </h1>

        <p className="mt-3 text-blue-100">
          Manage your application preferences.
        </p>

      </div>

      {/* Preferences */}

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Preferences
        </h2>

        <div className="space-y-6">

          {/* Notifications */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <Bell className="text-blue-600" />
              <div>
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-gray-500 text-sm">
                  Receive bus updates and alerts.
                </p>
              </div>
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-14 h-8 rounded-full transition ${
                notifications ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full mt-1 transition ${
                  notifications ? "ml-7" : "ml-1"
                }`}
              />
            </button>

          </div>

          {/* Dark Mode */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <Moon className="text-purple-600" />
              <div>
                <h3 className="font-semibold">Dark Mode</h3>
                <p className="text-gray-500 text-sm">
                  Switch between light and dark theme.
                </p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-8 rounded-full transition ${
                darkMode ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full mt-1 transition ${
                  darkMode ? "ml-7" : "ml-1"
                }`}
              />
            </button>

          </div>

          {/* Live Tracking */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <MapPinned className="text-red-500" />
              <div>
                <h3 className="font-semibold">Live Tracking</h3>
                <p className="text-gray-500 text-sm">
                  Enable real-time bus tracking.
                </p>
              </div>
            </div>

            <button
              onClick={() => setLiveTracking(!liveTracking)}
              className={`w-14 h-8 rounded-full transition ${
                liveTracking ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full mt-1 transition ${
                  liveTracking ? "ml-7" : "ml-1"
                }`}
              />
            </button>

          </div>

        </div>

      </div>

      {/* More Options */}

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Account
        </h2>

        <div className="space-y-4">

          <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-100 transition">

            <div className="flex items-center gap-4">
              <Globe className="text-cyan-600" />
              <span>Language</span>
            </div>

            <ChevronRight />

          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-100 transition">

            <div className="flex items-center gap-4">
              <Lock className="text-orange-500" />
              <span>Change Password</span>
            </div>

            <ChevronRight />

          </button>

        </div>

      </div>

      {/* Logout */}

      <button className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-3xl py-5 font-bold text-lg shadow-xl hover:scale-[1.02] transition">

        <div className="flex items-center justify-center gap-3">

          <LogOut size={24} />

          Logout

        </div>

      </button>

      {/* Version */}

      <div className="text-center text-gray-500 text-sm">
        SmartBus Management System • Version 1.0.0
      </div>

    </div>
  );
}