import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';

const SuggestedQuestions = ({ questions = [], onSelectQuestion, className = '' }) => {
  const defaultQuestions = [
    "Explain my report in simple terms",
    "What values are abnormal or need attention?",
    "What questions should I ask my doctor?",
    "Who should I consult for these findings?"
  ];

  const displayQuestions = questions.length > 0 ? questions : defaultQuestions;

  return (
    <div className={`bg-indigo-50/40 border border-indigo-100/70 rounded-2xl p-4 sm:p-5 ${className}`}>
      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-primary" /> Suggested Questions
      </p>

      <div className="flex flex-wrap gap-2">
        {displayQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuestion && onSelectQuestion(q)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-primary hover:text-white border border-gray-200 hover:border-primary text-gray-700 rounded-xl text-xs font-semibold transition-all duration-200 shadow-xs hover:shadow active:scale-95 text-left"
          >
            <HelpCircle className="w-3 h-3 text-primary group-hover:text-white flex-shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
