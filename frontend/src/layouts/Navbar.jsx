import { Link } from 'react-router-dom';
import { FileText, Home, PlusCircle, Users, LogIn } from 'lucide-react';

export default function Navbar() {
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
              <h1 className="text-2xl font-bold tracking-tight text-white">Hamro Aawaj</h1>
              <p className="text-[10px] text-gray-400 -mt-1">Complaint System</p>
            </div>
          </div>

          {/* Menu */}
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="flex items-center gap-2 hover:text-accent transition">
              <Home size={20} /> Home
            </Link>
            <Link to="/complaints" className="flex items-center gap-2 hover:text-accent transition">
              <Users size={20} /> All Complaints
            </Link>
            <Link to="/submit-complaint" className="flex items-center gap-2 hover:text-accent transition">
              <PlusCircle size={20} /> Lodge Complaint
            </Link>

            <Link 
              to="/login"
              className="btn-outline flex items-center gap-2"
            >
              <LogIn size={18} /> Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}