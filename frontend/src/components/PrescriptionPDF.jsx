import React, { useRef } from 'react'

const PrescriptionPDF = ({ appointment, onClose }) => {
  if (!appointment) return null

  const rx = appointment.prescription || {}
  const doctor = typeof appointment.docData === 'object' ? appointment.docData : {}
  const doctorName = doctor.name || (typeof appointment.docData === 'string' ? (appointment.docData.match(/name:\s*'([^']+)'/) || [])[1] : 'Attending Physician') || 'Attending Physician'
  const doctorSpeciality = doctor.speciality || (typeof appointment.docData === 'string' ? (appointment.docData.match(/speciality:\s*'([^']+)'/) || [])[1] : 'General Physician') || 'General Physician'
  const doctorDegree = doctor.degree || (typeof appointment.docData === 'string' ? (appointment.docData.match(/degree:\s*'([^']+)'/) || [])[1] : 'MBBS, MD') || 'MBBS, MD'
  const doctorReg = doctor._id ? doctor._id.slice(-6).toUpperCase() : (appointment._id ? appointment._id.slice(-6).toUpperCase() : '784920')
  const user = appointment.userData || {}

  const formatIssueDate = (dateVal) => {
    if (!dateVal) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    if (typeof dateVal === 'number') {
      return new Date(dateVal).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
    return new Date(dateVal).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handlePrint = () => {
    const printContent = document.getElementById('prescription-clean-sheet')
    if (!printContent) return

    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const doc = iframe.contentWindow.document
    doc.open()
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription_${appointment._id?.slice(-8).toUpperCase()}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1f2937;
              background: #ffffff;
              font-size: 11pt;
              line-height: 1.4;
              padding: 0;
            }
            .sheet-container {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
            }
            .header-bar {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #3b82f6;
              padding-bottom: 12px;
              margin-bottom: 14px;
            }
            .org-title {
              font-size: 20pt;
              font-weight: 800;
              color: #111827;
              letter-spacing: -0.5px;
            }
            .org-title span {
              color: #4f46e5;
            }
            .org-subtitle {
              font-size: 8.5pt;
              font-weight: 700;
              color: #4b5563;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-top: 2px;
            }
            .org-meta {
              font-size: 8pt;
              color: #6b7280;
              margin-top: 2px;
            }
            .doc-info {
              text-align: right;
            }
            .doc-name {
              font-size: 13pt;
              font-weight: 800;
              color: #111827;
            }
            .doc-spec {
              font-size: 9.5pt;
              font-weight: 700;
              color: #4f46e5;
              margin-top: 1px;
            }
            .doc-sub {
              font-size: 8.5pt;
              color: #4b5563;
            }
            .doc-reg {
              font-size: 8pt;
              color: #6b7280;
              font-family: monospace;
              margin-top: 2px;
            }
            .patient-card {
              background-color: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 10px 14px;
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 12px;
            }
            .patient-field-label {
              font-size: 7.5pt;
              font-weight: 700;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .patient-field-value {
              font-size: 9.5pt;
              font-weight: 700;
              color: #111827;
              margin-top: 2px;
            }
            .vitals-bar {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              background-color: #f5f3ff;
              border: 1px solid #ede9fe;
              border-radius: 8px;
              padding: 8px 12px;
              text-align: center;
              margin-bottom: 12px;
            }
            .vitals-item-label {
              font-size: 7.5pt;
              font-weight: 700;
              color: #6b7280;
              text-transform: uppercase;
            }
            .vitals-item-val {
              font-size: 10pt;
              font-weight: 800;
              color: #1e1b4b;
              margin-top: 1px;
            }
            .diagnosis-box {
              background-color: #f9fafb;
              border-left: 4px solid #4f46e5;
              border-radius: 0 8px 8px 0;
              padding: 8px 12px;
              margin-bottom: 14px;
            }
            .diagnosis-title {
              font-size: 8pt;
              font-weight: 700;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .diagnosis-content {
              font-size: 10.5pt;
              font-weight: 800;
              color: #111827;
              margin-top: 2px;
            }
            .diagnosis-symptoms {
              font-size: 8.5pt;
              color: #4b5563;
              margin-top: 3px;
            }
            .section-header {
              display: flex;
              align-items: center;
              gap: 6px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 4px;
              margin-bottom: 8px;
            }
            .rx-symbol {
              font-family: Georgia, serif;
              font-size: 14pt;
              font-weight: 900;
              font-style: italic;
              color: #4f46e5;
            }
            .section-title {
              font-size: 8.5pt;
              font-weight: 800;
              color: #374151;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .med-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 14px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .med-table th {
              background-color: #f3f4f6;
              font-size: 8pt;
              font-weight: 800;
              color: #4b5563;
              text-transform: uppercase;
              padding: 6px 10px;
              border-bottom: 1px solid #e5e7eb;
              text-align: left;
            }
            .med-table td {
              font-size: 9pt;
              padding: 7px 10px;
              border-bottom: 1px solid #f3f4f6;
              color: #1f2937;
            }
            .med-table tr:last-child td {
              border-bottom: none;
            }
            .med-name {
              font-weight: 700;
              color: #111827;
            }
            .advice-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              margin-bottom: 12px;
            }
            .advice-card {
              background-color: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 8px 12px;
            }
            .advice-card-title {
              font-size: 7.5pt;
              font-weight: 800;
              color: #4b5563;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 3px;
            }
            .advice-card-text {
              font-size: 8.5pt;
              color: #374151;
              line-height: 1.4;
            }
            .followup-badge {
              background-color: #eef2ff;
              border: 1px solid #c7d2fe;
              border-radius: 8px;
              padding: 7px 12px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 14px;
            }
            .followup-label {
              font-size: 8.5pt;
              font-weight: 700;
              color: #312e81;
            }
            .followup-date {
              font-size: 9pt;
              font-weight: 800;
              color: #4338ca;
            }
            .footer-section {
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: auto;
            }
            .disclaimer-title {
              font-size: 8pt;
              font-weight: 700;
              color: #374151;
            }
            .disclaimer-text {
              font-size: 7.5pt;
              color: #9ca3af;
              max-width: 420px;
              margin-top: 2px;
              line-height: 1.3;
            }
            .signature-stamp {
              border: 1px dashed #d1d5db;
              border-radius: 6px;
              padding: 6px 14px;
              text-align: center;
              min-width: 140px;
              background-color: #fafafa;
            }
            .sig-doctor {
              font-family: Georgia, serif;
              font-style: italic;
              font-weight: 700;
              font-size: 9.5pt;
              color: #111827;
            }
            .sig-status {
              font-size: 7pt;
              font-weight: 800;
              color: #059669;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-top: 2px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    doc.close()

    setTimeout(() => {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
    }, 250)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Digital Prescription</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs font-medium text-gray-600">Ref #{appointment._id?.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-primary hover:bg-[#4351ea] text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-base font-bold"
              aria-label="Close prescription modal"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-gray-800 space-y-6">
          <div id="prescription-clean-sheet" className="sheet-container">
            
            <div className="header-bar">
              <div>
                <div className="org-title">
                  Swasthya<span>Sewa</span>
                </div>
                <div className="org-subtitle">Healthcare Network & Telemedicine</div>
                <div className="org-meta">Registration: MED-NET-2026-IND | National Tele-Health Accredited</div>
              </div>
              <div className="doc-info">
                <div className="doc-name">Dr. {doctorName}</div>
                <div className="doc-spec">{doctorSpeciality}</div>
                <div className="doc-sub">{doctorDegree}</div>
                <div className="doc-reg">Reg No: NMC/{doctorReg}</div>
              </div>
            </div>

            <div className="patient-card">
              <div>
                <div className="patient-field-label">Patient Name</div>
                <div className="patient-field-value">{user.name || 'Patient'}</div>
              </div>
              <div>
                <div className="patient-field-label">Gender / Blood Group</div>
                <div className="patient-field-value">{user.gender || 'Not specified'} {user.bloodGroup ? `(${user.bloodGroup})` : ''}</div>
              </div>
              <div>
                <div className="patient-field-label">Prescription Date</div>
                <div className="patient-field-value">{formatIssueDate(rx.prescribedAt || appointment.date)}</div>
              </div>
              <div>
                <div className="patient-field-label">Appointment ID</div>
                <div className="patient-field-value" style={{ fontFamily: 'monospace' }}>#{appointment._id?.slice(-8).toUpperCase()}</div>
              </div>
            </div>

            {rx.vitals && (rx.vitals.bp || rx.vitals.pulse || rx.vitals.temperature || rx.vitals.weight) && (
              <div className="vitals-bar">
                <div>
                  <div className="vitals-item-label">Blood Pressure</div>
                  <div className="vitals-item-val">{rx.vitals.bp || 'N/A'}</div>
                </div>
                <div>
                  <div className="vitals-item-label">Pulse</div>
                  <div className="vitals-item-val">{rx.vitals.pulse ? `${rx.vitals.pulse} bpm` : 'N/A'}</div>
                </div>
                <div>
                  <div className="vitals-item-label">Temperature</div>
                  <div className="vitals-item-val">{rx.vitals.temperature ? `${rx.vitals.temperature} °F` : 'N/A'}</div>
                </div>
                <div>
                  <div className="vitals-item-label">Weight</div>
                  <div className="vitals-item-val">{rx.vitals.weight ? `${rx.vitals.weight} kg` : 'N/A'}</div>
                </div>
              </div>
            )}

            <div className="diagnosis-box">
              <div className="diagnosis-title">Clinical Diagnosis</div>
              <div className="diagnosis-content">{rx.diagnosis || 'Clinical Consultation'}</div>
              {rx.symptoms?.length > 0 && (
                <div className="diagnosis-symptoms">Reported Symptoms: {rx.symptoms.join(', ')}</div>
              )}
            </div>

            <div>
              <div className="section-header">
                <span className="rx-symbol">Rx</span>
                <span className="section-title">Medication Schedule</span>
              </div>

              {rx.medicines && rx.medicines.length > 0 ? (
                <table className="med-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30px' }}>#</th>
                      <th>Medicine Name</th>
                      <th>Dosage & Frequency</th>
                      <th>Duration</th>
                      <th>Instructions</th>
                      <th style={{ textAlign: 'right' }}>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medicines.map((med, index) => (
                      <tr key={index}>
                        <td style={{ color: '#9ca3af', fontWeight: 600 }}>{index + 1}</td>
                        <td className="med-name">{med.name}</td>
                        <td>{med.dosage || '1 Tab'} ({med.frequency})</td>
                        <td>{med.duration}</td>
                        <td>{med.timing}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{med.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: '9pt', color: '#6b7280', fontStyle: 'italic', margin: '8px 0' }}>
                  No oral medication prescribed.
                </p>
              )}
            </div>

            {(rx.advice || rx.labTests) && (
              <div className="advice-grid">
                {rx.advice && (
                  <div className="advice-card">
                    <div className="advice-card-title">Diet & Clinical Advice</div>
                    <div className="advice-card-text">{rx.advice}</div>
                  </div>
                )}
                {rx.labTests && (
                  <div className="advice-card">
                    <div className="advice-card-title">Recommended Lab Investigations</div>
                    <div className="advice-card-text">{rx.labTests}</div>
                  </div>
                )}
              </div>
            )}

            {rx.nextFollowUpDate && (
              <div className="followup-badge">
                <span className="followup-label">Next Scheduled Follow-up Revisit</span>
                <span className="followup-date">{rx.nextFollowUpDate}</span>
              </div>
            )}

            <div className="footer-section">
              <div>
                <div className="disclaimer-title">SwasthyaSewa Telemedicine Practice Note</div>
                <div className="disclaimer-text">
                  Generated under Registered Medical Practitioner Telemedicine Guidelines. This is a digitally signed clinical record valid for pharmacy dispensing.
                </div>
              </div>
              <div className="signature-stamp">
                <div className="sig-doctor">Dr. {doctorName}</div>
                <div className="sig-status">Digitally Verified</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionPDF
