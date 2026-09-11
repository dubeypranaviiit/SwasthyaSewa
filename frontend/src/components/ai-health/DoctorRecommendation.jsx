import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, ArrowRight, UserCheck } from 'lucide-react';

const DoctorRecommendation = ({
  specialty = 'General physician',
  reason = 'A general physician can review the report along with your symptoms, history, and other clinical context.',
  badge = 'Recommended Starting Point',
  onSelectSpecialty,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (onSelectSpecialty) {
      onSelectSpecialty(specialty);
      return;
    }
    const encoded = encodeURIComponent(specialty);
    navigate(`/doctors/${encoded}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 border border-indigo-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mb-0.5">
              {badge}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              {specialty}
            </h4>
          </div>
        </div>

        <button
          onClick={handleNavigate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-opacity-90 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow active:scale-95 transition-all"
        >
          <span>Find {specialty}s</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-indigo-50 rounded-xl p-3.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
        <p className="font-semibold text-gray-700 text-xs mb-1 flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-primary" /> Why consult this specialty?
        </p>
        <p>{reason}</p>
      </div>
    </div>
  );
};

export default DoctorRecommendation;
