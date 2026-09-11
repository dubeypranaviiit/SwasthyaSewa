import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Stethoscope, FileText, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import ReportValueCard from '../components/ai-health/ReportValueCard';
import DoctorRecommendation from '../components/ai-health/DoctorRecommendation';
import NextSteps from '../components/ai-health/NextSteps';
import MedicalDisclaimer from '../components/ai-health/MedicalDisclaimer';
import { getReport } from '../services/aiHealthService';
import { toast } from 'react-toastify';

const ReportSummaryPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getReport(reportId);
        setReport(data);
      } catch (error) {
        toast.error('Unable to load report details.');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">Loading report analysis...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Report Not Found</h3>
        <p className="text-xs text-gray-500">The requested report could not be found or has expired.</p>
        <button
          onClick={() => navigate('/ai-health-check')}
          className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md"
        >
          Go to AI Health Check
        </button>
      </div>
    );
  }

  const { summary, values = [], recommendedSpecialties = [] } = report;

  const filteredValues = statusFilter === 'all'
    ? values
    : values.filter(v => v.status === statusFilter);

  const primarySpecialty = recommendedSpecialties[0]?.specialty || 'General physician';

  return (
    <div className="py-6 sm:py-8 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-150">
        <button
          onClick={() => navigate('/ai-health-check')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-600 hover:text-primary transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upload</span>
        </button>

        <div className="flex items-center gap-3">
          {report.isDemo && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200">
              Demo Report
            </span>
          )}

          <button
            onClick={() => {
              navigate(`/ai-health-check/chat/${report.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-primary/20 active:scale-95 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask SwasthyaSewa AI</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Medical Report Analysis
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight mt-0.5">
                {report.title || report.fileName}
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Document: <span className="font-semibold text-gray-700">{report.fileName}</span> • Uploaded: <span className="font-semibold text-gray-700">{report.uploadedAt}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-gray-150">
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-emerald-900 tracking-tight">
                {summary.normalCount}
              </p>
              <p className="text-xs font-semibold text-emerald-700">Within reference range</p>
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-amber-900 tracking-tight">
                {summary.attentionCount}
              </p>
              <p className="text-xs font-semibold text-amber-800">Need attention</p>
            </div>
          </div>

          <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-rose-900 tracking-tight">
                {summary.abnormalCount}
              </p>
              <p className="text-xs font-semibold text-rose-800">Outside reference range</p>
            </div>
          </div>
        </div>

        {summary.aiInterpretation && (
          <div className="mt-6 bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-blue-50/50 border border-indigo-150/80 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wider">
                AI Clinical Interpretation Summary
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {summary.aiInterpretation}
            </p>
            <div className="mt-3 pt-3 border-t border-indigo-100/60 flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-medium">
                Want to dig deeper into specific numbers?
              </span>
              <button
                onClick={() => navigate(`/ai-health-check/chat/${report.id}`)}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Chat with Assistant →
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Report Parameters ({values.length})
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              Individual biomarker readings and lab-specific reference ranges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl border border-gray-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                statusFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({values.length})
            </button>
            <button
              onClick={() => setStatusFilter('attention')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                statusFilter === 'attention' ? 'bg-white text-amber-800 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Attention ({values.filter(v => v.status === 'attention').length})
            </button>
            <button
              onClick={() => setStatusFilter('abnormal')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                statusFilter === 'abnormal' ? 'bg-white text-rose-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Outside Range ({values.filter(v => v.status === 'abnormal').length})
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                statusFilter === 'normal' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Normal ({values.filter(v => v.status === 'normal').length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredValues.map((val) => (
            <ReportValueCard
              key={val.id}
              testName={val.testName}
              value={val.value}
              unit={val.unit}
              referenceRange={val.referenceRange}
              status={val.status}
              explanation={val.explanation}
            />
          ))}
        </div>
      </div>

      {recommendedSpecialties.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-primary" /> Who should you talk to?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Based on the observations in this report, consider discussing these findings with the recommended specialist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedSpecialties.map((rec, i) => (
              <DoctorRecommendation
                key={i}
                specialty={rec.specialty}
                reason={rec.reason}
                badge="Recommended Specialty"
              />
            ))}
          </div>
        </div>
      )}

      <NextSteps reportId={report.id} specialty={primarySpecialty} />

      <MedicalDisclaimer />
    </div>
  );
};

export default ReportSummaryPage;
