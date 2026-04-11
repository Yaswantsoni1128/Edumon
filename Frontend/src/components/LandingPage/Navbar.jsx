import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Rocket, ShieldCheck, LayoutDashboard, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: Rocket },
    { name: "About", path: "/about", icon: ShieldCheck },
    { name: "Services", path: "/services", icon: LayoutDashboard },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-2 bg-white/90 backdrop-blur-xl shadow-xl' : 'py-4 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-sky-600 rounded-2xl shadow-lg shadow-sky-200 group-hover:scale-110 transition-all duration-500">
                <img src="./smartSchoolTracker.jpg" alt="logo" className="h-8 w-8 rounded-lg object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-sky-900 tracking-tighter uppercase">
                  EDU<span className="text-sky-600">MON</span>
                </span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-1">
                  Built by <span className="text-sky-600">Yaswant</span> <span className="text-red-500 animate-pulse">❤️</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex bg-gray-50 p-1.5 rounded-[1.5rem] border border-gray-100 shadow-inner">
              {navLinks.map(({ name, path, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
                      isActive 
                        ? 'bg-white text-sky-600 shadow-sm' 
                        : 'text-gray-400 hover:text-sky-600 hover:bg-white/50'
                    }`
                  }
                >
                  <Icon size={14} />
                  {name}
                </NavLink>
              ))}
            </div>
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <Link to="/login" className="flex items-center gap-2 bg-sky-600 text-white px-7 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xl shadow-sky-100 hover:bg-sky-700 hover:scale-105 active:scale-95 transition-all">
              <User size={16} />
              Login
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-3 rounded-2xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-3xl z-50"
          >
            <div className="px-4 py-8 space-y-4">
              {navLinks.map(({ name, path, icon: Icon }) => (
                <NavLink
                  key={name}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      isActive 
                        ? 'bg-sky-50 text-sky-600' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon size={18} />
                  {name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-gray-50">
                <Link 
                  to="/login" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-3 w-full bg-sky-600 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-sky-100"
                >
                  <User size={18} />
                  Access Portal
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
