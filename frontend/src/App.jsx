import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './layouts/Navbar';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileCompletion from './pages/ProfileCompletion';
import MyComplaints from './pages/MyComplaints';
import AllApprovedComplaints from './pages/AllApprovedComplaints';   // ← THIS WAS MISSING

import AdminDashboard from './pages/Admin/AdminDashboard';
import DashboardOverview from './pages/Admin/DashboardOverview';
import ProfileVerification from './pages/Admin/ProfileVerification';
import CategoryManagement from './pages/Admin/CategoryManagement';
import ComplaintVerification from './pages/Admin/ComplaintVerification';

import ProtectedRoute from './components/ProtectedRoute';
import ComplaintDetail from './pages/ComplaintDetails';
import HotspotComplaints from './pages/HotspotComplaint';
import DepartmentManagement from './pages/Admin/DepartmentManagement';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-light">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/submit-complaint" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
          <Route path="/my-complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
          <Route path="/profile-completion" element={<ProtectedRoute><ProfileCompletion /></ProtectedRoute>} />
          <Route path="/complaints/:reference_id" element={<ProtectedRoute><ComplaintDetail /></ProtectedRoute>} />
          <Route path="/hotspots" element={<ProtectedRoute><HotspotComplaints /></ProtectedRoute>} />
          
          {/* New Route */}
          <Route path="/all-approved-complaints" element={<ProtectedRoute><AllApprovedComplaints /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>}>
            <Route index element={<DashboardOverview />} />
            <Route path="profile-verification" element={<ProfileVerification />} />
            <Route path="complaint-verification" element={<ComplaintVerification />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />  
            <Route path="complaints" element={<div className="p-10 text-xl">Complaints Management Coming Soon</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;