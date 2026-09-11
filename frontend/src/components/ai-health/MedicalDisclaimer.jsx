import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

const MedicalDisclaimer = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 text-[11px] text-gray-500 font-medium ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span>SwasthyaSewa AI provides informational assistance and does not replace professional medical advice.</span>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50/60 border border-blue-150/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed ${className}`}>
      <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-gray-800 mb-0.5">Medical Disclaimer</p>
        <p>
          SwasthyaSewa AI provides informational insights to help you understand medical documents. It is not a diagnostic tool and does not replace the judgment of qualified healthcare professionals. Always consult a certified doctor for medical diagnosis or treatment decisions.
        </p>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
