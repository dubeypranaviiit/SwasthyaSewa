import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Stethoscope, ArrowRight, Activity, HelpCircle } from 'lucide-react';
import ReportUploader from '../components/ai-health/ReportUploader';
import ReportProcessing from '../components/ai-health/ReportProcessing';
import MedicalDisclaimer from '../components/ai-health/MedicalDisclaimer';
import { uploadReport } from '../services/aiHealthService';
import { toast } from 'react-toastify';

const AIHealthCheck = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFileName, setProcessingFileName] = useState('');

  const handleUpload = async (file) => {
    try {
      setProcessingFileName(file.name);
      setIsProcessing(true);
      
      const report = await uploadReport(file);
      setIsProcessing(false);
      
      toast.success('Report analyzed successfully!');
      navigate(`/ai-health-check/report/${report.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setIsProcessing(false);
      toast.error('Failed to process report. Please try again.');
    }
  };

  const handleSelectDemo = (sampleReport) => {
    navigate(`/ai-health-check/report/${sampleReport.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const useCases = [
    {
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      title: "Understand my report",
      desc: "Decode lab terminology and complex test names into clear, everyday language."
    },
    {
      icon: <Activity className="w-5 h-5 text-rose-600" />,
      title: "Find abnormal values",
      desc: "Spot parameters that fall outside standard reference intervals at a single glance."
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-amber-600" />,
      title: "Explain medical terms",
      desc: "Ask the AI assistant to explain any unfamiliar units, markers, or medical words."
    },
    {
      icon: <Stethoscope className="w-5 h-5 text-emerald-600" />,
      title: "Prepare questions for doctor",
      desc: "Get intelligent conversation starters and questions ready for your appointment."
    }
  ];

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto w-full">
      {isProcessing ? (
        <div className="py-12">
          <ReportProcessing fileName={processingFileName} />
        </div>
      ) : (
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-tight">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SwasthyaSewa AI Health Assistant</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Understand your medical reports in <span className="text-primary">simple language</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
              Upload your lab results or diagnostic document and let SwasthyaSewa AI summarize parameters, explain ranges, and guide your next clinical steps.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <ReportUploader
              onUpload={handleUpload}
              onSelectDemo={handleSelectDemo}
              isUploading={isProcessing}
            />
          </div>

          <div className="pt-8">
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                How SwasthyaSewa AI helps you
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Designed to make your medical reports approachable and actionable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {useCases.map((uc, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-150 flex items-center justify-center mb-3">
                      {uc.icon}
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">
                      {uc.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {uc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-primary text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">
                Seamless Healthcare Journey
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Upload &rarr; Understand &rarr; Consult Doctors
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-lg">
                After understanding your report parameters, directly book a consultation with our verified doctors.
              </p>
            </div>

            <button
              onClick={() => {
                navigate('/doctors');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white text-primary hover:bg-gray-50 font-bold rounded-xl text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 flex-shrink-0"
            >
              <span>Browse All Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="max-w-3xl mx-auto pt-2">
            <MedicalDisclaimer />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHealthCheck;
