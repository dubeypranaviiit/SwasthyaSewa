import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  FileText, 
  Plus, 
  History, 
  SlidersHorizontal, 
  X, 
  Stethoscope, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import ChatMessage from '../components/ai-health/ChatMessage';
import ChatInput from '../components/ai-health/ChatInput';
import SuggestedQuestions from '../components/ai-health/SuggestedQuestions';
import TypingIndicator from '../components/ai-health/TypingIndicator';
import { 
  getReport, 
  getRecentReports, 
  sendChatMessage
} from '../services/aiHealthService';
import { sampleReports, defaultAssistantWelcomeMessage } from '../data/mockAiData';
import { toast } from 'react-toastify';

const AIChatPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [activeReport, setActiveReport] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [messages, setMessages] = useState([defaultAssistantWelcomeMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const recents = await getRecentReports();
        setRecentReports(recents);

        if (reportId) {
          const rep = await getReport(reportId);
          setActiveReport(rep);
          setMessages([
            {
              id: 'init-msg-1',
              role: 'assistant',
              content: `Hello! I've loaded your report: **${rep.title || rep.fileName}**.\n\nSummary Overview:\n• **${rep.summary?.totalParameters || 0} Total Parameters** measured\n• **${rep.summary?.normalCount || 0} Normal**, **${rep.summary?.attentionCount || 0} Needing Attention**, **${rep.summary?.abnormalCount || 0} Outside Range**.\n\n*How can I help you understand these findings today?*`,
              timestamp: 'Just now',
              type: 'text'
            }
          ]);
        } else {
          setActiveReport(sampleReports[0]);
        }
      } catch (error) {
        console.error('Error loading chat session:', error);
      }
    };

    loadData();
  }, [reportId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (userText) => {
    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const botResponse = await sendChatMessage({
        reportId: activeReport?.id,
        message: userText
      });
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: '⚠️ I encountered an issue retrieving the response. Please check your connection and try again.',
          timestamp: 'Just now',
          status: 'error'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    handleSendMessage("Please re-evaluate the previous question.");
  };

  const handleClearChat = () => {
    setMessages([defaultAssistantWelcomeMessage]);
    toast.info('Conversation refreshed');
  };

  const primarySpecialty = activeReport?.recommendedSpecialties?.[0]?.specialty || 'General physician';

  return (
    <div className="py-4 w-full h-[calc(100vh-130px)] min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 lg:hidden">
        <button
          onClick={() => setShowLeftDrawer(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold"
        >
          <History className="w-3.5 h-3.5" />
          <span>Reports</span>
        </button>

        <div className="text-center truncate px-2">
          <p className="font-bold text-xs text-gray-900 truncate">
            {activeReport ? activeReport.title || activeReport.fileName : 'SwasthyaSewa AI'}
          </p>
        </div>

        <button
          onClick={() => setShowRightDrawer(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-primary rounded-xl text-xs font-semibold"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Report Info</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 mt-2 h-full overflow-hidden">
        <div className="hidden lg:flex lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-4 flex-col justify-between overflow-hidden shadow-sm">
          <div className="overflow-hidden flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-gray-150 mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">
                  Recent Reports
                </h3>
              </div>
              <button
                onClick={() => navigate('/ai-health-check')}
                className="p-1 text-primary hover:bg-indigo-50 rounded-lg transition"
                title="Upload new report"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {recentReports.map((rep) => {
                const isSelected = activeReport?.id === rep.id;
                return (
                  <button
                    key={rep.id}
                    onClick={() => {
                      navigate(`/ai-health-check/chat/${rep.id}`);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-primary/5 border-primary shadow-xs'
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                          {rep.title || rep.fileName}
                        </p>
                        {rep.isDemo && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded">
                            Demo
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {rep.uploadedAt}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-150">
            <button
              onClick={() => navigate('/ai-health-check')}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>Upload Another Report</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl flex flex-col justify-between overflow-hidden shadow-sm h-full relative">
          <div className="px-5 py-3.5 border-b border-gray-150 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                  SwasthyaSewa AI <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                </h2>
                <p className="text-[11px] text-gray-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {activeReport ? activeReport.title || activeReport.fileName : 'Interactive Assistant'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              {activeReport && (
                <button
                  onClick={() => navigate(`/ai-health-check/report/${activeReport.id}`)}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline px-2 py-1"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-gray-50/40">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onRetry={handleRetry} />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={chatEndRef} />
          </div>

          {messages.length <= 2 && !isTyping && (
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <SuggestedQuestions
                questions={activeReport?.suggestedQuestions}
                onSelectQuestion={handleSendMessage}
              />
            </div>
          )}

          <ChatInput
            onSend={handleSendMessage}
            onUploadClick={() => navigate('/ai-health-check')}
            disabled={isTyping}
            placeholder={activeReport ? `Ask something about ${activeReport.title || 'your report'}...` : 'Ask a health question...'}
          />
        </div>

        <div className="hidden lg:flex lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-4 flex-col justify-between overflow-hidden shadow-sm">
          {activeReport ? (
            <div className="overflow-hidden flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-150">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">
                    Report Overview
                  </h3>
                </div>
                <button
                  onClick={() => navigate(`/ai-health-check/report/${activeReport.id}`)}
                  className="text-[11px] text-primary font-bold hover:underline"
                >
                  Full View
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-emerald-50 rounded-xl p-2.5 text-center border border-emerald-100">
                  <p className="text-base font-black text-emerald-800">{activeReport.summary?.normalCount || 0}</p>
                  <p className="text-[10px] font-semibold text-emerald-600">Normal</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-2.5 text-center border border-amber-100">
                  <p className="text-base font-black text-amber-800">{activeReport.summary?.attentionCount || 0}</p>
                  <p className="text-[10px] font-semibold text-amber-600">Attention</p>
                </div>
                <div className="bg-rose-50 rounded-xl p-2.5 text-center border border-rose-100">
                  <p className="text-base font-black text-rose-800">{activeReport.summary?.abnormalCount || 0}</p>
                  <p className="text-[10px] font-semibold text-rose-600">Outside</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Key Parameters</p>
                {activeReport.values?.slice(0, 5).map((val) => (
                  <div
                    key={val.id}
                    className="p-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 truncate">{val.testName}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        val.status === 'normal' ? 'bg-emerald-100 text-emerald-800' :
                        val.status === 'attention' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {val.value} {val.unit}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">Ref: {val.referenceRange}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-150 space-y-2">
                <button
                  onClick={() => {
                    navigate(`/doctors/${encodeURIComponent(primarySpecialty)}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 bg-primary hover:bg-opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Find {primarySpecialty}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xs text-gray-400">No active report selected</p>
            </div>
          )}
        </div>
      </div>

      {showLeftDrawer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden flex">
          <div className="bg-white w-[300px] h-full p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b mb-4">
                <span className="font-bold text-sm text-gray-900">Recent Reports</span>
                <button onClick={() => setShowLeftDrawer(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-2">
                {recentReports.map((rep) => (
                  <button
                    key={rep.id}
                    onClick={() => {
                      setShowLeftDrawer(false);
                      navigate(`/ai-health-check/chat/${rep.id}`);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:bg-indigo-50 block"
                  >
                    {rep.title || rep.fileName}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                setShowLeftDrawer(false);
                navigate('/ai-health-check');
              }}
              className="w-full py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md"
            >
              Upload New Report
            </button>
          </div>
          <div className="flex-1" onClick={() => setShowLeftDrawer(false)}></div>
        </div>
      )}

      {showRightDrawer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden flex justify-end">
          <div className="flex-1" onClick={() => setShowRightDrawer(false)}></div>
          <div className="bg-white w-[320px] h-full p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b mb-4">
                <span className="font-bold text-sm text-gray-900">Report Summary</span>
                <button onClick={() => setShowRightDrawer(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {activeReport && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-3 rounded-xl">
                    <p className="font-bold text-xs text-primary">{activeReport.title || activeReport.fileName}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{activeReport.summary?.overviewText}</p>
                  </div>

                  <div className="space-y-2">
                    {activeReport.values?.map((val) => (
                      <div key={val.id} className="p-2.5 border rounded-xl text-xs flex justify-between">
                        <span className="font-medium text-gray-800">{val.testName}</span>
                        <span className="font-bold text-gray-900">{val.value} {val.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowRightDrawer(false);
                navigate(`/doctors/${encodeURIComponent(primarySpecialty)}`);
              }}
              className="w-full py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md mt-4"
            >
              Find {primarySpecialty}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatPage;
