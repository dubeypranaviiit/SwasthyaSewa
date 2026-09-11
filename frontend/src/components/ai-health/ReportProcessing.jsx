import React from 'react';
import { Sparkles, FileSearch, ShieldCheck } from 'lucide-react';

const ReportProcessing = ({ fileName = 'Medical_Report.pdf', className = '' }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-3xl p-8 sm:p-14 shadow-sm text-center max-w-xl mx-auto flex flex-col items-center justify-center ${className}`}>
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary relative z-10 shadow-inner">
          <FileSearch className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl animate-ping opacity-60"></div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-2">
        🔬 Analyzing your report...
      </h3>

      <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
        We're processing the parameters and reference intervals from <span className="font-semibold text-gray-900">"{fileName}"</span>.
      </p>

      <div className="w-full max-w-xs bg-gray-100 h-2 rounded-full overflow-hidden mb-5">
        <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full w-full animate-pulse"></div>
      </div>

      <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>This usually takes just a few moments...</span>
      </p>
    </div>
  );
};

export default ReportProcessing;
