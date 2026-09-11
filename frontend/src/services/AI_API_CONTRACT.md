# SWASTHYASEWA AI - BACKEND API CONTRACT & INTEGRATION GUIDE

This document outlines the exact data contracts and payloads expected by the frontend UI components. The frontend is built as a pure presentational interface and communicates solely through `src/services/aiHealthService.js`.

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Expected Payload / Response |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/ai/upload` | Upload a PDF/image report for OCR & AI analysis | `FormData` $\rightarrow$ `Report` object |
| **GET** | `/api/ai/reports/:reportId` | Fetch parsed report data & summary | `Report` object |
| **GET** | `/api/ai/reports/recent` | Fetch list of user's recently parsed reports | Array of `{ id, fileName, uploadedAt, summary }` |
| **POST** | `/api/ai/chat` | Send a user message and get an assistant response | `{ reportId, message, conversationId }` $\rightarrow$ `ChatMessage` |
| **GET** | `/api/ai/chat/:conversationId` | Fetch message history for a conversation | Array of `ChatMessage` |

---

## 2. Data Models & Schemas

### A. Report Object (`Report`)
Returned by `/api/ai/upload` and `/api/ai/reports/:reportId`.

```json
{
  "id": "rep_blood_01",
  "fileName": "Blood_Test_Report.pdf",
  "fileSize": "2.4 MB",
  "fileType": "pdf",
  "uploadedAt": "Today, 10:30 AM",
  "status": "completed",
  "isDemo": false,
  "summary": {
    "totalParameters": 18,
    "normalCount": 12,
    "attentionCount": 4,
    "abnormalCount": 2,
    "overviewText": "Your report contains 18 parameters. Most parameters are within reference range, with a few markers that may need discussion.",
    "aiInterpretation": "The report shows mild variations in Hemoglobin and Vitamin D levels. A consultation with a General Physician is recommended to review dietary habits or potential supplementation."
  },
  "values": [
    {
      "id": "val_1",
      "testName": "Hemoglobin",
      "value": "11.2",
      "unit": "g/dL",
      "referenceRange": "13.0 - 17.0 g/dL",
      "status": "attention",
      "explanation": "Slightly below standard reference range. Consider discussing iron intake with your doctor."
    },
    {
      "id": "val_2",
      "testName": "Vitamin D (25-OH)",
      "value": "22.4",
      "unit": "ng/mL",
      "referenceRange": "30.0 - 100.0 ng/mL",
      "status": "abnormal",
      "explanation": "Below optimal range. Often addressed with sun exposure or dietary supplements under clinical guidance."
    },
    {
      "id": "val_3",
      "testName": "WBC (Total Leucocyte Count)",
      "value": "7,200",
      "unit": "/µL",
      "referenceRange": "4,000 - 11,000 /µL",
      "status": "normal",
      "explanation": "Within healthy baseline limits."
    }
  ],
  "recommendedSpecialties": [
    {
      "specialty": "General physician",
      "reason": "A General Physician can review your overall report along with your health history and symptoms."
    }
  ],
  "suggestedQuestions": [
    "Explain my report in simple terms",
    "What values are abnormal or need attention?",
    "Which results should I discuss with my doctor?",
    "What questions should I ask my doctor?"
  ]
}
```

> **Valid Status Values for `ReportValue.status`**:
> - `"normal"` $\rightarrow$ Green badge (✓ Within reference range)
> - `"attention"` $\rightarrow$ Yellow badge (⚠ Needs attention)
> - `"abnormal"` $\rightarrow$ Red badge (! Outside reference range)
> - `"unknown"` $\rightarrow$ Gray badge

---

### B. Chat Message (`ChatMessage`)
Returned by `POST /api/ai/chat` and `GET /api/ai/chat/:conversationId`.

#### 1. Standard Text Message
```json
{
  "id": "msg_001",
  "role": "assistant",
  "content": "Based on your uploaded **Blood Test Report**, here are the key observations:\n\n• **Hemoglobin (11.2 g/dL)** — Slightly below reference range.\n• **Vitamin D (22.4 ng/mL)** — Below optimal range.\n• **WBC Count** — Fully normal at 7,200 /µL.\n\nWould you like me to explain what any specific test means, or help you find a doctor?",
  "timestamp": "10:32 AM",
  "type": "text"
}
```

#### 2. Message with Doctor Specialty Recommendations
```json
{
  "id": "msg_002",
  "role": "assistant",
  "content": "Based on the findings in this report, consulting a healthcare professional is a good next step.",
  "timestamp": "10:33 AM",
  "type": "doctor_recommendation",
  "specialties": [
    {
      "specialty": "General physician",
      "reason": "A General Physician can review your overall blood markers, iron levels, and dietary habits."
    }
  ]
}
```

#### 3. Emergency Warning Message (Presentational Display)
```json
{
  "id": "msg_003",
  "role": "assistant",
  "content": "Please seek emergency medical attention if you are feeling severe chest tightness or difficulty breathing.",
  "timestamp": "10:34 AM",
  "type": "emergency",
  "emergencyData": {
    "title": "Seek urgent medical care",
    "message": "If you are experiencing severe or rapidly worsening symptoms, seek emergency medical care immediately.",
    "actionText": "Call Emergency Helpline"
  }
}
```

---

## 3. How to Connect Your Real Backend

In `frontend/src/services/aiHealthService.js`:

1. Add your backend URL to `frontend/.env`:
   ```env
   VITE_AI_BACKEND_URL=http://localhost:5000
   VITE_USE_MOCK_AI=false
   ```
2. When `VITE_USE_MOCK_AI` is `false`, `aiHealthService.js` automatically routes calls to your real API endpoints.
3. No changes to React components are required!
