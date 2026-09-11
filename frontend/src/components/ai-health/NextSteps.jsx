import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Bot, Stethoscope, Calendar, ArrowRight, MessageSquare } from 'lucide-react';

const NextSteps = ({ reportId, specialty = 'General physician', className = '' }) => {
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      icon: <BarChart3 className="w-5 h-5 text-indigo-600" />,
      title: 'Review your results',
      desc: 'Understand the parameters, ranges, and observations detected in your report.'
    },
    {
      step: '02',
      icon: <Bot className="w-5 h-5 text-purple-600" />,
      title: 'Ask SwasthyaSewa AI',
      desc: 'Ask follow-up questions to clarify medical terminology in simple, everyday language.'
    },
    {
      step: '03',
      icon: <Stethoscope className="w-5 h-5 text-blue-600" />,
      title: 'Discuss with a doctor',
      desc: 'Connect with verified medical specialists to receive personalized clinical guidance.'
    },
    {
      step: '04',
      icon: <Calendar className="w-5 h-5 text-emerald-600" />,
      title: 'Book an appointment',
      desc: 'Choose a convenient date and time slot using our seamless appointment system.'
    }
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
            Recommended Action Plan
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-2">
            What's my next step?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Follow these simple steps to make the most of your health insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {reportId && (
            <button
              onClick={() => {
                navigate(`/ai-health-check/chat/${reportId}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-primary rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask AI About Report</span>
            </button>
          )}

          <button
            onClick={() => {
              navigate(specialty ? `/doctors/${encodeURIComponent(specialty)}` : '/doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-opacity-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary/20 transition active:scale-95"
          >
            <span>Find a Doctor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {steps.map((item) => (
          <div key={item.step} className="bg-gray-50/70 border border-gray-150 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:bg-white hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-gray-400 tracking-wider">
                  {item.step}
                </span>
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-xs">
                  {item.icon}
                </div>
              </div>
              <h4 className="font-bold text-sm text-gray-900 mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextSteps;
