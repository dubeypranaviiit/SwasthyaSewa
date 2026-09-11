import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Sparkles, HelpCircle } from 'lucide-react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Namaste! Welcome to SwasthyaSewa. How can I assist you with your health or bookings today?' 
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const quickActions = [
    { label: 'Book Appointment', action: 'book' },
    { label: 'Symptom Checker', action: 'symptoms' },
    { label: 'Refund Policies', action: 'refunds' },
    { label: 'Contact Support', action: 'contact' }
  ]

  const handleQuickAction = (action) => {
    let userMsg = ''
    let botResponse = ''
    
    if (action === 'book') {
      userMsg = 'How do I book a doctor appointment?'
      botResponse = 'Booking is simple! Head to the "ALL DOCTORS" page, choose a specialist, select an available date and time slot, and click "Book an appointment". You can pay online using UPI/Cards via Razorpay.'
    } else if (action === 'symptoms') {
      userMsg = 'Tell me about the Symptom Checker.'
      botResponse = 'Our AI Symptom Checker helps analyze your symptoms, logs vital signs like temperature and BP, estimates severity risk, and recommends which medical specialty to consult. You can access it via the "ONLINE CHECKUP" nav menu.'
    } else if (action === 'refunds') {
      userMsg = 'What is your refund policy?'
      botResponse = 'Refunds are automatically initiated if you cancel your appointment at least 2 hours prior to the slot. The refunded amount will be credited back to your original payment method via Razorpay within 5-7 working days.'
    } else if (action === 'contact') {
      userMsg = 'How do I reach clinic support?'
      botResponse = 'You can reach us at support@swasthyasewa.com or call +91 8092599674. Our office is located at Booty More, Ranchi, Jharkhand, India.'
    }

    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: userMsg }
    ])

    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: botResponse }
      ])
      setIsTyping(false)
    }, 800)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userText = inputText.trim()
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: userText }
    ])
    setInputText('')
    setIsTyping(true)

    setTimeout(() => {
      let botResponse = "I'm here to help, but I couldn't quite understand that. You can ask me about scheduling appointments, checking symptoms, payments/refunds, or contact support."
      const lowerText = userText.toLowerCase()

      if (lowerText.includes('book') || lowerText.includes('doctor') || lowerText.includes('appoint')) {
        botResponse = 'To schedule an appointment, click on "ALL DOCTORS" in the navbar. Select a doctor based on specialty, choose your slot date/time, and complete the booking. You can also link your checkup reports during booking!'
      } else if (lowerText.includes('checkup') || lowerText.includes('symptom') || lowerText.includes('diagnos') || lowerText.includes('feel')) {
        botResponse = 'If you are feeling unwell, you can use our Online Symptom Checker. Go to the "ONLINE CHECKUP" page to log your vitals and obtain automated medical specialties guidance.'
      } else if (lowerText.includes('cancel') || lowerText.includes('refund') || lowerText.includes('money') || lowerText.includes('return')) {
        botResponse = 'We support automatic refunds for online payment cancellations initiated up to 2 hours before the slot. Refunds are completed via Razorpay in 5-7 business days.'
      } else if (lowerText.includes('contact') || lowerText.includes('support') || lowerText.includes('help') || lowerText.includes('phone') || lowerText.includes('email')) {
        botResponse = 'You can contact clinical support at support@swasthyasewa.com or call +91 8092599674. We are located at Booty More, Ranchi, Jharkhand.'
      } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        botResponse = 'Hello! Hope you are doing well. How can I help you today with bookings or symptom checks at SwasthyaSewa?'
      } else if (lowerText.includes('fever') || lowerText.includes('cough') || lowerText.includes('headache') || lowerText.includes('pain')) {
        botResponse = 'It looks like you are describing symptoms. I highly recommend running through our diagnostic checkup at the "ONLINE CHECKUP" tab to check severity levels and get recommended doctor departments.'
      }

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: botResponse }
      ])
      setIsTyping(false)
    }, 1000)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
        className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-w-sm h-[480px] max-h-[75vh] bg-white border border-gray-150 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 z-50">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm tracking-tight flex items-center gap-1">
                  SewaBot <Sparkles className="w-3 h-3 text-yellow-300" />
                </h4>
                <p className="text-[10px] text-white/80">Online Help Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white border text-gray-700 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-50 border flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-white border rounded-2xl rounded-bl-none px-3.5 py-2.5 text-xs text-gray-400 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 bg-gray-50 border-t flex flex-wrap gap-1 max-h-[80px] overflow-y-auto">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary rounded-full text-[10px] font-semibold transition shadow-sm"
                >
                  <HelpCircle className="w-3 h-3" />
                  {action.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              placeholder="Ask me something..."
              className="flex-1 px-3 py-2 border rounded-xl text-xs outline-none focus:border-primary bg-gray-50 focus:bg-white transition"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-opacity-95 transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Chatbot
