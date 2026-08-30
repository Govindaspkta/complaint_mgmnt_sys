import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  List,
  Building2,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.split("/").pop() || "";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout from Admin Panel?")) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <div className="w-72 bg-white border-r shadow-lg fixed h-screen overflow-y-auto flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-primary-700">Hamro Aawaj</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          <SidebarLink
            to=""
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={currentPath === "" || currentPath === "admin"}
          />

          <SidebarLink
            to="profile-verification"
            icon={Users}
            label="Profile Verification"
            isActive={currentPath === "profile-verification"}
          />

          <SidebarLink
            to="departments"
            icon={Building2}
            label="Departments"
            isActive={currentPath === "departments"}
          />

          <SidebarLink
            to="categories"
            icon={List}
            label="Complaint Categories"
            isActive={currentPath === "categories"}
          />

          <SidebarLink
            to="complaint-verification"
            icon={ShieldCheck}
            label="Complaint Verification"
            isActive={currentPath === "complaint-verification"}
          />

          <SidebarLink
            to="complaints"
            icon={ShieldCheck}
            label="All Complaints"
            isActive={currentPath === "complaints"}
          />
        </nav>

        {/* Logout in Sidebar */}
        <div className="p-4 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-72">
        {/* Simple top navbar - brand only */}
        <div className="bg-white border-b px-8 py-5 sticky top-0 z-10 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Hamro Aawaj
            <span className="text-gray-500 text-base font-normal ml-2">Admin</span>
          </h2>
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