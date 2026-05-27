import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  List,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r shadow-lg fixed h-screen">

        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-primary-700">Aetherix</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarLink to="" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink to="profile-verification" icon={Users} label="Profile Verification" />
          <SidebarLink to="categories" icon={List} label="Complaint Categories" />
          <SidebarLink to="complaints" icon={ShieldCheck} label="Complaints" />
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-72">
        <div className="bg-white border-b px-8 py-5">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
        </div>

        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
    >
      <Icon size={22} />
      <span>{label}</span>
    </Link>
  );
}