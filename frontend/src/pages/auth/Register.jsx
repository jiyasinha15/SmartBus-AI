import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500">

      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden">

        <div className="absolute w-80 h-80 bg-white/10 rounded-full blur-3xl top-10 left-20"></div>
        <div className="absolute w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl bottom-0 right-0"></div>

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white z-10"
        >
          <h1 className="text-6xl font-extrabold leading-tight">
            Join Smart Bus
          </h1>

          <p className="mt-6 text-xl text-blue-100">
            Create your account and enjoy smarter transportation.
          </p>

          <div className="mt-10 text-lg space-y-3">
            <p>🚌 Live Bus Tracking</p>
            <p>📍 Optimized Routes</p>
            <p>🔒 Secure Login</p>
          </div>
        </motion.div>

      </div>

      {/* Right Side */}

      <div className="flex-1 flex items-center justify-center p-5">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md bg-white/15 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8"
        >

          <h2 className="text-4xl font-bold text-white">
            Create Account 🚍
          </h2>

          <p className="text-blue-100 mt-2 mb-8">
            Register as Student or Driver
          </p>

          {/* Name */}

          <div className="relative mb-4">
            <FaUser className="absolute left-4 top-4 text-gray-500" />

            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 py-4 rounded-xl outline-none bg-white"
            />
          </div>

          {/* Email */}

          <div className="relative mb-4">
            <FaEnvelope className="absolute left-4 top-4 text-gray-500" />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 py-4 rounded-xl outline-none bg-white"
            />
          </div>

          {/* Role */}

          <select className="w-full py-4 px-4 rounded-xl mb-4 outline-none bg-white">

            <option>Select Role</option>

            <option>Student</option>

            <option>Driver</option>

          </select>

          {/* Password */}

          <div className="relative mb-4">

            <FaLock className="absolute left-4 top-4 text-gray-500" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 rounded-xl outline-none bg-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>

          {/* Confirm Password */}

          <div className="relative mb-6">

            <FaLock className="absolute left-4 top-4 text-gray-500" />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full pl-12 py-4 rounded-xl outline-none bg-white"
            />

          </div>

          <button className="w-full py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 transition">

            Create Account

          </button>

          <p className="text-center text-white mt-8">

            Already have an account?

            <Link
              to="/"
              className="ml-2 font-bold text-cyan-300 hover:text-white"
            >
              Login
            </Link>

          </p>

        </motion.div>

      </div>

    </div>
  );
}