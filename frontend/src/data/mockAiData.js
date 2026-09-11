export const sampleReports = [
  {
    id: "demo-cbc-01",
    fileName: "Complete_Blood_Count_Report.pdf",
    fileSize: "2.4 MB",
    fileType: "pdf",
    uploadedAt: "Today, 10:15 AM",
    status: "completed",
    isDemo: true,
    title: "Complete Blood Count (CBC)",
    summary: {
      totalParameters: 16,
      normalCount: 12,
      attentionCount: 3,
      abnormalCount: 1,
      overviewText: "Your CBC report contains 16 measured parameters. 12 values are within the standard reference range, while 4 parameters show slight variations from reference bounds.",
      aiInterpretation: "The report indicates mild variations in Hemoglobin and Red Blood Cell indices, alongside low Vitamin D levels. A discussion with a General Physician can provide appropriate clinical context and guidance regarding dietary nutrition or routine follow-up."
    },
    values: [
      {
        id: "cbc-1",
        testName: "Hemoglobin (Hb)",
        value: "11.2",
        unit: "g/dL",
        referenceRange: "13.0 - 17.0 g/dL",
        status: "attention",
        explanation: "Slightly below standard reference range."
      },
      {
        id: "cbc-2",
        testName: "Total Leucocyte Count (WBC)",
        value: "7,400",
        unit: "/µL",
        referenceRange: "4,000 - 11,000 /µL",
        status: "normal",
        explanation: "Within normal physiological range."
      },
      {
        id: "cbc-3",
        testName: "Platelet Count",
        value: "2.4",
        unit: "Lakhs/µL",
        referenceRange: "1.5 - 4.5 Lakhs/µL",
        status: "normal",
        explanation: "Adequate and within standard limits."
      },
      {
        id: "cbc-4",
        testName: "Packed Cell Volume (PCV)",
        value: "35.8",
        unit: "%",
        referenceRange: "40.0 - 50.0 %",
        status: "attention",
        explanation: "Slightly lower than standard reference interval."
      },
      {
        id: "cbc-5",
        testName: "Vitamin D (25-OH)",
        value: "21.5",
        unit: "ng/mL",
        referenceRange: "30.0 - 100.0 ng/mL",
        status: "abnormal",
        explanation: "Below the standard reference range."
      },
      {
        id: "cbc-6",
        testName: "Mean Corpuscular Volume (MCV)",
        value: "78.4",
        unit: "fL",
        referenceRange: "80.0 - 100.0 fL",
        status: "attention",
        explanation: "Slightly below reference range."
      },
      {
        id: "cbc-7",
        testName: "Neutrophils",
        value: "62",
        unit: "%",
        referenceRange: "40 - 75 %",
        status: "normal",
        explanation: "Within reference interval."
      },
      {
        id: "cbc-8",
        testName: "Lymphocytes",
        value: "30",
        unit: "%",
        referenceRange: "20 - 45 %",
        status: "normal",
        explanation: "Within standard healthy bounds."
      }
    ],
    recommendedSpecialties: [
      {
        specialty: "General physician",
        reason: "A General Physician can review your overall blood markers, iron levels, and dietary habits in detail."
      }
    ],
    suggestedQuestions: [
      "What values in my CBC report are outside reference range?",
      "Can you explain what Hemoglobin 11.2 g/dL means in simple terms?",
      "What questions should I ask my doctor about this report?",
      "Who should I consult regarding my low Vitamin D result?"
    ]
  },
  {
    id: "demo-lipid-02",
    fileName: "Lipid_Profile_Panel.pdf",
    fileSize: "1.8 MB",
    fileType: "pdf",
    uploadedAt: "Yesterday, 04:40 PM",
    status: "completed",
    isDemo: true,
    title: "Lipid Profile Panel",
    summary: {
      totalParameters: 6,
      normalCount: 4,
      attentionCount: 1,
      abnormalCount: 1,
      overviewText: "Your lipid panel assesses 6 cardiovascular lipid markers. Total cholesterol and LDL are slightly elevated compared to optimal thresholds.",
      aiInterpretation: "Your LDL and Total Cholesterol levels are mildly elevated. A physician can help you understand lifestyle and dietary factors that support cardiovascular wellness."
    },
    values: [
      {
        id: "lip-1",
        testName: "Total Cholesterol",
        value: "218",
        unit: "mg/dL",
        referenceRange: "< 200 mg/dL",
        status: "attention",
        explanation: "Mildly above desirable baseline threshold."
      },
      {
        id: "lip-2",
        testName: "LDL Cholesterol",
        value: "142",
        unit: "mg/dL",
        referenceRange: "< 100 mg/dL",
        status: "abnormal",
        explanation: "Higher than optimal reference level."
      },
      {
        id: "lip-3",
        testName: "HDL (Good) Cholesterol",
        value: "48",
        unit: "mg/dL",
        referenceRange: "> 40 mg/dL",
        status: "normal",
        explanation: "Within healthy protective range."
      },
      {
        id: "lip-4",
        testName: "Triglycerides",
        value: "145",
        unit: "mg/dL",
        referenceRange: "< 150 mg/dL",
        status: "normal",
        explanation: "Within normal reference limits."
      },
      {
        id: "lip-5",
        testName: "VLDL Cholesterol",
        value: "28",
        unit: "mg/dL",
        referenceRange: "5 - 30 mg/dL",
        status: "normal",
        explanation: "Normal reference level."
      }
    ],
    recommendedSpecialties: [
      {
        specialty: "General physician",
        reason: "A General Physician can evaluate routine cardiovascular wellness and suggest dietary modifications."
      }
    ],
    suggestedQuestions: [
      "What does elevated LDL cholesterol mean?",
      "Is my HDL (good cholesterol) in the normal range?",
      "What lifestyle questions should I prepare for my doctor?",
      "Who should I consult to discuss my cholesterol numbers?"
    ]
  },
  {
    id: "demo-thyroid-03",
    fileName: "Thyroid_Function_Test.pdf",
    fileSize: "1.2 MB",
    fileType: "pdf",
    uploadedAt: "Sep 08, 02:20 PM",
    status: "completed",
    isDemo: true,
    title: "Thyroid Function Test (TFT)",
    summary: {
      totalParameters: 3,
      normalCount: 2,
      attentionCount: 1,
      abnormalCount: 0,
      overviewText: "Your thyroid panel includes 3 core markers (TSH, Free T3, and Free T4). TSH shows a mild borderline elevation.",
      aiInterpretation: "Your TSH is slightly above standard baseline, while Free T3 and T4 are normal. A doctor can assess if any thyroid monitoring is needed."
    },
    values: [
      {
        id: "thy-1",
        testName: "TSH (Thyroid Stimulating Hormone)",
        value: "5.45",
        unit: "µIU/mL",
        referenceRange: "0.45 - 4.50 µIU/mL",
        status: "attention",
        explanation: "Slightly above reference interval."
      },
      {
        id: "thy-2",
        testName: "Free T3 (Triiodothyronine)",
        value: "3.2",
        unit: "pg/mL",
        referenceRange: "2.0 - 4.4 pg/mL",
        status: "normal",
        explanation: "Within standard healthy range."
      },
      {
        id: "thy-3",
        testName: "Free T4 (Thyroxine)",
        value: "1.15",
        unit: "ng/dL",
        referenceRange: "0.82 - 1.77 ng/dL",
        status: "normal",
        explanation: "Within standard reference boundaries."
      }
    ],
    recommendedSpecialties: [
      {
        specialty: "General physician",
        reason: "A General Physician can interpret thyroid levels in conjunction with routine symptoms like energy levels."
      }
    ],
    suggestedQuestions: [
      "What does a TSH of 5.45 µIU/mL indicate?",
      "Are Free T3 and Free T4 normal in this report?",
      "What should I discuss with my physician regarding thyroid health?",
      "Who should I consult for thyroid function review?"
    ]
  }
];

export const defaultAssistantWelcomeMessage = {
  id: "welcome-01",
  role: "assistant",
  content: "Hello! I am your **SwasthyaSewa AI Assistant**.\n\nI can help you review your medical report in simple terms, highlight parameters that may need discussion, and suggest appropriate questions for your doctor.\n\n*Feel free to ask a question below or pick a suggested topic.*",
  timestamp: "Just now",
  type: "text"
};

export const cannedResponses = [
  {
    triggers: ["abnormal", "outside", "attention", "values"],
    response: {
      content: "Here is a breakdown of the key parameters from your report:\n\n• **Values Outside / Near Range**: Parameters such as **Hemoglobin** and **Vitamin D** are slightly below the reported reference interval.\n• **Normal Parameters**: Markers including **WBC (Leucocytes)** and **Platelets** are in the standard reference range.\n\n*Remember, reference ranges can vary slightly between labs. Discussing these with a healthcare professional will give you personalized context.*",
      type: "text"
    }
  },
  {
    triggers: ["who", "doctor", "consult", "specialist", "specialty", "contact", "see"],
    response: {
      content: "Based on the findings in your report, here is the recommended healthcare starting point:",
      type: "doctor_recommendation",
      specialties: [
        {
          specialty: "General physician",
          reason: "A General Physician is the ideal starting point to review your overall report, nutrition, and symptoms."
        }
      ]
    }
  },
  {
    triggers: ["questions", "ask doctor", "prepare", "what to ask"],
    response: {
      content: "Here are helpful questions you might ask during your doctor's appointment:\n\n1. *\"Are these borderline values significant given my daily routine and symptoms?\"*\n2. *\"Should we consider dietary adjustments or supplements for Vitamin D / Iron?\"*\n3. *\"When would you recommend a follow-up test to monitor these parameters?\"*",
      type: "text"
    }
  },
  {
    triggers: ["emergency", "chest pain", "severe", "shortness of breath", "unconscious"],
    response: {
      content: "If you are experiencing severe or acute symptoms, immediate medical evaluation is critical.",
      type: "emergency",
      emergencyData: {
        title: "Seek urgent medical care",
        message: "If you are experiencing severe pain, difficulty breathing, or rapid worsening, please contact emergency medical services or go to the nearest emergency room immediately.",
        actionText: "Emergency Support: +91 8092599674"
      }
    }
  }
];
