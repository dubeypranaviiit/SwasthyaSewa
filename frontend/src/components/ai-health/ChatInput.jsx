import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

const ChatInput = ({ onSend, onUploadClick, disabled = false, placeholder = 'Ask something about your report...' }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
      <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-xs">
        {onUploadClick && (
          <button
            type="button"
            onClick={onUploadClick}
            disabled={disabled}
            aria-label="Upload report document"
            className="p-2 text-gray-400 hover:text-primary transition rounded-xl hover:bg-gray-100 disabled:opacity-40"
            title="Attach a report document"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        )}

        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent border-0 outline-none resize-none text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 max-h-28 py-1.5 px-1 leading-relaxed"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          aria-label="Send message"
          className="w-9 h-9 rounded-xl bg-primary hover:bg-opacity-95 text-white flex items-center justify-center transition shadow-sm active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-400 px-1 mt-1.5">
        <span>Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Enter ↵</kbd> to send, <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Shift+Enter</kbd> for newline</span>
        <span>SwasthyaSewa AI</span>
      </div>
    </div>
  );
};

export default ChatInput;
