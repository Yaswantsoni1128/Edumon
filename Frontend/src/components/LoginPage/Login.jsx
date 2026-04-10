import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, UserCircle, ArrowRight } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const Login = () => {
  const [userType, setUserType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password, userType, navigate);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full max-w-4xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-sky-100/50 border border-gray-100"
      >
        {/* Left Section - Hero */}
        <div className="hidden w-1/2 bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 p-12 text-white md:flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-sky-400/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] mb-8 border border-white/20 shadow-xl relative z-10"
          >
            <img 
              src="./smartSchoolTracker.jpg" 
              alt="EdumonLogo" 
              className="w-24 h-24 rounded-2xl object-cover shadow-lg"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150?text=Edumon";
              }}
            />
          </motion.div>
          <h1 className="text-2xl font-black mb-4 tracking-tighter relative z-10 uppercase">WELCOME TO EDUMON</h1>
          <div className="w-10 h-1 bg-sky-400 rounded-full mb-6 relative z-10"></div>
          <p className="text-sky-100 text-xs font-bold leading-relaxed max-w-xs relative z-10 uppercase tracking-widest opacity-80">
            The intelligent school tracking ecosystem. Experience seamless monitoring of attendance, academics, and communication.
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="w-full p-10 md:p-14 md:w-1/2 bg-white">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sign In</h2>
            <p className="text-gray-400 mt-2 text-sm font-semibold">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                <UserCircle size={14} className="text-sky-600" />
                Login As
              </label>
              <div className="relative group">
                <select
                  disabled={loading}
                  className="w-full appearance-none rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm font-bold text-gray-700 transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none disabled:opacity-60 cursor-pointer"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 group-focus-within:text-sky-600 transition-colors">
                  <ArrowRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                <Mail size={14} className="text-sky-600" />
                Email Address
              </label>
              <input
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm font-bold text-gray-700 transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none disabled:opacity-60"
                placeholder="yash@edumon.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Lock size={14} className="text-sky-600" />
                  Password
                </label>
                <a href="#" className="text-[10px] font-black text-sky-600 hover:text-sky-700 transition-colors uppercase tracking-widest">Forgot?</a>
              </div>
              <input
                type="password"
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm font-bold text-gray-700 transition-all focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 outline-none disabled:opacity-60"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-700 px-6 py-4 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-sky-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <span className={`flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-0' : 'opacity-100'}`}>
                SIGN IN
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              )}
            </button>

            <p className="text-center text-[10px] font-black text-gray-400 mt-8 uppercase tracking-[0.15em]">
              Not a member yet?{" "}
              <Link to="/signup" className="text-sky-600 hover:text-sky-700 transition-colors hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
