import {
  Eye,
  LoaderCircle,
  Pencil,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

import { useState } from "react";
import api from "../services/api";

function formatDisplayTime(value) {
  if (!value) return "Not available";

  const [hoursText, minutesText] =
    String(value).slice(0, 5).split(":");

  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return String(value);
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function ScheduleTable({
  schedules,
  setOpen,
  setEditSchedule,
  setViewSchedule,
  onScheduleDeleted,
}) {
  const [deletingId, setDeletingId] =
    useState(null);

  const handleDelete = async (schedule) => {
    const confirmed = window.confirm(
      `Delete schedule for ${schedule.busNo}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(schedule.id);

      const response = await api.delete(
        `/schedules/${schedule.id}`
      );

      alert(
        response.data?.message ||
          "Schedule deleted successfully"
      );

      if (onScheduleDeleted) {
        await onScheduleDeleted();
      }
    } catch (error) {
      console.error(
        "Delete schedule error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Could not delete schedule"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (schedule) => {
    setEditSchedule(schedule);
    setOpen(true);
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px]">
          <thead className="bg-slate-100 dark:bg-slate-900">
            <tr>
              <th className="p-5 text-left text-slate-700 dark:text-slate-300">
                Bus
              </th>

              <th className="p-5 text-left text-slate-700 dark:text-slate-300">
                Driver
              </th>

              <th className="p-5 text-left text-slate-700 dark:text-slate-300">
                Route
              </th>

              <th className="p-5 text-left text-slate-700 dark:text-slate-300">
                Morning Trip
              </th>

              <th className="p-5 text-left text-slate-700 dark:text-slate-300">
                Evening Return
              </th>

              <th className="p-5 text-left text-slate-700 dark:text-slate-300">
                Status
              </th>

              <th className="p-5 text-center text-slate-700 dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {schedules.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-12 text-center text-gray-500 dark:text-slate-400"
                >
                  No Schedule Found
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => {
                const isDeleting =
                  deletingId === schedule.id;

                return (
                  <tr
                    key={schedule.id}
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-700/60"
                  >
                    <td className="p-5">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {schedule.busNo}
                      </p>

                      {schedule.busName &&
                        schedule.busName !==
                          "Not available" && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                            {schedule.busName}
                          </p>
                        )}
                    </td>

                    <td className="p-5 text-slate-700 dark:text-slate-300">
                      {schedule.driver}
                    </td>

                    <td className="p-5">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {schedule.route}
                      </p>

                      {schedule.source &&
                        schedule.destination &&
                        schedule.source !==
                          "Not available" &&
                        schedule.destination !==
                          "Not available" && (
                          <div className="mt-2 space-y-1 text-sm">
                            <p className="text-blue-600 dark:text-blue-300">
                              Morning:{" "}
                              {schedule.source} →{" "}
                              {schedule.destination}
                            </p>

                            <p className="text-purple-600 dark:text-purple-300">
                              Evening:{" "}
                              {schedule.destination} →{" "}
                              {schedule.source}
                            </p>
                          </div>
                        )}
                    </td>

                    <td className="p-5">
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <Sun size={18} />
                          <span className="font-semibold">
                            Morning
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                          Departure
                        </p>

                        <p className="font-bold text-slate-900 dark:text-white">
                          {formatDisplayTime(
                            schedule.departure
                          )}
                        </p>

                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          Arrival
                        </p>

                        <p className="font-bold text-slate-900 dark:text-white">
                          {formatDisplayTime(
                            schedule.arrival
                          )}
                        </p>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950/30">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                          <Moon size={18} />
                          <span className="font-semibold">
                            Evening
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                          Departure
                        </p>

                        <p className="font-bold text-slate-900 dark:text-white">
                          {formatDisplayTime(
                            schedule.returnDeparture
                          )}
                        </p>

                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          Arrival
                        </p>

                        <p className="font-bold text-slate-900 dark:text-white">
                          {formatDisplayTime(
                            schedule.returnArrival
                          )}
                        </p>
                      </div>
                    </td>

                    <td className="p-5">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          schedule.status ===
                          "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {schedule.status}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setViewSchedule(
                              schedule
                            )
                          }
                          disabled={isDeleting}
                          title="View schedule"
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(schedule)
                          }
                          disabled={isDeleting}
                          title="Edit schedule"
                          className="rounded-lg bg-green-100 p-2 text-green-600 transition hover:bg-green-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-900/30 dark:text-green-300"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              schedule
                            )
                          }
                          disabled={isDeleting}
                          title="Delete schedule"
                          className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/30 dark:text-red-300"
                        >
                          {isDeleting ? (
                            <LoaderCircle
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2
                              size={18}
                            />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}