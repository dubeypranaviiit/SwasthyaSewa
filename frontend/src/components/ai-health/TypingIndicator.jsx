import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-2.5 my-2">
      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-primary shadow-xs">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-xs flex items-center gap-1.5">
        <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
