import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileCompletion from './pages/ProfileCompletion';
import MyComplaints  from './pages/MyComplaints';
import CategoryManagement from "./pages/CategoryManagement";
import AdminDashboard from './pages/AdminDashboard';
import ProfileVerification from './pages/ProfileVerification';

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
          <Route path="/profile-verification" element={<ProfileVerification />} />

            <Route path="/my-complaints" element={<MyComplaints />} />
            <Route path="/admin/categories" element={<CategoryManagement />}/>
             <Route path="/admin/dashboard" element={<AdminDashboard />}/>



          <Route path="/complaints" element={<div className="p-20 text-center text-3xl">Public Complaints Page - Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;