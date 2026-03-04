import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays, ClipboardCheck, Users, X, Send, Loader2 } from 'lucide-react';
import { fetchNotifications } from '../../../thunks/getNotificationsThunk';
import { sendChatMessage } from '../../../thunks/chatBotThunk';
import { addUserMessage, clearMessages } from '../../../feature/chatBotSlice';
import animalGroomingImg from '../../../assets/animalgrooming.jpg';
import groomingImg from '../../../assets/grooming.jpg';
import veterinarianImg from '../../../assets/veterinarian_2.jpg';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

export default function HomePage() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const { messages, loading: chatLoading } = useSelector((state) => state.chatBot);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      image: animalGroomingImg,
      title: 'Professional Animal Grooming Services',
      description: 'Keep your pets looking their best with our expert grooming services'
    },
    {
      image: groomingImg,
      title: 'Complete Pet Care Solutions',
      description: 'From basic grooming to specialized treatments for your beloved pets'
    },
    {
      image: veterinarianImg,
      title: 'Expert Veterinary Care',
      description: 'Quality healthcare services from experienced veterinary professionals'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const recentNotifications = notifications.slice(0, 3);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || chatLoading) return;

    const message = messageInput.trim();
    setMessageInput('');

    dispatch(addUserMessage(message));

    dispatch(sendChatMessage({ message }));
  };

  const handleChatOpen = () => {
    setIsChatOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        dispatch(addUserMessage('Hello'));
        dispatch(sendChatMessage({ message: 'Hello' }));
      }, 100);
    }
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  const handleClearChat = () => {
    dispatch(clearMessages());
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Image Slider */}
      <div className="relative w-full h-[260px] sm:h-[300px] lg:h-[340px] rounded-2xl overflow-hidden border border-zinc-200 shadow-sm">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">{slide.title}</h2>
                <p className="text-sm sm:text-base opacity-90">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2.5 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2.5 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 - Get Appointment */}
        <div
          onClick={() => navigate('/dashboard/appointment')}
          className="bg-white rounded-xl border border-rose-200 shadow-sm p-6 min-h-[172px] hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-11 h-11 bg-[#EFE8DC] border border-[#DED7CB] rounded-lg flex items-center justify-center mb-4">
            <CalendarDays className="w-5 h-5 text-[#2F3A34]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Get Appointment</h3>
          <p className="text-sm text-gray-600">Schedule a new appointment with a professional</p>
        </div>

        {/* Card 2 - My Appointments */}
        <div
          onClick={() => navigate('/dashboard/my-appointments')}
          className="bg-white rounded-xl border border-rose-200 shadow-sm p-6 min-h-[172px] hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-11 h-11 bg-[#EFE8DC] border border-[#DED7CB] rounded-lg flex items-center justify-center mb-4">
            <ClipboardCheck className="w-5 h-5 text-[#2F3A34]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">My Appointments</h3>
          <p className="text-sm text-gray-600">View and manage your scheduled appointments</p>
        </div>

        {/* Card 3 - View Available Professionals */}
        <div
          onClick={() => navigate('/dashboard/professionals')}
          className="bg-white rounded-xl border border-rose-200 shadow-sm p-6 min-h-[172px] hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-11 h-11 bg-[#EFE8DC] border border-[#DED7CB] rounded-lg flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-[#2F3A34]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">View Available Professionals</h3>
          <p className="text-sm text-gray-600">Browse and connect with healthcare experts</p>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Notifications</h2>
        <div className="space-y-3">
          {recentNotifications.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <p className="text-sm text-gray-500">No notifications at the moment</p>
            </div>
          ) : (
            recentNotifications.map((notification) => (
              <div key={notification.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  {!notification.read && <span className="ml-2 w-2 h-2 rounded-full bg-rose-500 mt-1.5"></span>}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {formatTimeAgo(notification.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat with Professionals Card */}
      <div className="bg-gradient-to-r from-rose-700 to-pink-700 rounded-2xl border border-rose-400/60 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Chat with Professionals</h2>
          {isChatOpen && (
            <div className="flex gap-2">
              <button
                onClick={handleClearChat}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full px-3 py-1 text-sm transition-all"
              >
                Clear
              </button>
              <button
                onClick={handleChatClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {!isChatOpen ? (
          <div className="text-center py-8">
            <p className="text-lg text-white opacity-90 mb-6">
              Connect with healthcare professionals instantly for guidance and support. 
              Ask about vet/groomer availability or general pet care questions!
            </p>
            <button
              type="button"
              onClick={handleChatOpen}
              className="bg-white text-rose-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors"
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-zinc-200 h-96 flex flex-col">
            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${
                        message.sender === 'user'
                          ? 'bg-rose-600'
                          : message.isError
                          ? 'bg-red-500'
                          : 'bg-pink-500'
                      }`}
                    >
                      {message.sender === 'user' ? 'U' : 'A'}
                    </div>
                    <div
                      className={`rounded-lg p-3 max-w-xs ${
                        message.sender === 'user'
                          ? 'bg-rose-600 text-white'
                          : message.isError
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {chatLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        <p className="text-sm text-gray-600">Typing...</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Ask about vet/groomer availability or pet care..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-800"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={chatLoading || !messageInput.trim()}
                  className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {chatLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}