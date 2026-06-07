import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './layouts/Navbar';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileCompletion from './pages/ProfileCompletion';
import MyComplaints from './pages/MyComplaints';

import AdminDashboard from './pages/Admin/AdminDashboard';
import DashboardOverview from './pages/Admin/DashboardOverview';
import ProfileVerification from './pages/Admin/ProfileVerification';
import CategoryManagement from './pages/Admin/CategoryManagement';
import ComplaintVerification from './pages/Admin/ComplaintVerification';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-light">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-completion" element={<ProfileCompletion />} />
          <Route path="/complaints" element={<MyComplaints />} />

          {/* PUBLIC COMPLAINTS */}
          <Route path="/complaints" element={<div className="p-20 text-center text-3xl">Public Complaints Page - Coming Soon</div>} />

          {/* ADMIN SECTION - PROPER NESTED ROUTING */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="profile-verification" element={<ProfileVerification />} />\
            <Route path="complaint-verification" element={<ComplaintVerification />} />

            <Route path="categories" element={<CategoryManagement />} />
            <Route path="complaints" element={<div className="p-10 text-xl">Complaints Management Coming Soon</div>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;