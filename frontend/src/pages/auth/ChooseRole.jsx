import { motion } from "framer-motion";
import { FaUserGraduate, FaBus, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ChooseRole() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student",
      icon: <FaUserGraduate size={45} />,
      color: "from-blue-500 to-cyan-500",
      role: "student",
    },
    {
      title: "Driver",
      icon: <FaBus size={45} />,
      color: "from-green-500 to-emerald-500",
      role: "driver",
    },
    {
      title: "Admin",
      icon: <FaUserShield size={45} />,
      color: "from-purple-500 to-pink-500",
      role: "admin",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500 flex items-center justify-center px-5">

      <div className="text-center w-full">

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-5xl font-bold mb-3"
        >
          Smart Bus Routing System
        </motion.h1>

        <p className="text-blue-100 mb-14 text-lg">
          Choose your role to continue
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {roles.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -12,
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/login/${item.role}`)}
              className="cursor-pointer rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-10"
            >

              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto text-white shadow-lg`}
              >
                {item.icon}
              </div>

              <h2 className="text-white text-3xl font-bold mt-8">
                {item.title}
              </h2>

              <p className="text-blue-100 mt-3">
                Continue as {item.title}
              </p>

              <button
                className={`mt-8 px-8 py-3 rounded-xl bg-gradient-to-r ${item.color} text-white font-semibold hover:shadow-xl transition`}
              >
                Continue
              </button>

            </motion.div>
          ))}

        </div>

      </div>

    </div>
  );
}