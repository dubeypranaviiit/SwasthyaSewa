import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import AIAssistantPanel from './ai-health/AIAssistantPanel';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close SwasthyaSewa AI Assistant" : "Open SwasthyaSewa AI Assistant"}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-violet-600 via-indigo-600 to-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-primary/20"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <AIAssistantPanel onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default Chatbot;
