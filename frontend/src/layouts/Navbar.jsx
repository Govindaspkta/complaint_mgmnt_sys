import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Home,
  PlusCircle,
  Users,
  LogIn,
  LogOut,
  Moon
} from 'lucide-react';

import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  // 🔥 Load user and listen for auth changes
  useEffect(() => {

    const loadUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Initial load
    loadUser();

    // Listen for updates
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };

  }, []);

  // 🔥 Close dropdown on outside click
  useEffect(() => {

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // 🔥 Logout
  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // notify navbar instantly
    window.dispatchEvent(new Event("storage"));

    navigate("/login");
  };

  return (
    <nav className="bg-dark text-white shadow-xl sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Hamro Aawaj
              </h1>

              <p className="text-[10px] text-gray-400 -mt-1">
                Complaint System
              </p>
            </div>

          </div>

          {/* Menu */}
          <div className="flex items-center gap-8 text-sm font-medium">

            <Link
              to="/"
              className="flex items-center gap-2 hover:text-accent"
            >
              <Home size={20} />
              Home
            </Link>

            <Link
              to="/complaints"
              className="flex items-center gap-2 hover:text-accent"
            >
              <Users size={20} />
              All Complaints
            </Link>

            <Link
              to="/submit-complaint"
              className="flex items-center gap-2 hover:text-accent"
            >
              <PlusCircle size={20} />
              Lodge Complaint
            </Link>

            {/* 🔥 Auth Section */}
            {!user ? (

              <Link
                to="/login"
                className="btn-outline flex items-center gap-2"
              >
                <LogIn size={18} />
                Login
              </Link>

            ) : (

              <div
                className="relative"
                ref={dropdownRef}
              >

                {/* Profile Circle */}
                <div
                  onClick={() => setOpen(!open)}
                  className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer font-bold"
                >
                  {user.username?.charAt(0).toUpperCase() || "U"}
                </div>

                {/* Dropdown */}
                {open && (

                  <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-xl shadow-lg py-2">

                    <div className="px-4 py-2 border-b text-sm font-semibold">
                      {user.username}
                    </div>

                    <button
                      onClick={() =>
                        alert("Theme toggle coming soon")
                      }
                      className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                    >
                      <Moon size={16} />
                      Toggle Theme
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm text-red-500"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </nav>
  );
}