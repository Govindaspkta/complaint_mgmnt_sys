import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, ShieldCheck, List, 
  CheckCircle, XCircle, PlusCircle, BarChart3 
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 shadow-lg fixed h-screen overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-primary-700">Aetherix</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === 'overview' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <LayoutDashboard size={22} />
              Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab('profiles')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === 'profiles' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <Users size={22} />
              Profile Verification
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === 'categories' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <List size={22} />
              Complaint Categories
            </button>

            <button
              onClick={() => setActiveTab('complaints')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === 'complaints' ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <ShieldCheck size={22} />
              Complaint Verification
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Top Navbar */}
        <div className="bg-white border-b px-8 py-5 flex items-center justify-between sticky top-0 z-50">
          <h2 className="text-2xl font-semibold text-gray-800">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'profiles' && 'User Profile Verification'}
            {activeTab === 'categories' && 'Category Management'}
            {activeTab === 'complaints' && 'Complaint Management'}
          </h2>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-gray-500">Kathmandu, Nepal</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              👨‍💼
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* ==================== OVERVIEW TAB ==================== */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <Users size={28} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">248</p>
                      <p className="text-gray-600">Total Users</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">87</p>
                      <p className="text-gray-600">Pending Verification</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                      <CheckCircle size={28} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">1,284</p>
                      <p className="text-gray-600">Total Complaints</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                      <BarChart3 size={28} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">14</p>
                      <p className="text-gray-600">Active Categories</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== PROFILE VERIFICATION TAB ==================== */}
          {activeTab === 'profiles' && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Pending Profile Verifications</h3>
                <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium">87 Pending</span>
              </div>

              {/* Profile Cards / Table will go here later */}
              <div className="p-6">
                <p className="text-center text-gray-500 py-12">Profile verification table will be implemented here...</p>
                {/* You can put dynamic table or cards here later */}
              </div>
            </div>
          )}

          {/* ==================== CATEGORY MANAGEMENT TAB ==================== */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3xl shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Complaint Categories</h3>
                <button className="btn-primary flex items-center gap-2">
                  <PlusCircle size={20} />
                  नयाँ Category थप्नुहोस्
                </button>
              </div>
              <div className="p-6">
                <p className="text-center text-gray-500 py-12">Category management table will be here...</p>
              </div>
            </div>
          )}

          {/* ==================== COMPLAINTS TAB (Placeholder) ==================== */}
          {activeTab === 'complaints' && (
            <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
              <ShieldCheck size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700">Complaint Verification</h3>
              <p className="text-gray-500 mt-3">You said you will work on complaint backend later.<br />This section will be ready soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}