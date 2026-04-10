import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, GraduationCap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-3xl transition-all duration-1000 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col gap-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-700 text-[10px] font-black w-fit mx-auto lg:mx-0 border border-sky-100 uppercase tracking-[0.2em]">
            <Sparkles size={14} />
            <span>Digital Transformation</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-[0.95] tracking-tighter uppercase">
            THE SMART <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">ECOSYSTEM</span> <br/> FOR SCHOOLS
          </h1>

          <p className="text-gray-500 text-sm md:text-base max-w-xl leading-relaxed mx-auto lg:mx-0 font-bold uppercase tracking-widest opacity-80">
            BRIDGING THE GAP BETWEEN INSTITUTIONS AND PARENTS THROUGH INTELLIGENT REAL-TIME MONITORING.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto group relative px-10 py-5 bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-sky-100 hover:bg-sky-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                Start Experience
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all shadow-sm">
                The Vision
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-8 justify-center lg:justify-start mt-6 pt-6 border-t border-gray-100">
            {['Attendance', 'Analytics', 'Fees'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image / Visual Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full lg:w-1/2 relative"
        >
          <div className="relative z-10 w-full aspect-[4/5] md:aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-100 group">
             <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600"
                alt="Institutional Excellence"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-transparent to-transparent"></div>
              
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/20 shadow-2xl"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <GraduationCap size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-sky-300 font-black uppercase tracking-[0.2em]">System Status</p>
                    <p className="text-xl font-black text-white leading-tight uppercase tracking-tighter">Verified Institutional Node</p>
                  </div>
                </div>
              </motion.div>
          </div>
          
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
