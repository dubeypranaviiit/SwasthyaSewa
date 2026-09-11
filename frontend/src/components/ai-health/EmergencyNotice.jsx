import React from 'react';
import { AlertOctagon, PhoneCall } from 'lucide-react';

const EmergencyNotice = ({ 
  title = "Seek urgent medical care", 
  message = "If you or someone nearby is experiencing severe chest pain, shortness of breath, sudden numbness, or loss of consciousness, seek immediate emergency medical care.", 
  actionText = "Emergency Help: +91 8092599674",
  className = ""
}) => {
  return (
    <div className={`bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-5 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
          <AlertOctagon className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm sm:text-base font-bold text-red-900 mb-1 flex items-center gap-2">
            🚨 {title}
          </h4>
          <p className="text-xs sm:text-sm text-red-700 leading-relaxed mb-3">
            {message}
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <a 
              href="tel:+918092599674"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{actionText}</span>
            </a>
            <span className="text-[11px] text-red-500 font-medium">
              National Emergency: 112
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyNotice;
