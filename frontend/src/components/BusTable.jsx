import { Pencil, Trash2 } from "lucide-react";

const buses = [
    {
        id: 1,
        number: "HR26AB1234",
        driver: "Rahul",
        route: "Route A",
        status: "Running",
    },
    {
        id: 2,
        number: "HR26CD5678",
        driver: "Aman",
        route: "Route B",
        status: "Maintenance",
    },
    {
        id: 3,
        number: "HR26EF9012",
        driver: "Rohit",
        route: "Route C",
        status: "Idle",
    },
];

export default function BusTable() {
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

            <table className="w-full">

                <thead className="bg-gradient-to-r from-slate-900 to-blue-900 text-white">

                    <tr>

                        <th className="p-4 text-left">Bus No.</th>
                        <th>Driver</th>
                        <th>Route</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {buses.map((bus) => (

                        <tr key={bus.id} className="border-t">

                            <td className="p-4">{bus.number}</td>

                            <td>{bus.driver}</td>

                            <td>{bus.route}</td>

                            <td>

                                <span
                                    className={`px-4 py-2 rounded-full font-semibold ${bus.status === "Running"
                                        ? "bg-green-100 text-green-700"
                                        : bus.status === "Idle"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {bus.status}
                                </span>

                            </td>

                            <td>

                                <div className="flex gap-3">

                                    <button className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-600 hover:text-white transition">

                                        <Pencil size={18} />

                                    </button>

                                    <button className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-600 hover:text-white transition">

                                        <Trash2 size={18} />

                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}