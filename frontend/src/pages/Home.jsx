import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import RecruiterSection from '../components/RecruiterSection'
import { Stethoscope, ArrowRight, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 sm:space-y-16 w-full">
      <Header/>
      <SpecialityMenu/>
      
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <Stethoscope className="w-full h-full scale-110" />
        </div>
        <div className="max-w-xl space-y-4 sm:space-y-5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" /> AI Symptom Assessment
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Complete a Quick Online Checkup Before You Book
          </h2>
          <p className="text-white/85 leading-relaxed text-xs sm:text-sm lg:text-base">
            Not sure which specialist to consult? Our smart symptom checker evaluates your health logs and vitals to instantly recommend the right clinical department.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => { navigate('/online-checkup'); scrollTo(0,0); }}
              className="bg-white text-indigo-600 text-xs sm:text-sm font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-opacity-95 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg"
            >
              Start Checkup <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      <TopDoctors />
      <RecruiterSection />
      <Banner/>
    </div>
  )
}

export default Home