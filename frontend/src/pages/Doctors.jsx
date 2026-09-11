import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { Filter, ChevronDown } from 'lucide-react'

function Doctors() {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);

  const specialtiesList = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ];

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality])

  const handleSpecialityClick = (spec) => {
    if (speciality === spec) {
      navigate('/doctors');
    } else {
      navigate(`/doctors/${spec}`);
    }
  }

  return (
    <div className="py-6 sm:py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {speciality ? `${speciality}s` : 'All Doctors'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Browse through our verified medical specialists and book your consultation.</p>
        </div>

        <button 
          onClick={() => setShowFilter(prev => !prev)}
          className="md:hidden flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 mt-2 sm:mt-0"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" /> Filter by Speciality
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className={`w-full md:w-60 flex-shrink-0 flex flex-col gap-2.5 text-xs sm:text-sm ${showFilter ? 'block' : 'hidden md:flex'}`}>
          <div className="hidden md:flex items-center justify-between pb-2 border-b">
            <span className="font-bold text-gray-700 uppercase tracking-wider text-xs">Specialities</span>
            {speciality && (
              <button onClick={() => navigate('/doctors')} className="text-xs text-primary font-semibold hover:underline">
                Clear filter
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {specialtiesList.map((spec) => {
              const isSelected = speciality === spec;
              return (
                <p 
                  key={spec}
                  onClick={() => handleSpecialityClick(spec)} 
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl transition-all cursor-pointer font-medium flex items-center justify-between ${
                    isSelected 
                      ? "bg-primary text-white border-primary shadow-sm font-semibold" 
                      : "bg-white text-gray-700 hover:border-primary/50 hover:bg-gray-50"
                  }`}
                >
                  <span>{spec}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                </p>
              )
            })}
          </div>
        </div>

        <div className="w-full flex-1">
          {filterDoc.length === 0 ? (
            <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-gray-150">
              <p className="text-base font-semibold text-gray-600">No doctors found for this specialty.</p>
              <button onClick={() => navigate('/doctors')} className="mt-3 text-xs text-primary font-bold hover:underline">
                View all doctors
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filterDoc.map((item, index) => (
                <div
                  onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0,0); }}
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden bg-blue-50/50">
                    <img
                      className="w-full h-48 sm:h-52 object-cover object-top hover:scale-105 transition-all duration-500"
                      src={item.image}
                      alt={item.name}
                    />

                    <div className={`absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-xs flex items-center gap-1.5 font-medium ${item.available !== false ? 'text-green-600' : 'text-gray-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${item.available !== false ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      {item.available !== false ? 'Available' : 'Unavailable'}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-900 text-base sm:text-lg font-bold tracking-tight">
                        {item.name}
                      </p>

                      <p className="text-gray-500 text-xs sm:text-sm mt-0.5 font-medium">
                        {item.speciality}
                      </p>
                    </div>

                    <button className="mt-5 w-full border border-primary text-primary py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors