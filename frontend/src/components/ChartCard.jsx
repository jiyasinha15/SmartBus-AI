import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", trips: 30 },
  { day: "Tue", trips: 45 },
  { day: "Wed", trips: 38 },
  { day: "Thu", trips: 60 },
  { day: "Fri", trips: 55 },
  { day: "Sat", trips: 42 },
  { day: "Sun", trips: 25 },
];

export default function ChartCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Weekly Trips
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <AreaChart data={data}>

          <defs>

            <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">

              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />

              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />

            </linearGradient>

          </defs>

          <XAxis dataKey="day" />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="trips"
            stroke="#2563EB"
            fillOpacity={1}
            fill="url(#colorTrips)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}