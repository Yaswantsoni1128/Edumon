import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total } = pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 px-2">
      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        Showing <span className="text-sky-600">{(page - 1) * pagination.limit + 1}</span> - 
        <span className="text-sky-600"> {Math.min(page * pagination.limit, total)}</span> of 
        <span className="text-sky-600"> {total}</span> entries
      </div>

      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 shadow-xl shadow-sky-100/20">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-xl text-sky-900 disabled:text-gray-300 hover:bg-white disabled:hover:bg-transparent transition-all shadow-sm disabled:shadow-none"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-1 px-4">
          <span className="text-sm font-black text-sky-600">{page}</span>
          <span className="text-sm font-black text-gray-300">/</span>
          <span className="text-sm font-black text-gray-400">{pages}</span>
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="p-2 rounded-xl text-sky-900 disabled:text-gray-300 hover:bg-white disabled:hover:bg-transparent transition-all shadow-sm disabled:shadow-none"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
