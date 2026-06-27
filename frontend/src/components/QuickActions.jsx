import {
  Bus,
  Users,
  Route,
  UserCog,
} from "lucide-react";

const actions = [
  {
    title: "Add Bus",
    icon: <Bus size={28} />,
    color: "bg-blue-500",
  },
  {
    title: "Add Driver",
    icon: <UserCog size={28} />,
    color: "bg-green-500",
  },
  {
    title: "Add Student",
    icon: <Users size={28} />,
    color: "bg-orange-500",
  },
  {
    title: "Add Route",
    icon: <Route size={28} />,
    color: "bg-purple-500",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {actions.map((item) => (
          <button
            key={item.title}
            className={`${item.color} text-white rounded-2xl p-6 hover:scale-105 transition`}
          >
            <div className="flex flex-col items-center gap-3">
              {item.icon}
              <span>{item.title}</span>
            </div>
          </button>
        ))}

      </div>

    </div>
  );
}