import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function ProfileCompletion() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    citizenship_number: '',
    address: '',
    date_of_birth: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call your backend profile completion API
      const res = await axios.patch('http://127.0.0.1:8000/auth/profile/complete/', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Update user in context
      login({ ...user, ...res.data.user }, localStorage.getItem('token'));
      
      alert("✅ Profile Completed Successfully!");
      navigate('/submit-complaint');

    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center mb-2">Complete Your Profile</h2>
        <p className="text-center text-gray-600 mb-10">This is required before submitting complaints</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label>Citizenship Number / नागरिकता नम्बर *</label>
            <input
              type="text"
              name="citizenship_number"
              value={formData.citizenship_number}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="123456789012"
            />
          </div>

          <div>
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field h-24"
              placeholder="Enter your full address"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label>Date of Birth</label>
              <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg"
          >
            {loading ? "Saving..." : "Complete Profile & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}