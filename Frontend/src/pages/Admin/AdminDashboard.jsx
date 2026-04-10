import React from "react";
import { GraduationCap, Briefcase, IndianRupee, Megaphone, LogOut, ArrowRight, LayoutDashboard, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../../store/useAuthStore";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout(navigate);
  };

  const menuItems = [
    {
      title: "Student Management",
      desc: "Register profiles, manage classes, and track academic records.",
      icon: GraduationCap,
      color: "sky",
      link: "/admin/student",
      action: "Manage Enrollment"
    },
    {
      title: "Faculty Records",
      desc: "Assign teachers, monitor workloads, and manage specializations.",
      icon: Briefcase,
      color: "indigo",
      link: "/admin/teacher",
      action: "Manage Staff"
    },
    {
      title: "Financial Center",
      desc: "Monitor fee collections, track arrears, and generate reports.",
      icon: IndianRupee,
      color: "emerald",
      link: "/admin/fee",
      action: "Fee Dashboard"
    },
    {
      title: "Notice Board",
      desc: "Broadcast official announcements and manage institutional alerts.",
      icon: Megaphone,
      color: "orange",
      link: "/admin/notice",
      action: "Publish Alert"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-10">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-sky-600 rounded-[1.5rem] text-white shadow-xl shadow-sky-200">
            <LayoutDashboard size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-sky-950 uppercase tracking-tighter">
              Admin <span className="text-sky-600 italic">Console</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Institution Monitoring & Control System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-black text-sky-900 uppercase">Administrator</span>
            <span className="text-[10px] font-bold text-gray-400 italic">Connected</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-4 bg-white/80 backdrop-blur-md border border-red-50 text-red-600 rounded-2xl shadow-xl shadow-red-50 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest active:scale-[0.98]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {menuItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white/40 backdrop-blur-md border border-white/60 p-10 rounded-[2.5rem] shadow-2xl shadow-sky-100/30 overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 bg-${item.color}-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />

            <div className="relative z-10 flex flex-col h-full">
              <div className={`p-5 bg-${item.color}-50 text-${item.color}-600 rounded-[1.5rem] w-fit mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                <item.icon size={32} />
              </div>

              <h3 className="text-2xl font-black text-sky-950 uppercase tracking-tight mb-3">
                {item.title}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-10 leading-relaxed max-w-sm">
                {item.desc}
              </p>

              <Link 
                to={item.link} 
                className={`mt-auto flex items-center gap-3 text-${item.color}-600 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-5 transition-all outline-none`}
              >
                <span>{item.action}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-20 flex justify-center">
        <div className="px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg flex items-center gap-3">
          <Settings size={14} className="text-gray-400 animate-spin-slow" />
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            System Control Panel v4.0.2
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
