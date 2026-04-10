import React from 'react';
import { motion } from 'framer-motion';

const GlassTable = ({ columns, data, isLoading, emptyMessage = "No records found." }) => {
  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-white/40 bg-white/30 backdrop-blur-md shadow-2xl shadow-sky-100/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sky-600/10 border-b border-white/40">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-sky-900/60">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-white/40 rounded-full w-2/3"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-20 text-center">
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest italic opacity-60">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={row._id || i} 
                  className="hover:bg-white/40 transition-colors group"
                >
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4 text-sm font-bold text-gray-700/80 group-hover:text-sky-900 transition-colors">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GlassTable;
