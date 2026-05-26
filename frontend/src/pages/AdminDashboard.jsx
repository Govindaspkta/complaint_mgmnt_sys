import React, { useState } from 'react';
import { LayoutDashboard, Users, ShieldCheck, List } from 'lucide-react';

import CategoryManagement from './CategoryManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r shadow-lg fixed h-screen overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-primary-700">Aetherix</h1>
          <p className="text-sm text-gray-500">Admin Panel • Nepal</p>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            <TabButton activeTab={activeTab} tab="overview" setActiveTab={setActiveTab} icon={LayoutDashboard} label="Dashboard Overview" />
            <TabButton activeTab={activeTab} tab="profiles" setActiveTab={setActiveTab} icon={Users} label="Profile Verification" />
            <TabButton activeTab={activeTab} tab="categories" setActiveTab={setActiveTab} icon={List} label="Complaint Categories" />
            <TabButton activeTab={activeTab} tab="complaints" setActiveTab={setActiveTab} icon={ShieldCheck} label="Complaint Management" />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        <div className="bg-white border-b px-8 py-5 flex items-center justify-between sticky top-0 z-50">
          <h2 className="text-2xl font-semibold text-gray-800">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'profiles' && 'Profile Verification'}
            {activeTab === 'categories' && 'Category Management'}
            {activeTab === 'complaints' && 'Complaint Management'}
          </h2>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-gray-500">Kathmandu, Nepal</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-xl">👨‍💼</div>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'profiles' && <ProfileVerification />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'complaints' && <ComplaintManagementPlaceholder />}
        </div>
      </div>
    </div>
  );
}

// Small helper for clean sidebar
const TabButton = ({ activeTab, tab, setActiveTab, icon: Icon, label }) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
      activeTab === tab ? 'bg-primary-50 text-primary-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
    }`}
  >
    <Icon size={22} />
    {label}
  </button>
);

// Placeholder components
const Overview = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className="bg-white rounded-2xl p-6 shadow-sm">Total Users: 248</div>
    <div className="bg-white rounded-2xl p-6 shadow-sm">Pending Verification: 87</div>
    <div className="bg-white rounded-2xl p-6 shadow-sm">Total Complaints: 1,284</div>
    <div className="bg-white rounded-2xl p-6 shadow-sm">Active Categories: 14</div>
  </div>
);

const ProfileVerification = () => (
  <div className="bg-white rounded-3xl shadow-sm p-8">
    <h3 className="text-xl font-semibold mb-6">Profile Verification</h3>
    <p className="text-gray-500">Approval system that forwards verified users to government records.</p>
  </div>
);

const ComplaintManagementPlaceholder = () => (
  <div className="bg-white rounded-3xl shadow-sm p-8">
    <h3 className="text-xl font-semibold mb-6">Complaint Management</h3>
    <p className="text-gray-500">Admin approves complaints and forwards to NEA / government bodies using category routing.</p>
  </div>
);