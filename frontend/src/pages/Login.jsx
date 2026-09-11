import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, User, ShieldCheck, ArrowRight, Loader } from 'lucide-react';

const Login = () => {
  const { token, setToken, backendurl } = useContext(AppContext);
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState('Sign Up');
  const [step, setStep] = useState('input');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    if (!email || !name || !password) {
      toast.error('All fields are required');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendurl}/api/user/send-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setStep('otp');
        setTimer(60);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${backendurl}/api/user/send-otp`, { email });
      if (data.success) {
        toast.success('Verification code resent successfully');
        setTimer(60);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndSignupHandler = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendurl}/api/user/verify-otp-signup`, {
        name,
        email,
        password,
        otp
      });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Account created successfully');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and Password are required');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendurl}/api/user/login`, { email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 sm:py-12 w-full">
      <div className="max-w-md w-full space-y-6 bg-white border border-gray-200 p-6 sm:p-10 rounded-3xl shadow-xl">
        
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-primary shadow-sm">
            {authMode === 'Sign Up' && step === 'otp' ? (
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
            ) : (
              <KeyRound className="h-6 w-6 text-primary" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {authMode === 'Sign Up'
              ? step === 'otp'
                ? 'Verify Email'
                : 'Create Account'
              : 'Welcome Back'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {authMode === 'Sign Up'
              ? step === 'otp'
                ? `Enter code sent to ${email}`
                : 'Sign up to manage checkups and book visits'
              : 'Log in to continue booking and checking vitals'}
          </p>
        </div>

        {authMode === 'Sign Up' && step === 'otp' ? (
          <form onSubmit={verifyOtpAndSignupHandler} className="mt-6 space-y-5">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter OTP"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-xl sm:text-2xl font-bold tracking-widest focus:outline-none focus:border-primary text-gray-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {timer > 0 ? `Resend code in ${timer}s` : 'Code expired'}
              </span>
              <button
                type="button"
                disabled={timer > 0 || loading}
                onClick={handleResendOtp}
                className={`font-semibold ${
                  timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline'
                }`}
              >
                Resend Code
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent text-xs sm:text-sm font-bold rounded-xl text-white bg-primary hover:bg-opacity-95 shadow-md transition"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5 text-white" />
                ) : (
                  'Verify & Create Account'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-xs text-gray-500 hover:text-gray-700 font-medium hover:underline"
              >
                ← Back to Edit Details
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={authMode === 'Sign Up' ? sendOtpHandler : loginHandler}
            className="mt-6 space-y-4 sm:space-y-5"
          >
            <div className="space-y-3.5">
              {authMode === 'Sign Up' && (
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Pranav Dubey"
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary text-gray-800 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@swasthyasewa.com"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary text-gray-800 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className="h-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-primary text-gray-800 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent text-xs sm:text-sm font-bold rounded-xl text-white bg-primary hover:bg-opacity-95 shadow-md transition"
              >
                {loading ? (
                  <Loader className="animate-spin h-5 w-5 text-white" />
                ) : authMode === 'Sign Up' ? (
                  <span className="flex items-center gap-1.5">
                    Send Verification Code <ArrowRight className="w-4 h-4" />
                  </span>
                ) : (
                  'Log In'
                )}
              </button>
            </div>

            <div className="text-center text-xs sm:text-sm mt-4">
              {authMode === 'Sign Up' ? (
                <p className="text-gray-500">
                  Already have an account?{' '}
                  <span
                    onClick={() => {
                      setAuthMode('Login');
                      setStep('input');
                    }}
                    className="text-primary hover:underline font-bold cursor-pointer"
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <p className="text-gray-500">
                  Create a new account?{' '}
                  <span
                    onClick={() => {
                      setAuthMode('Sign Up');
                      setStep('input');
                    }}
                    className="text-primary hover:underline font-bold cursor-pointer"
                  >
                    Click here
                  </span>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
