import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export default function ScheduleTable({
  schedules,
  setSchedules,
  setOpen,
  setEditSchedule,
  setViewSchedule,
}) {

  const handleDelete = (busNo) => {

    if (!window.confirm("Delete this schedule?"))
      return;

    const updatedSchedules =
      schedules.filter(
        (schedule) =>
          schedule.busNo !== busNo
      );

    setSchedules(updatedSchedules);

    localStorage.setItem(
      "schedules",
      JSON.stringify(updatedSchedules)
    );

  };

  return (

    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-5">
                Bus
              </th>

              <th className="text-left p-5">
                Driver
              </th>

              <th className="text-left p-5">
                Route
              </th>

              <th className="text-left p-5">
                Departure
              </th>

              <th className="text-left p-5">
                Arrival
              </th>

              <th className="text-left p-5">
                Status
              </th>

              <th className="text-center p-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {schedules.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-500"
                >

                  No Schedule Found

                </td>

              </tr>

            ) : (

              schedules.map((schedule, index) => (

                <tr
                  key={index}
                  className="border-t hover:bg-slate-50 transition"
                >

                  <td className="p-5 font-semibold">

                    {schedule.busNo}

                  </td>

                  <td className="p-5">

                    {schedule.driver}

                  </td>

                  <td className="p-5">

                    {schedule.route}

                  </td>

                  <td className="p-5">

                    {schedule.departure}

                  </td>

                  <td className="p-5">

                    {schedule.arrival}

                  </td>

                  <td className="p-5">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        schedule.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >

                      {schedule.status}

                    </span>

                  </td>

                  <td className="p-5">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          setViewSchedule(schedule)
                        }
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                      >

                        <Eye size={18} />

                      </button>

                      <button
                        onClick={() => {

                          setEditSchedule(schedule);

                          setOpen(true);

                        }}
                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition"
                      >

                        <Pencil size={18} />

                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            schedule.busNo
                          )
                        }
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}