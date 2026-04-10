import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, User, Mail, Lock, Phone, School, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/signup`, {
        name: fullName,
        email,
        password,
        role: "admin",
        contactNumber,
        schoolName,
      });

      toast.success("Admin account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong during signup.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f8] p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Left Section - Hero */}
        <div className="hidden w-1/2 bg-gradient-to-br from-indigo-700 via-sky-700 to-sky-600 p-12 text-white md:flex flex-col justify-center items-center text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-3xl mb-8 border border-white/20 shadow-xl"
          >
            <img 
              src="./smartSchoolTracker.jpg" 
              alt="EdumonLogo" 
              className="w-32 h-32 rounded-2xl object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150?text=Edumon";
              }}
            />
          </motion.div>
          <h1 className="text-3xl font-bold mb-4 tracking-tight">JOIN EDUMON</h1>
          <div className="w-12 h-1 bg-sky-400 rounded-full mb-6"></div>
          <p className="text-sky-100 text-sm leading-relaxed max-w-xs">
            Empower your institution with smart tracking and seamless management tools.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-full p-8 md:p-12 md:w-1/2">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Admin Sign Up</h2>
            <p className="text-gray-500 mt-2 text-sm italic">
              Note: Students and Teachers accounts are created via the Admin Dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-sky-600" />
                  Full Name
                </label>
                <input
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200 outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Phone size={14} className="text-sky-600" />
                  Contact
                </label>
                <input
                  disabled={loading}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  type="tel"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200 outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <School size={14} className="text-sky-600" />
                School Name
              </label>
              <input
                disabled={loading}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                type="text"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200 outline-none"
                placeholder="Excellence Public School"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Mail size={14} className="text-sky-600" />
                Email Address
              </label>
              <input
                disabled={loading}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200 outline-none"
                placeholder="admin@school.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Lock size={14} className="text-sky-600" />
                  Password
                </label>
                <input
                  disabled={loading}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Lock size={14} className="text-sky-600" />
                  Confirm
                </label>
                <input
                  disabled={loading}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-200 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-indigo-700 px-6 py-3.5 text-white font-bold shadow-lg shadow-sky-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
            >
              <span className={`flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}>
                CREATE ACCOUNT
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-sky-600 hover:text-sky-700 transition-colors underline-offset-4 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
