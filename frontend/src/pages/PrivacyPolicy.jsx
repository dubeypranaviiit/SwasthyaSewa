import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-[70vh] py-8 sm:py-12 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-8">Last Updated: June 13, 2026</p>
      
      <div className="space-y-6 text-gray-600 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">1. Information We Collect</h2>
          <p>
            At SwasthyaSewa, we collect personal information necessary to connect patients with clinical specialists. This includes your name, email, contact number, date of birth, gender, and health symptom logs provided during the online checkup process.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">2. How We Use Your Data</h2>
          <p>
            Your details are used solely to schedule clinical consultations, verify online payments through Razorpay, track symptoms for your doctors, and improve diagnostics. We do not sell or lease patient records to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">3. Data Security and Privacy</h2>
          <p>
            We deploy secure sockets layer (SSL) encryption, firewalls, and token-based authentication (JWT) to safeguard your medical history. Medical files and consult logs are only accessible to authorized physicians matching your appointments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">4. Third-Party Services</h2>
          <p>
            We integrate with Razorpay for secure payments and Cloudinary for user profile media. These processors comply with strict data protection compliance protocols and do not retain customer data beyond transaction fulfillment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">5. Contact Information</h2>
          <p>
            If you have questions regarding this privacy statement, please contact us at <strong>support@swasthyasewa.com</strong>.
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy
