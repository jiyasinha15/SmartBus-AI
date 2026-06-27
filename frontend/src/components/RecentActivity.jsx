export default function RecentActivity() {

  const activities = [
    {
      bus: "Bus-101",
      driver: "Rahul",
      status: "On Time",
    },
    {
      bus: "Bus-102",
      driver: "Aman",
      status: "Delayed",
    },
    {
      bus: "Bus-103",
      driver: "Vikas",
      status: "Running",
    },
    {
      bus: "Bus-104",
      driver: "Rohit",
      status: "Completed",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">

        Recent Activity

      </h2>

      <table className="w-full">

        <thead>

          <tr className="text-left border-b">

            <th className="pb-3">Bus</th>

            <th>Driver</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {activities.map((item) => (

            <tr key={item.bus} className="border-b">

              <td className="py-4">
                {item.bus}
              </td>

              <td>
                {item.driver}
              </td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-sm text-white ${
                    item.status === "Delayed"
                      ? "bg-red-500"
                      : item.status === "Running"
                      ? "bg-blue-500"
                      : item.status === "Completed"
                      ? "bg-green-500"
                      : "bg-yellow-500"
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
  );
}