import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  CallingState,
  ParticipantView,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  Activity,
  Heart,
  Thermometer,
  MessageSquare,
  Sparkles,
  Lock,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import { isSlotTimeReached, getTimeUntilSlot } from '../utils/slotHelper'

const CallUI = ({ isDoctor, callDetails, parseDocData, onEndCall }) => {
  const {
    useParticipants,
    useLocalParticipant,
    useRemoteParticipants,
    useCallCallingState,
    useCameraState,
    useMicrophoneState,
  } = useCallStateHooks()

  const callingState = useCallCallingState()
  const participants = useParticipants()
  const localParticipant = useLocalParticipant()
  const remoteParticipants = useRemoteParticipants()
  const { camera, isMute: isCameraOff } = useCameraState()
  const { microphone, isMute: isMicMuted } = useMicrophoneState()

  const [callDuration, setCallDuration] = useState(0)

  const isJoined = callingState === CallingState.JOINED
  const docInfo = parseDocData(callDetails?.docData)

  useEffect(() => {
    if (!isJoined) return
    const timer = setInterval(() => setCallDuration((p) => p + 1), 1000)
    return () => clearInterval(timer)
  }, [isJoined])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const toggleMic = useCallback(async () => {
    try { await microphone.toggle() } catch (e) { console.warn('Mic toggle failed', e) }
  }, [microphone])

  const toggleVideo = useCallback(async () => {
    try { await camera.toggle() } catch (e) { console.warn('Camera toggle failed', e) }
  }, [camera])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col overflow-hidden font-sans w-full">
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 py-3.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-xs sm:text-sm tracking-tight">SwasthyaSewa Consultation</h1>
            <p className="text-[10px] text-gray-400">Encrypted P2P Session</p>
          </div>
        </div>

        {isJoined && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-full border border-gray-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="font-mono text-emerald-400">{formatTime(callDuration)}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${isJoined ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
          <span className="text-xs font-semibold text-gray-300">
            {isJoined
              ? `Active · ${participants.length}`
              : callingState === CallingState.JOINING
                ? 'Connecting…'
                : 'Waiting'}
          </span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 p-4 sm:p-6 gap-4 sm:gap-6 min-h-0 overflow-y-auto">
        <section className="lg:col-span-3 flex flex-col gap-4 min-h-[380px] sm:min-h-[460px]">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 relative p-3 sm:p-4">
            <div className="bg-gray-950 rounded-xl overflow-hidden border border-gray-800 relative flex items-center justify-center min-h-[220px] sm:min-h-[280px]">
              {remoteParticipants.length > 0 ? (
                <div className="absolute inset-0 [&_video]:w-full [&_video]:h-full [&_video]:object-cover">
                  <ParticipantView
                    participant={remoteParticipants[0]}
                    trackType="videoTrack"
                  />
                </div>
              ) : (
                <div className="text-center p-6 max-w-sm space-y-3">
                  <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                    <img
                      src={isDoctor ? callDetails?.userData?.image || 'https://via.placeholder.com/150' : docInfo.image}
                      alt="Waiting"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-bold">
                    {isDoctor ? callDetails?.userData?.name : `Dr. ${docInfo.name}`}
                  </h3>
                  <p className="text-xs text-gray-400">Waiting for them to join…</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-gray-900/80 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-gray-800 z-10">
                {isDoctor ? `Patient: ${callDetails?.userData?.name || ''}` : `Dr. ${docInfo.name}`}
              </div>
            </div>

            <div className="bg-gray-950 rounded-xl overflow-hidden border border-gray-800 relative flex items-center justify-center min-h-[220px] sm:min-h-[280px]">
              {localParticipant ? (
                <div className="absolute inset-0 [&_video]:w-full [&_video]:h-full [&_video]:object-cover">
                  <ParticipantView
                    participant={localParticipant}
                    trackType="videoTrack"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-500">
                    <VideoOff className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-medium">Connecting camera…</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-gray-900/80 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-gray-800 z-10">
                You (Self Preview)
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-3.5">
            <button
              onClick={toggleMic}
              aria-label="Toggle Microphone"
              className={`p-3 sm:p-4 rounded-xl border transition-all ${
                isMicMuted ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200'
              }`}
            >
              {isMicMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <button
              onClick={toggleVideo}
              aria-label="Toggle Camera"
              className={`p-3 sm:p-4 rounded-xl border transition-all ${
                isCameraOff ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200'
              }`}
            >
              {isCameraOff ? <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Video className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            <button
              onClick={onEndCall}
              className="p-3 sm:p-4 rounded-xl bg-red-600 border border-red-500 text-white hover:bg-red-700 transition shadow-lg flex items-center gap-2 font-bold text-xs sm:text-sm"
            >
              <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" /> {isDoctor ? 'End Call' : 'Leave Call'}
            </button>
          </div>
        </section>

        <aside className="space-y-4 sm:space-y-6 overflow-y-auto">
          {callDetails?.userData && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-400" /> Patient Medical File
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-800 pb-1.5 text-xs">
                  <span className="text-gray-400">Name</span>
                  <span className="font-semibold text-gray-200">{callDetails.userData.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5 text-xs">
                  <span className="text-gray-400">Blood Group</span>
                  <span className="font-semibold text-red-400">{callDetails.userData.bloodGroup || 'Not Selected'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-1.5 text-xs">
                  <span className="text-gray-400">Gender | Age</span>
                  <span className="font-semibold text-gray-200">
                    {callDetails.userData.gender} |{' '}
                    {callDetails.userData.dob ? new Date().getFullYear() - new Date(callDetails.userData.dob).getFullYear() : 'N/A'} yrs
                  </span>
                </div>
              </div>
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 space-y-1">
                <p className="text-[9px] text-red-400 font-bold uppercase tracking-wider">Known Allergies</p>
                <p className="text-xs font-semibold text-gray-300">{callDetails.userData.allergies || 'None reported'}</p>
              </div>
            </div>
          )}

          {callDetails?.userData && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> Checkup Summary
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-3 gap-2 bg-gray-950 border border-gray-800 p-2 rounded-xl text-center">
                  <div>
                    <span className="text-[9px] text-gray-400 block">Temp</span>
                    <span className="font-bold text-emerald-400 text-xs mt-0.5 block flex items-center justify-center gap-0.5">
                      <Thermometer className="w-3 h-3" /> 98.6°F
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block">Pulse</span>
                    <span className="font-bold text-emerald-400 text-xs mt-0.5 block flex items-center justify-center gap-0.5">
                      <Heart className="w-3 h-3" /> 72 bpm
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block">BP</span>
                    <span className="font-bold text-emerald-400 text-xs mt-0.5 block">120/80</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Symptoms</p>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed">Fever, cough, mild headache over past 3 days.</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}

const WaitingRoom = ({ callDetails, parseDocData, onRefresh, onBack }) => {
  const docInfo = parseDocData(callDetails?.docData)
  const [timeRemaining, setTimeRemaining] = useState(() =>
    getTimeUntilSlot(callDetails?.slotDate, callDetails?.slotTime)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeUntilSlot(callDetails?.slotDate, callDetails?.slotTime))
    }, 1000)
    return () => clearInterval(timer)
  }, [callDetails?.slotDate, callDetails?.slotTime])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        <div className="relative mx-auto w-24 h-24">
          <img
            src={docInfo.image}
            alt={docInfo.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-lg bg-indigo-950"
          />
          <div className="absolute -bottom-2 -right-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 p-1.5 rounded-xl shadow-md">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Waiting Room
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white pt-2">Dr. {docInfo.name}</h2>
          <p className="text-xs text-gray-400">{docInfo.speciality || 'General Physician'}</p>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 text-left space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-gray-800 pb-2">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Slot Date
            </span>
            <span className="font-semibold text-gray-200">{callDetails?.slotDate}</span>
          </div>

          <div className="flex items-center justify-between text-xs border-b border-gray-800 pb-2">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" /> Slot Time
            </span>
            <span className="font-semibold text-emerald-400 font-mono">{callDetails?.slotTime}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Room Status
            </span>
            <span className="font-semibold text-amber-400">{timeRemaining || 'Awaiting slot'}</span>
          </div>
        </div>

        <div className="text-xs text-gray-400 leading-relaxed bg-indigo-950/30 border border-indigo-900/40 rounded-xl p-3">
          The video stream activates automatically once your physician begins the consultation or when your scheduled slot time arrives.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onBack}
            className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-semibold transition border border-gray-700 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> My Appointments
          </button>
          <button
            onClick={onRefresh}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Check Status
          </button>
        </div>
      </div>
    </div>
  )
}

const VideoCall = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(window.location.search)
  const urlDToken = queryParams.get('dToken')
  const userToken = localStorage.getItem('token')
  const isDoctor = !!urlDToken
  const authHeaders = isDoctor ? { dtoken: urlDToken } : { token: userToken }

  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)
  const [callDetails, setCallDetails] = useState(null)
  const [isWaiting, setIsWaiting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  const activeClientRef = useRef(null)
  const activeCallRef = useRef(null)

  const parseDocData = useCallback((docDataStr) => {
    if (!docDataStr) return { name: 'Doctor', image: 'https://via.placeholder.com/150' }
    if (typeof docDataStr === 'object') return docDataStr
    try { return JSON.parse(docDataStr) } catch {
      const nameMatch = docDataStr.match(/name:\s*'([^']+)'/) || docDataStr.match(/name:\s*"([^"]+)"/)
      const imageMatch = docDataStr.match(/image:\s*'([^']+)'/) || docDataStr.match(/image:\s*"([^"]+)"/)
      return {
        name: nameMatch ? nameMatch[1] : 'Doctor',
        image: imageMatch ? imageMatch[1] : 'https://via.placeholder.com/150',
      }
    }
  }, [])

  const connectStreamCall = useCallback(async (details) => {
    try {
      const tokenRes = await axios.get(`${backendUrl}/api/video/token`, { headers: authHeaders })
      if (!tokenRes.data.success) {
        throw new Error('Token generation failed')
      }

      const { token: streamToken, apiKey, userId } = tokenRes.data
      const user = { id: userId, type: 'authenticated' }
      const videoClient = new StreamVideoClient({ apiKey, user, token: streamToken })
      setClient(videoClient)
      activeClientRef.current = videoClient

      const callId = details.videoCallId
      const videoCall = videoClient.call('default', callId)
      await videoCall.join({ create: true })
      setCall(videoCall)
      activeCallRef.current = videoCall

      try { await videoCall.camera.enable() } catch (e) {
        console.warn('Camera enable failed:', e.message)
      }
      try { await videoCall.microphone.enable() } catch (e) {
        console.warn('Microphone enable failed:', e.message)
      }
      setIsWaiting(false)
      setLoading(false)
    } catch (err) {
      console.error('Stream connection error:', err)
      setError(err.message || 'Failed to connect stream')
      setLoading(false)
    }
  }, [backendUrl, authHeaders])

  const checkAndInitSession = useCallback(async () => {
    try {
      const detailsRes = await axios.get(
        `${backendUrl}/api/video/call-details/${appointmentId}`,
        { headers: authHeaders }
      )
      if (!detailsRes.data.success) {
        toast.error('Failed to load call details')
        navigate('/')
        return
      }

      const details = detailsRes.data
      setCallDetails(details)

      const isDoctorLive = details.videoCallStatus === 'active'
      const isSlotReached = isSlotTimeReached(details.slotDate, details.slotTime)
      const canAccess = isDoctor || isDoctorLive || isSlotReached

      if (canAccess) {
        if (!activeCallRef.current) {
          await connectStreamCall(details)
        }
      } else {
        setIsWaiting(true)
        setLoading(false)
      }
    } catch (err) {
      console.error('Session init error:', err)
      setError(err.message || 'Failed to initialize session')
      setLoading(false)
    }
  }, [appointmentId, authHeaders, backendUrl, isDoctor, navigate, connectStreamCall])

  useEffect(() => {
    checkAndInitSession()

    // Setup polling for waiting room if not connected yet
    const interval = setInterval(() => {
      if (!activeCallRef.current) {
        checkAndInitSession()
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      if (activeCallRef.current) {
        activeCallRef.current.leave().catch(console.error)
      }
      if (activeClientRef.current) {
        activeClientRef.current.disconnectUser().catch(console.error)
      }
    }
  }, [checkAndInitSession])

  const endCall = useCallback(async () => {
    try {
      if (isDoctor) {
        await axios.post(
          `${backendUrl}/api/video/end-call`,
          { appointmentId },
          { headers: { dtoken: urlDToken } }
        )
        toast.success('Consultation ended & appointment marked as completed')
      } else {
        toast.info('You have left the call')
      }
      if (call) await call.leave()
      if (client) await client.disconnectUser()
      navigate(isDoctor ? '/doctor-appointments' : '/my-appointment')
    } catch (err) {
      console.error('End call error:', err)
      navigate('/')
    }
  }, [call, client, isDoctor, appointmentId, urlDToken, backendUrl, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white space-y-4 font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
        <p className="text-xs font-semibold tracking-wider uppercase text-gray-400">Verifying Consultation Schedule…</p>
      </div>
    )
  }

  if (isWaiting && !isDoctor) {
    return (
      <WaitingRoom
        callDetails={callDetails}
        parseDocData={parseDocData}
        onRefresh={checkAndInitSession}
        onBack={() => navigate('/my-appointment')}
      />
    )
  }

  if (error || !client || !call) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white space-y-4 p-4 font-sans">
        <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
          <VideoOff className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-base sm:text-lg font-bold text-red-400 text-center">Failed to connect to video service</p>
        <p className="text-xs text-gray-400 max-w-md text-center leading-relaxed">
          {error || 'Could not establish the video call. Check network or Stream keys and try again.'}
        </p>
        <button
          onClick={() => navigate(isDoctor ? '/doctor-appointments' : '/my-appointment')}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs sm:text-sm font-semibold transition"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI
          isDoctor={isDoctor}
          callDetails={callDetails}
          parseDocData={parseDocData}
          onEndCall={endCall}
        />
      </StreamCall>
    </StreamVideo>
  )
}

export default VideoCall
