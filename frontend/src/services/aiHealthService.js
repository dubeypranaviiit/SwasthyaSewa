import axios from 'axios';
import { sampleReports, defaultAssistantWelcomeMessage, cannedResponses } from '../data/mockAiData';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_AI !== 'false';
const AI_BACKEND_URL = import.meta.env.VITE_AI_BACKEND_URL || (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

const STORAGE_REPORTS_KEY = 'swasthya_ai_reports';

const getStoredReports = () => {
  try {
    const data = localStorage.getItem(STORAGE_REPORTS_KEY);
    if (data) return JSON.parse(data);
  } catch {
  }
  return sampleReports;
};

const saveStoredReports = (reports) => {
  try {
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
  } catch {
  }
};

export const uploadReport = async (file) => {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newReportId = `rep_${Date.now()}`;
    const mockReport = {
      id: newReportId,
      fileName: file.name || "Uploaded_Medical_Report.pdf",
      fileSize: file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : "2.1 MB",
      fileType: file.name?.endsWith('.png') ? 'png' : file.name?.endsWith('.jpg') || file.name?.endsWith('.jpeg') ? 'jpg' : 'pdf',
      uploadedAt: "Just now",
      status: "completed",
      isDemo: false,
      title: "Analyzed Medical Report",
      summary: {
        totalParameters: 8,
        normalCount: 6,
        attentionCount: 2,
        abnormalCount: 0,
        overviewText: `Report processed for ${file.name}. 8 clinical parameters identified from the uploaded document.`,
        aiInterpretation: "Key parameters from your uploaded document have been indexed. A consultation with a General Physician can provide detailed clinical evaluation."
      },
      values: [
        {
          id: `val_${Date.now()}_1`,
          testName: "Hemoglobin (Hb)",
          value: "12.1",
          unit: "g/dL",
          referenceRange: "13.0 - 17.0 g/dL",
          status: "attention",
          explanation: "Near the lower reference boundary."
        },
        {
          id: `val_${Date.now()}_2`,
          testName: "Blood Glucose (Fasting)",
          value: "95",
          unit: "mg/dL",
          referenceRange: "70 - 100 mg/dL",
          status: "normal",
          explanation: "Within normal fasting range."
        },
        {
          id: `val_${Date.now()}_3`,
          testName: "Total Leucocyte Count (WBC)",
          value: "6,800",
          unit: "/µL",
          referenceRange: "4,000 - 11,000 /µL",
          status: "normal",
          explanation: "Within normal physiological range."
        },
        {
          id: `val_${Date.now()}_4`,
          testName: "Serum Creatinine",
          value: "0.9",
          unit: "mg/dL",
          referenceRange: "0.6 - 1.2 mg/dL",
          status: "normal",
          explanation: "Standard kidney function reference."
        },
        {
          id: `val_${Date.now()}_5`,
          testName: "Vitamin D (25-OH)",
          value: "26.0",
          unit: "ng/mL",
          referenceRange: "30.0 - 100.0 ng/mL",
          status: "attention",
          explanation: "Slightly below recommended range."
        }
      ],
      recommendedSpecialties: [
        {
          specialty: "General physician",
          reason: "A General Physician can provide holistic clinical context for your overall health markers."
        }
      ],
      suggestedQuestions: [
        "Explain the key findings in my report",
        "Which parameters need attention?",
        "What questions should I ask my doctor?",
        "Who should I consult regarding these results?"
      ]
    };

    const currentReports = getStoredReports();
    const updated = [mockReport, ...currentReports.filter(r => r.id !== newReportId)];
    saveStoredReports(updated);
    return mockReport;
  }

  const formData = new FormData();
  formData.append('report', file);
  const { data } = await axios.post(`${AI_BACKEND_URL}/api/ai/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data.report;
};

export const getReport = async (reportId) => {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const reports = getStoredReports();
    return reports.find(r => r.id === reportId) || sampleReports[0];
  }

  const { data } = await axios.get(`${AI_BACKEND_URL}/api/ai/reports/${reportId}`);
  return data.report;
};

export const getRecentReports = async () => {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getStoredReports();
  }

  const { data } = await axios.get(`${AI_BACKEND_URL}/api/ai/reports/recent`);
  return data.reports;
};

export const sendChatMessage = async ({ reportId, conversationId, message }) => {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const lower = message.toLowerCase();
    const matched = cannedResponses.find(c => c.triggers.some(t => lower.includes(t)));

    if (matched) {
      return {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: matched.response.content,
        type: matched.response.type || 'text',
        specialties: matched.response.specialties,
        emergencyData: matched.response.emergencyData,
        timestamp: 'Just now'
      };
    }

    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: `Regarding your query about **"${message}"**:\n\nYour report parameters provide baseline health indicators. If you are tracking any specific changes or symptoms, discussing them with a **General Physician** is always recommended.\n\n*Would you like help finding a doctor or checking other test results?*`,
      type: 'text',
      timestamp: 'Just now'
    };
  }

  const { data } = await axios.post(`${AI_BACKEND_URL}/api/ai/chat`, {
    reportId,
    conversationId,
    message
  });
  return data.chatMessage;
};

export const getConversation = async (conversationId) => {
  if (USE_MOCK_API) {
    return [defaultAssistantWelcomeMessage];
  }

  const { data } = await axios.get(`${AI_BACKEND_URL}/api/ai/chat/${conversationId}`);
  return data.messages;
};

export const getRecommendedDoctors = async (reportId) => {
  if (USE_MOCK_API) {
    const report = await getReport(reportId);
    return report.recommendedSpecialties || [];
  }

  const { data } = await axios.get(`${AI_BACKEND_URL}/api/ai/reports/${reportId}/recommended-doctors`);
  return data.recommendedSpecialties;
};

export default {
  uploadReport,
  getReport,
  getRecentReports,
  sendChatMessage,
  getConversation,
  getRecommendedDoctors
};
