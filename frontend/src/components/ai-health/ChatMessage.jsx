import React, { useState } from 'react';
import { Bot, User, Copy, Check, RotateCcw } from 'lucide-react';
import DoctorRecommendation from './DoctorRecommendation';
import EmergencyNotice from './EmergencyNotice';

const ChatMessage = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isEmergency = message.type === 'emergency' || !!message.emergencyData;
  const isDoctorRec = message.type === 'doctor_recommendation' || (message.specialties && message.specialties.length > 0);

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const bulletText = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs sm:text-sm leading-relaxed my-1">
            {formatInlineText(bulletText)}
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed my-1">
          {formatInlineText(line)}
        </p>
      );
    });
  };

  const formatInlineText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-gray-600">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className={`flex items-start gap-2.5 sm:gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm transition-all ${
            isUser
              ? 'bg-primary text-white rounded-tr-none'
              : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none hover:border-gray-300'
          }`}
        >
          {isEmergency && (
            <div className="mb-3">
              <EmergencyNotice 
                title={message.emergencyData?.title}
                message={message.emergencyData?.message}
                actionText={message.emergencyData?.actionText}
              />
            </div>
          )}

          <div className={isUser ? 'text-white' : 'text-gray-800'}>
            {renderFormattedContent(message.content)}
          </div>

          {isDoctorRec && message.specialties && (
            <div className="mt-3.5 space-y-2.5">
              {message.specialties.map((rec, i) => (
                <DoctorRecommendation
                  key={i}
                  specialty={rec.specialty}
                  reason={rec.reason}
                  badge="Recommended Specialist"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-gray-400">
          {message.timestamp && <span>{message.timestamp}</span>}
          
          {!isUser && message.content && (
            <button
              onClick={handleCopy}
              className="hover:text-gray-700 transition flex items-center gap-1 font-medium"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}

          {message.status === 'error' && onRetry && (
            <button
              onClick={() => onRetry(message)}
              className="text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
