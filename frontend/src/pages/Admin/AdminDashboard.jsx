import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  List,
} from "lucide-react";

export default function AdminDashboard() {
  const location = useLocation();

  // Current path for active link
  const currentPath = location.pathname.split('/').pop() || '';

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r shadow-lg fixed h-screen overflow-y-auto">

        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-primary-700">Aetherix</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1">
          <SidebarLink 
            to="" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            isActive={currentPath === '' || currentPath === 'admin'} 
          />
          
          <SidebarLink 
            to="profile-verification" 
            icon={Users} 
            label="Profile Verification" 
            isActive={currentPath === 'profile-verification'} 
          />
          
          <SidebarLink 
            to="categories" 
            icon={List} 
            label="Complaint Categories" 
            isActive={currentPath === 'categories'} 
          />
          
          <SidebarLink 
            to="complaint-verification" 
            icon={ShieldCheck} 
            label="Complaint Verification" 
            isActive={currentPath === 'complaint-verification'} 
          />
          
          <SidebarLink 
            to="complaints" 
            icon={ShieldCheck} 
            label="All Complaints" 
            isActive={currentPath === 'complaints'} 
          />
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-72">
        <div className="bg-white border-b px-8 py-5 sticky top-0 z-10">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
        </div>

        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon: Icon, label, isActive }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? "bg-blue-50 text-blue-700 font-medium" 
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <Icon size={22} />
      <span>{label}</span>
    </Link>
  );
}