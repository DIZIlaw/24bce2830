import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, User, BookOpen, Database, Sparkles, Building2, Cloud } from 'lucide-react';

export default function DeveloperModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10"
          >
            {/* Top Gradient Banner */}
            <div className="relative h-28 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 p-6 flex items-center justify-between overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10 text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium mb-1">
                  <Sparkles size={12} />
                  <span>Academic Project</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">Project & Developer Details</h3>
              </div>
              <button
                onClick={onClose}
                className="relative z-10 p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-5">
              
              {/* Developer Profile Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 flex-shrink-0">
                  SR
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      Shaurya Raghuvanshi
                    </h4>
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-600 text-white rounded-md">
                      Developer
                    </span>
                  </div>
                  <p className="text-sm font-mono font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Reg. No: 24BIT0606
                  </p>
                </div>
              </div>

              {/* Detail Items */}
              <div className="space-y-3">
                {/* Academic Context */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mt-0.5">
                    <Cloud size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course / Platform</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                      Cloud Architecture and Design Project
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      VIT Campus Marketplace — Closed campus secure buying & selling platform
                    </p>
                  </div>
                </div>

                {/* Faculty Supervision */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 mt-0.5">
                    <Award size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faculty Guide / Supervision</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                      Prof. Priya V
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Cloud Architecture and Design • School of Computer Science & Engineering
                    </p>
                  </div>
                </div>

                {/* Institution */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 mt-0.5">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Institution</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                      Vellore Institute of Technology (VIT)
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  Close
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
