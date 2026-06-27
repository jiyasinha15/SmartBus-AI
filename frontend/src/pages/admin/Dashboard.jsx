import {
  Users,
  Bus,
  Route,
  UserCog,
} from "lucide-react";

import StatCard from "../../components/StatCard";
import LiveMap from "../../components/LiveMap";
import ChartCard from "../../components/ChartCard";
import RecentActivity from "../../components/RecentActivity";
import QuickActions from "../../components/QuickActions";

export default function Dashboard() {
  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        <StatCard
          title="Students"
          value="1250"
          icon={<Users size={35} />}
          color="from-blue-600 to-cyan-500"
          increase="+15%"
        />

        <StatCard
          title="Drivers"
          value="85"
          icon={<UserCog size={35} />}
          color="from-green-500 to-emerald-500"
          increase="+8%"
        />

        <StatCard
          title="Buses"
          value="42"
          icon={<Bus size={35} />}
          color="from-orange-500 to-yellow-500"
          increase="+5%"
        />

        <StatCard
          title="Routes"
          value="18"
          icon={<Route size={35} />}
          color="from-purple-500 to-pink-500"
          increase="+2%"
        />

      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">

        <div className="lg:col-span-2">

          <LiveMap />

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">
            Today's Summary
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">
              <span>🚌 Running Buses</span>
              <strong>36</strong>
            </div>

            <div className="flex justify-between">
              <span>⛽ Fuel Saved</span>
              <strong>48 L</strong>
            </div>

            <div className="flex justify-between">
              <span>📍 Active Routes</span>
              <strong>18</strong>
            </div>

            <div className="flex justify-between">
              <span>👨‍🎓 Students Travelled</span>
              <strong>1184</strong>
            </div>

            <div className="flex justify-between">
              <span>⚠ Delayed Buses</span>
              <strong className="text-red-500">
                2
              </strong>
            </div>

          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <ChartCard />

        <RecentActivity />

      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <QuickActions />

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">
            System Status
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">
              <span>🟢 Server</span>
              <strong className="text-green-600">
                Online
              </strong>
            </div>

            <div className="flex justify-between">
              <span>📡 GPS Devices</span>
              <strong>
                42/42 Connected
              </strong>
            </div>

            <div className="flex justify-between">
              <span>🚌 Running Buses</span>
              <strong>
                36
              </strong>
            </div>

            <div className="flex justify-between">
              <span>⚠ Alerts</span>
              <strong className="text-red-500">
                2
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}