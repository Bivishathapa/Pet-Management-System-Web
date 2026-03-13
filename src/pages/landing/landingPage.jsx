import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Heart, Users, PawPrint, Shield, Clock } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            PetPerfect
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-white bg-linear-to-r from-blue-500 to-indigo-500 font-bold hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg transform hover:-translate-y-0.5 rounded-xl transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Premium Pet Care
              </span>
              <br />
              <span className="text-gray-800">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Book appointments with certified veterinarians and professional groomers for your beloved pets
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Start Free Today
            </button>
          </div>
        </div>
      </div>

      {/* Quick Features */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-bl from-cyan-50 via-blue-50 to-indigo-50">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1.2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all border border-gray-100">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Schedule appointments in just a few clicks</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all border border-gray-100">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quality Care</h3>
              <p className="text-gray-600">Certified and experienced professionals</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all border border-gray-100">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Trusted Network</h3>
              <p className="text-gray-600">Join thousands of happy pet parents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Everything You Need Section */}
      <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete platform designed to make pet care simple and stress-free
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Easy Scheduling</h3>
              <p className="text-sm text-gray-600">Book appointments with top-rated vets and groomers instantly</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Verified Professionals</h3>
              <p className="text-sm text-gray-600">All vets and groomers are certified and background-checked</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Access care recommendations and emergency contacts anytime</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transform hover:-translate-y-2 transition-all">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Complete Pet Care</h3>
              <p className="text-sm text-gray-600">From routine checkups to specialized treatments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-tr from-purple-50 via-pink-50 to-blue-50">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 text-3xl mb-4">
                📝
              </div>
              <div className="text-5xl font-extrabold bg-linear-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent mb-3">01</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up and add your pet's information in minutes</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100 text-3xl mb-4">
                🔍
              </div>
              <div className="text-5xl font-extrabold bg-linear-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mb-3">02</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Find Professionals</h3>
              <p className="text-gray-600">Browse verified vets and groomers near you</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-purple-100 to-pink-100 text-3xl mb-4">
                ✨
              </div>
              <div className="text-5xl font-extrabold bg-linear-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-3">03</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Book & Enjoy</h3>
              <p className="text-gray-600">Schedule appointments and get premium care</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join PetPerfect today and give your pets the care they deserve
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
}