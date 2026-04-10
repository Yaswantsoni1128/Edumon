import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchFilter = ({ searchTerm, onSearchChange, placeholder = "Search...", filters = [] }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      {/* Search Bar */}
      <div className="flex-grow relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400 group-focus-within:text-sky-600 transition-colors" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-14 pr-6 py-4 bg-white/50 backdrop-blur-md border border-white/40 rounded-[1.5rem] text-sm font-bold text-sky-900 placeholder:text-gray-400 outline-none focus:ring-4 focus:ring-sky-100 transition-all shadow-xl shadow-sky-100/10"
        />
      </div>

      {/* Filters (Dynamic) */}
      {filters.map((f, i) => (
        <div key={i} className="relative min-w-[180px]">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Filter size={16} className="text-sky-600" />
          </div>
          <select
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white/50 backdrop-blur-md border border-white/40 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-sky-900 appearance-none outline-none focus:ring-4 focus:ring-sky-100 transition-all shadow-xl shadow-sky-100/10 cursor-pointer"
          >
            <option value="">{f.label}</option>
            {f.options.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.text}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-sky-400 rotate-45 mb-1 px-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchFilter;
