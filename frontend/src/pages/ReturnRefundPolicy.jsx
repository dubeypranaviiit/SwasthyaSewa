import React from 'react'

const ReturnRefundPolicy = () => {
  return (
    <div className="min-h-[70vh] py-8 sm:py-12 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Return and Refund Policy</h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-8">Last Updated: June 13, 2026</p>
      
      <div className="space-y-6 text-gray-600 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">1. Service vs Physical Returns</h2>
          <p>
            SwasthyaSewa offers digital consultation scheduling services. We do not manufacture or ship physical medical products. Consequently, traditional physical return policies do not apply.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">2. Consultation Dispute Claims</h2>
          <p>
            If a consult cannot be fulfilled due to technical issues, doctor absence, or platform downtime, patients may file a claim within <strong>48 hours</strong> of the scheduled slot time by writing to <strong>support@swasthyasewa.com</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">3. Claim Approvals</h2>
          <p>
            Disputes are reviewed with the respective doctor. Once approved, the refund is sent to our payment processor within 24 hours. Credit processing follows bank timelines of 5-7 working days.
          </p>
        </section>
      </div>
    </div>
  )
}

export default ReturnRefundPolicy
