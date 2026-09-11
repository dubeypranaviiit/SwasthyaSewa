import React from 'react';
import { Shield, Stethoscope, Video, Sparkles, ArrowUpRight, Lock, Activity, CheckCircle2 } from 'lucide-react';

const RecruiterSection = () => {
  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

  const highlights = [
    {
      icon: <Stethoscope className="w-5 h-5 text-indigo-600" />,
      title: "Doctor Workspace",
      desc: "Manage patient queues, customize slot availability, and review medical history."
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-600" />,
      title: "Admin Command Center",
      desc: "Doctor onboarding, appointments oversight, earnings analytics & system configuration."
    },
    {
      icon: <Video className="w-5 h-5 text-blue-600" />,
      title: "Telehealth & Video",
      desc: "Integrated real-time video consultation with dynamic call tokens & status sync."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      title: "AI Clinical Triage",
      desc: "Intelligent symptom assessment recommending the right department automatically."
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-700/50">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-slate-700/60">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recruiter & Evaluator Live Demo Hub</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Explore the Multi-Role <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-primary to-teal-300">Doctor & Admin Experience</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed">
            VitaCare is built with an isolated, secure staff dashboard. Access the admin console to oversee operations or switch to the doctor view to manage appointments and consultations in real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto flex-shrink-0">
          <a
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 group"
          >
            <span>Launch Doctor / Admin Portal</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role-Based JWT Authentication</span>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8">
        {highlights.map((item, index) => (
          <div 
            key={index}
            className="p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-1.5">
              {item.title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Architecture Tags */}
      <div className="relative z-10 mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400">
        <span className="font-semibold text-slate-300 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Key Modules:
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">React + Vite</span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">Tailwind CSS</span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">Node.js / Express</span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">MongoDB</span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">Razorpay SDK</span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">Stream Video WebRTC</span>
      </div>
    </div>
  );
};

export default RecruiterSection;
