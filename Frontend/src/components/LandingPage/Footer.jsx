import React from "react";
import { Github, Linkedin, Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-sky-950 text-sky-100/80 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3">
             <div className="p-1.5 bg-white rounded-xl">
               <img src="./smartSchoolTracker.jpg" alt="logo" className="h-8 w-8 rounded-lg object-cover" />
             </div>
             <span className="text-2xl font-black text-white tracking-tight">
               EDU<span className="text-sky-500">MON</span>
             </span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            The intelligent school tracking ecosystem empowering educators and parents to nurture the next generation of leaders.
          </p>
          <div className="flex gap-4">
            {[
              { icon: Linkedin, href: "https://www.linkedin.com/in/yaswant-soni-8b6412282" },
              { icon: Github, href: "https://github.com/Yaswantsoni1128" },
              { icon: Instagram, href: "https://www.instagram.com/" },
              { icon: Facebook, href: "https://www.facebook.com/" }
            ].map((social, i) => (
              <a 
                key={i}
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Navigation</h4>
          <ul className="space-y-4 text-sm font-medium">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <li key={item}>
                <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Global Office</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-sky-500 shrink-0" />
              <span>IIIT Una, Himachal Pradesh, India - 177209</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-sky-500 shrink-0" />
              <span>support@edumon.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-sky-500 shrink-0" />
              <span>+91 8003999085</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
          <p className="text-xs mb-4">Stay updated with our latest releases and school management tips.</p>
          <div className="space-y-2">
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-sky-500 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-sky-500 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-sky-100/40">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p>© {new Date().getFullYear()} Edumon.</p>
          <div className="h-4 w-px bg-white/10 hidden md:block"></div>
          <p className="flex items-center gap-1.5">
            Built by <span className="text-white">Yaswant</span> with <span className="text-red-500 animate-pulse">❤️</span>
          </p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
