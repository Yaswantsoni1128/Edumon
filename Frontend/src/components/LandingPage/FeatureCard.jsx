import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, link = "/login" }) => {
  return (
    <Link to={link || "/login"} className="block group h-full">
      <div className="h-full bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden flex flex-col">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-[3rem] -mr-8 -mt-8 transition-all duration-500 group-hover:bg-sky-100 group-hover:scale-150 opacity-40"></div>

        <div className="relative z-10 flex flex-col h-full">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500">
            {typeof Icon === 'string' ? (
              <img src={Icon} alt={title} className="w-6 h-6 object-contain" />
            ) : (
              <Icon size={24} />
            )}
          </div>

          <h3 className="text-lg font-black text-gray-900 mb-3 group-hover:text-sky-600 transition-colors duration-300 tracking-tight">
            {title}
          </h3>

          <p className="text-gray-400 leading-relaxed text-xs font-bold mb-6 flex-grow">
            {description}
          </p>

          <div className="flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-widest transition-all duration-300 group-hover:translate-x-2">
            EXPLORE
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
