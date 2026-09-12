import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Navbar from './layouts/Navbar';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileCompletion from './pages/ProfileCompletion';
import MyComplaints from './pages/MyComplaints';
import AllApprovedComplaints from './pages/AllApprovedComplaints';

import DashboardOverview from './pages/Admin/DashboardOverview';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProfileVerification from './pages/Admin/ProfileVerification';
import CategoryManagement from './pages/Admin/CategoryManagement';
import ComplaintVerification from './pages/Admin/ComplaintVerification';
import DepartmentManagement from './pages/Admin/DepartmentManagement';
import AdminAllComplaints from './pages/Admin/AdminAllComplaints';

import ProtectedRoute from './components/ProtectedRoute';
import ComplaintDetail from './pages/ComplaintDetails';
import HotspotComplaints from './pages/HotspotComplaint';

// User layout
function UserLayout() {
  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>

        {/* USER ROUTES */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/submit-complaint" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
          <Route path="/complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
          <Route path="/my-complaints" element={<ProtectedRoute><MyComplaints /></ProtectedRoute>} />
          <Route path="/profile-completion" element={<ProtectedRoute><ProfileCompletion /></ProtectedRoute>} />
          <Route path="/complaints/:reference_id" element={<ProtectedRoute><ComplaintDetail /></ProtectedRoute>} />
          <Route path="/hotspots" element={<ProtectedRoute><HotspotComplaints /></ProtectedRoute>} />
          <Route path="/all-approved-complaints" element={<ProtectedRoute><AllApprovedComplaints /></ProtectedRoute>} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="complaints" element={<AdminAllComplaints />} />
          <Route path="profile-verification" element={<ProfileVerification />} />
          <Route path="complaint-verification" element={<ComplaintVerification />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="departments" element={<DepartmentManagement />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;