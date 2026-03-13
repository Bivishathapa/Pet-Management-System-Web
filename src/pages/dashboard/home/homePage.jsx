import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays, ClipboardCheck, Users, X } from 'lucide-react';
import { fetchNotifications } from '../../../thunks/getNotificationsThunk';
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
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Image Slider */}
      <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden shadow-2xl">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h2 className="text-4xl font-bold mb-3">{slide.title}</h2>
                <p className="text-lg opacity-90">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-3 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-3 transition-all"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 - Get Appointment */}
        <div
          onClick={() => navigate('/dashboard/appointment')}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
        >
          <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
            <CalendarDays className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Get Appointment</h3>
          <p className="text-gray-600">Schedule a new appointment with a professional</p>
        </div>

        {/* Card 2 - My Appointments */}
        <div
          onClick={() => navigate('/dashboard/my-appointments')}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
        >
          <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
            <ClipboardCheck className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">My Appointments</h3>
          <p className="text-gray-600">View and manage your scheduled appointments</p>
        </div>

        {/* Card 3 - View Available Professionals */}
        <div
          onClick={() => navigate('/dashboard/professionals')}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
        >
          <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">View Available Professionals</h3>
          <p className="text-gray-600">Browse and connect with healthcare experts</p>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Notifications</h2>
        <div className="space-y-3">
          {recentNotifications.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <p className="text-sm text-gray-500">No notifications at the moment</p>
            </div>
          ) : (
            recentNotifications.map((notification) => (
              <div key={notification.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></span>
                  )}
                </div>
                <p className="text-xs text-indigo-400 mt-2 font-medium">
                  {formatTimeAgo(notification.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat with Professionals Card */}
      <div className="bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Chat with Professionals</h2>
          {isChatOpen && (
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {!isChatOpen ? (
          <div className="text-center py-8">
            <p className="text-lg text-white opacity-90 mb-6">Connect with healthcare professionals instantly for guidance and support</p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl h-96 flex flex-col">
            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                    P
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Hello! How can I help you today?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                />
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}