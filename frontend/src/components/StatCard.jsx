import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon,
  color,
  increase,
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`bg-gradient-to-r ${color} rounded-3xl p-6 shadow-xl text-white relative overflow-hidden`}
    >
      <div className="absolute -right-5 -top-5 w-24 h-24 bg-white/10 rounded-full"></div>

      <div className="flex justify-between items-center">

        <div>

          <p className="text-lg opacity-90">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

          <div className="flex items-center gap-1 mt-4">

            <ArrowUpRight size={18} />

            <span>{increase}</span>

          </div>

        </div>

        <div className="bg-white/20 p-4 rounded-2xl">

          {icon}

        </div>

      </div>

    </motion.div>
  );
}