import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
  const isDanger = type === "danger";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-sky-950/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2rem] border border-white shadow-2xl overflow-hidden p-8"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-4 rounded-2xl mb-6 ${isDanger ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-600'}`}>
                <AlertCircle size={32} />
              </div>
              
              <h3 className="text-xl font-black text-sky-950 uppercase tracking-tight mb-2">
                {title}
              </h3>
              <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
                {message}
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={onConfirm}
                  className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] ${
                    isDanger 
                      ? 'bg-red-600 text-white shadow-xl shadow-red-100 hover:bg-red-700' 
                      : 'bg-sky-600 text-white shadow-xl shadow-sky-100 hover:bg-sky-700'
                  }`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                >
                  {cancelText}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
