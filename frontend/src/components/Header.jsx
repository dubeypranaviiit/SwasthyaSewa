import React from "react";
import { ArrowRight, Calendar, Heart, Stethoscope, Activity, Baby, Zap, Users } from "lucide-react";
import { assets } from "../assets/assets_frontend/assets";
import { useNavigate } from 'react-router-dom';

export default function HeroBanner() {
  const navigate = useNavigate();
  const adminUrl = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16 w-full">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Calendar className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                Book appointment instantly
              </span>
            </div>

            <a
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 group"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span>Doctor / Admin Portal</span>
              <span className="text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            Book Appointment <br className="hidden sm:block" />
            <span className="text-primary">
              With Trusted Doctors
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Simply browse through our extensive list of trusted doctors,
            check availability in real-time and schedule your appointment hassle-free.
          </p>

          <div className="flex justify-center lg:justify-start">
            <img className="w-36 sm:w-40 h-auto" src={assets.group_profiles} alt="Doctors" />
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 justify-center lg:justify-start items-center">
            <button 
              onClick={() => { navigate('/doctors'); scrollTo(0,0); }}
              className="px-6 sm:px-8 py-3.5 bg-primary text-white text-xs sm:text-sm font-bold rounded-full hover:bg-opacity-95 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => { navigate('/doctors'); scrollTo(0,0); }}
              className="px-6 sm:px-8 py-3.5 border border-gray-300 text-gray-700 text-xs sm:text-sm font-bold rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-sm"
            >
              Explore Doctors
            </button>

            <a 
              href={adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-full hover:shadow-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group shadow-md"
            >
              <span>Doctor / Admin Portal</span>
              <span className="text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
            <div className="flex gap-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
              <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-xs sm:text-sm text-gray-900">Multiple doctors</p>
                <p className="text-xs text-gray-500">Choose from specialists</p>
              </div>
            </div>

            <div className="flex gap-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
              <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-xs sm:text-sm text-gray-900">Real-time slots</p>
                <p className="text-xs text-gray-500">See open timings instantly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 lg:mt-0">
          <img
            className="w-full h-auto rounded-2xl shadow-xl object-cover"
            src={assets.header_img}
            alt="Doctor consultation"
          />

          <div className="hidden xl:block absolute -bottom-8 left-6 bg-white border border-gray-150 rounded-2xl shadow-2xl p-5 w-[85%]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-900">Our Services</h3>
              <Stethoscope className="w-4 h-4 text-primary" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-700 font-medium">
              <div className="flex gap-2 items-center">
                <Heart className="w-3.5 h-3.5 text-primary" /> Cardiology
              </div>
              <div className="flex gap-2 items-center">
                <Activity className="w-3.5 h-3.5 text-primary" /> General
              </div>
              <div className="flex gap-2 items-center">
                <Baby className="w-3.5 h-3.5 text-primary" /> Pediatrics
              </div>
              <div className="flex gap-2 items-center">
                <Zap className="w-3.5 h-3.5 text-primary" /> Orthopedics
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 sm:mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <p className="text-2xl sm:text-3xl font-extrabold text-primary">25+</p>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">Expert doctors</p>
        </div>
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <p className="text-2xl sm:text-3xl font-extrabold text-primary">4.9★</p>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">Average rating</p>
        </div>
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <p className="text-2xl sm:text-3xl font-extrabold text-primary">15K+</p>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">Happy patients</p>
        </div>
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <p className="text-2xl sm:text-3xl font-extrabold text-primary">Same day</p>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">Appointments</p>
        </div>
      </div>
    </section>
  );
}