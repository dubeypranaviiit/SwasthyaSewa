import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, X, FileText, MessageSquare, Stethoscope, ShieldCheck, ArrowRight } from 'lucide-react';

const AIAssistantPanel = ({ onClose }) => {
  const navigate = useNavigate();

  const handleAnalyzeReport = () => {
    onClose && onClose();
    navigate('/ai-health-check');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskQuestion = () => {
    onClose && onClose();
    navigate('/ai-health-check/chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFindDoctor = () => {
    onClose && onClose();
    navigate('/doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-w-sm bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-primary px-5 py-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
              SwasthyaSewa AI <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </h4>
            <p className="text-[11px] text-white/80">Your Medical Report Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center transition"
          aria-label="Close assistant"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-4 bg-gray-50/50">
        <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-xs">
          <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug mb-1">
            👋 Namaste! I'm your SwasthyaSewa AI assistant.
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            I can help you understand your medical reports, clarify lab parameters in simple language, and guide you to the right doctor.
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleAnalyzeReport}
            className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-primary/20 active:scale-98 transition group"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </span>
              <span>Analyze Medical Report</span>
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={handleAskQuestion}
            className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-indigo-50/60 border border-gray-200 hover:border-primary/40 text-gray-800 rounded-2xl font-bold text-xs sm:text-sm shadow-xs active:scale-98 transition group"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-50 text-primary flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </span>
              <span>Ask a Health Question</span>
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={handleFindDoctor}
            className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl font-semibold text-xs transition group"
          >
            <span className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                <Stethoscope className="w-3.5 h-3.5" />
              </span>
              <span>Browse Doctors & Specialties</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-700" />
          </button>
        </div>

        <div className="pt-2 border-t border-gray-150 flex items-start gap-1.5 text-[10px] text-gray-500 leading-normal">
          <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
          <span>AI-generated information is for informational purposes and does not replace professional medical advice.</span>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
